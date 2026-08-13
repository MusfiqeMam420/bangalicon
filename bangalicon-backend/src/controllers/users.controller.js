const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");
const { hasSmtpConfig, sendMail } = require("../utils/mailer");
const { getBackendBaseUrl, getFrontendBaseUrl } = require("../utils/publicUrls");
const {
  PRO_DIR,
  createAuthToken,
  createPremiumAccessKey,
  verifyPremiumAccessKey,
  getPremiumRouteUrls,
  readProFile,
  buildPremiumAssetUrl,
} = require("../utils/premiumAccess");

const execFileAsync = promisify(execFile);
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const EMAIL_VERIFY_TTL_MS = 1000 * 60 * 60 * 24;
const SIGNUP_CODE_TTL_MS = 1000 * 60 * 15;
const buildBackendBaseUrl = () => getBackendBaseUrl();
const hashResetToken = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");
const hashEmailVerificationToken = (token) =>
  crypto.createHash("sha256").update(String(token)).digest("hex");
const hashSignupCode = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");
const getGoogleRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI || `${buildBackendBaseUrl()}/api/users/google/callback`;
const hasGoogleAuthConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const getGoogleClient = () =>
  new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, getGoogleRedirectUri());
const encodeState = (payload) => Buffer.from(JSON.stringify(payload)).toString("base64url");
const decodeState = (state) => {
  try {
    return JSON.parse(Buffer.from(String(state || ""), "base64url").toString("utf8"));
  } catch {
    return {};
  }
};

const getAuthFallbackPath = (value, defaultPath = "/login") =>
  typeof value === "string" && value.startsWith("/") ? value : defaultPath;

const maskEmail = (email) => {
  const [localPart = "", domain = ""] = String(email).split("@");
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-2);
  const middleLength = Math.max(localPart.length - visibleStart.length - visibleEnd.length, 0);
  const maskedLocal = `${visibleStart}${"*".repeat(Math.max(middleLength, 4))}${visibleEnd}`;
  return `${maskedLocal}@${domain}`;
};

const createSignupCode = () => String(Math.floor(100000 + Math.random() * 900000));

const buildSignupDisplayName = (email) => {
  const [localPart = "Bangalicon User"] = String(email).split("@");
  return localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Bangalicon User";
};

const buildResetPasswordEmail = (resetUrl) => ({
  subject: "Reset your Bangalicon password",
  text: [
    "Reset your Bangalicon password",
    "",
    "We received a request to reset your password.",
    `Open this link to continue: ${resetUrl}`,
    "",
    "This link will expire in 30 minutes.",
    "If you did not request this, you can ignore this email.",
  ].join("\n"),
  html: `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#171717">
      <div style="margin-bottom:24px">
        <div style="display:inline-block;background:#db161b;color:#fff;padding:10px 16px;border-radius:999px;font-weight:700">
          Bangalicon
        </div>
      </div>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Reset your password</h1>
      <p style="font-size:15px;line-height:1.7;color:#505050;margin:0 0 20px">
        We received a request to reset your Bangalicon password.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:#db161b;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700">
        Reset Password
      </a>
      <p style="font-size:14px;line-height:1.7;color:#6f6f6f;margin:24px 0 0">
        This link expires in 30 minutes. If you did not request this, you can safely ignore this email.
      </p>
      <p style="font-size:13px;line-height:1.7;color:#8a8a8a;margin:24px 0 0;word-break:break-all">
        ${resetUrl}
      </p>
    </div>
  `,
});

const buildVerifyEmail = (verifyUrl) => ({
  subject: "Verify your Bangalicon email",
  text: [
    "Verify your Bangalicon email",
    "",
    "Thanks for creating your account.",
    `Open this link to verify your email: ${verifyUrl}`,
    "",
    "This link will expire in 24 hours.",
  ].join("\n"),
  html: `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#171717">
      <div style="margin-bottom:24px">
        <div style="display:inline-block;background:#db161b;color:#fff;padding:10px 16px;border-radius:999px;font-weight:700">
          Bangalicon
        </div>
      </div>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Verify your email</h1>
      <p style="font-size:15px;line-height:1.7;color:#505050;margin:0 0 20px">
        Thanks for creating your Bangalicon account. Confirm your email to finish setting up access.
      </p>
      <a href="${verifyUrl}" style="display:inline-block;background:#db161b;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700">
        Verify Email
      </a>
      <p style="font-size:14px;line-height:1.7;color:#6f6f6f;margin:24px 0 0">
        This link expires in 24 hours.
      </p>
      <p style="font-size:13px;line-height:1.7;color:#8a8a8a;margin:24px 0 0;word-break:break-all">
        ${verifyUrl}
      </p>
    </div>
  `,
});

const buildSignupCodeEmail = ({ code, email }) => ({
  subject: "Your Bangalicon signup code",
  text: [
    "Your Bangalicon signup code",
    "",
    `Use this verification code to continue signup: ${code}`,
    "",
    `Email: ${email}`,
    "This code will expire in 15 minutes.",
  ].join("\n"),
  html: `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#171717">
      <div style="margin-bottom:24px">
        <div style="display:inline-block;background:#db161b;color:#fff;padding:10px 16px;border-radius:999px;font-weight:700">
          Bangalicon
        </div>
      </div>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Create your account</h1>
      <p style="font-size:15px;line-height:1.7;color:#505050;margin:0 0 18px">
        Use this verification code to continue your Bangalicon signup.
      </p>
      <div style="display:inline-block;background:#f4f5f7;border:1px solid #ececec;border-radius:18px;padding:18px 24px;font-size:34px;letter-spacing:0.35em;font-weight:700;color:#111111">
        ${code}
      </div>
      <p style="font-size:14px;line-height:1.7;color:#6f6f6f;margin:24px 0 0">
        This code expires in 15 minutes. If you did not request it, you can ignore this email.
      </p>
    </div>
  `,
});

const formatUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  emailVerified: Boolean(user.emailVerified),
  plan: user.plan,
  billingCycle: user.billingCycle || null,
  premiumSince: user.premiumSince || null,
  premiumExpiresAt: user.premiumExpiresAt || null,
  avatar: user.avatar || "/avatar/avatar-meow.jpg",
});

const formatAdminUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  avatar: user.avatar || "/avatar/avatar-meow.jpg",
  plan: user.plan,
  billingCycle: user.billingCycle || null,
  status: user.plan === "premium" ? "premium" : "free",
  premiumSince: user.premiumSince || null,
  premiumExpiresAt: user.premiumExpiresAt || null,
  joinedAt: user.createdAt || null,
  updatedAt: user.updatedAt || null,
  lastPayment:
    user.lastDemoPayment && user.lastDemoPayment.paidAt
      ? {
          amount: user.lastDemoPayment.amount ?? null,
          currency: user.lastDemoPayment.currency || "USD",
          paidAt: user.lastDemoPayment.paidAt,
          reference: user.lastDemoPayment.reference || null,
        }
      : null,
});

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const escapePowerShellString = (value) => String(value).replace(/'/g, "''");

const buildPackCss = () => {
  const cssPath = path.join(PRO_DIR, "bangalicon-pro.css");
  const originalCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

  return originalCss
    .replace(/url\(".*?\/(bangalicon-pro\.[a-z0-9]+)(?:[?#].*?)?"\)/gi, 'url("./$1")')
    .replace(/url\('.*?\/(bangalicon-pro\.[a-z0-9]+)(?:[?#].*?)?'\)/gi, 'url("./$1")')
    .replace(/url\((?!["'])[^)]+\/(bangalicon-pro\.[a-z0-9]+)(?:[?#].*?)?\)/gi, 'url("./$1")');
};

const buildPackJson = () => {
  const jsonPath = path.join(PRO_DIR, "bangalicon-pro.json");
  const payload = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : { icons: [] };

  return JSON.stringify(
    {
      ...payload,
      icons: Array.isArray(payload.icons)
        ? payload.icons.map((icon) => ({
            ...icon,
            svgUrl: icon.file ? `./icons/${icon.file}` : icon.svgUrl,
          }))
        : [],
    },
    null,
    2
  );
};

const buildPackReadme = (user) =>
  [
    "Bangalicon Premium Pack",
    "",
    `Account: ${user.email}`,
    `Plan: ${user.billingCycle || "premium"}`,
    "",
    "How to use:",
    "1. Upload this pack to your own project or hosting.",
    "2. Keep the font files next to bangalicon-pro.css.",
    '3. Add <link rel="stylesheet" href="/path-to/bangalicon-pro.css"> to your website.',
    '4. Use icons like <i class="bgp bgp-diamond-star"></i>.',
    "",
    "Important:",
    "- This premium pack is for your licensed premium account.",
    "- Host these files in your own project for production use.",
    "",
  ].join("\n");

const copyDirectoryRecursive = (sourceDir, targetDir) => {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
};

const createPremiumPackArchive = async (user) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "bangalicon-premium-pack-"));
  const packageDir = path.join(tempRoot, "bangalicon-premium-pack");
  const zipPath = path.join(tempRoot, "bangalicon-premium-pack.zip");

  fs.mkdirSync(packageDir, { recursive: true });

  copyDirectoryRecursive(PRO_DIR, packageDir);

  fs.writeFileSync(path.join(packageDir, "bangalicon-pro.css"), buildPackCss(), "utf8");
  fs.writeFileSync(path.join(packageDir, "bangalicon-pro.json"), buildPackJson(), "utf8");
  fs.writeFileSync(path.join(packageDir, "README.txt"), buildPackReadme(user), "utf8");

  const command = `Compress-Archive -Path '${escapePowerShellString(
    packageDir
  )}' -DestinationPath '${escapePowerShellString(zipPath)}' -Force`;

  await execFileAsync("powershell.exe", ["-NoProfile", "-Command", command]);

  return {
    tempRoot,
    zipPath,
  };
};

const getPremiumCodeEnabled = () => Boolean(process.env.PREMIUM_ACCESS_CODE);

const resolvePlanFromCode = (premiumCode) => {
  if (!getPremiumCodeEnabled()) {
    return "free";
  }

  return premiumCode && premiumCode === process.env.PREMIUM_ACCESS_CODE ? "premium" : "free";
};

const replacePremiumAssetReferences = (content, req, accessToken) => {
  const fileNames = fs
    .readdirSync(PRO_DIR)
    .filter((fileName) => !fileName.endsWith(".json") && !fileName.endsWith(".txt") && fileName !== "icons");

  return fileNames.reduce((output, fileName) => {
    const assetUrl = buildPremiumAssetUrl(req, fileName, accessToken);
    const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const assetPattern = new RegExp(
      `url\\((["'])?[^)"']*${escapedFileName}(?:[?#][^)"']*)?\\1\\)`,
      "g"
    );
    return output.replace(assetPattern, `url("${assetUrl}")`);
  }, content);
};

exports.requestSignupCode = async (req, res) => {
  const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser?.emailVerified) {
      return res.status(409).json({ message: "This email already exists" });
    }

    const code = createSignupCode();
    const codeHash = hashSignupCode(code);
    const expiresAt = new Date(Date.now() + SIGNUP_CODE_TTL_MS);

    const user =
      existingUser ||
      new User({
        name: buildSignupDisplayName(normalizedEmail),
        email: normalizedEmail,
        authProvider: "email",
        plan: "free",
      });

    user.signupCodeHash = codeHash;
    user.signupCodeExpiresAt = expiresAt;
    user.signupCodeVerifiedAt = null;
    user.emailVerified = false;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;

    await user.save();

    const emailContent = buildSignupCodeEmail({ code, email: normalizedEmail });
    Promise.resolve()
      .then(async () => {
        const mailResult = await sendMail({
          to: normalizedEmail,
          ...emailContent,
        });

        if (!mailResult.delivered) {
          console.warn(`[signup-code] SMTP not configured. Signup code for ${normalizedEmail}: ${code}`);
        }
      })
      .catch((mailError) => {
        console.error(`[signup-code] Failed to send signup code to ${normalizedEmail}:`, mailError);
      });

    return res.json({
      message: "We sent you a signup code",
      email: normalizedEmail,
      maskedEmail: maskEmail(normalizedEmail),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not send signup code" });
  }
};

exports.verifySignupCode = async (req, res) => {
  const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
  const code = String(req.body?.code || "").trim();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: "Enter the 6 digit code" });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.emailVerified) {
      return res.status(400).json({ message: "This signup code is invalid or has expired" });
    }

    if (
      !user.signupCodeHash ||
      !user.signupCodeExpiresAt ||
      user.signupCodeExpiresAt.getTime() <= Date.now() ||
      user.signupCodeHash !== hashSignupCode(code)
    ) {
      return res.status(400).json({ message: "This signup code is invalid or has expired" });
    }

    user.signupCodeVerifiedAt = new Date();
    await user.save();

    return res.json({
      message: "Email confirmed",
      email: normalizedEmail,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not verify signup code" });
  }
};

exports.completeSignup = async (req, res) => {
  const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const premiumCode = String(req.body?.premiumCode || "").trim();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Please restart signup and verify your email again" });
    }

    if (user.emailVerified) {
      return res.status(409).json({ message: "This email already exists" });
    }

    const verifiedRecently =
      user.signupCodeVerifiedAt &&
      Date.now() - user.signupCodeVerifiedAt.getTime() <= SIGNUP_CODE_TTL_MS;

    if (!verifiedRecently) {
      return res.status(400).json({ message: "Please verify your email code before creating the account" });
    }

    user.name = user.name || buildSignupDisplayName(normalizedEmail);
    user.password = await bcrypt.hash(password, 10);
    user.authProvider = "email";
    user.emailVerified = true;
    user.plan = resolvePlanFromCode(premiumCode);
    user.signupCodeHash = null;
    user.signupCodeExpiresAt = null;
    user.signupCodeVerifiedAt = null;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;

    await user.save();
    const token = createAuthToken(user);

    return res.status(201).json({
      message: "Account created successfully",
      email: normalizedEmail,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not finish signup" });
  }
};

exports.signup = async (req, res) => {
  const { name, email, password, premiumCode } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();

    if (existingUser) {
      return res.status(409).json({
        message: existingUser.emailVerified
          ? "This email already exists"
          : "This email is already registered but not verified yet",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const rawVerifyToken = crypto.randomBytes(32).toString("hex");
    const verifyToken = hashEmailVerificationToken(rawVerifyToken);
    const verifyExpiresAt = new Date(Date.now() + EMAIL_VERIFY_TTL_MS);
    const verifyUrl = `${getFrontendBaseUrl()}/verify-email?token=${rawVerifyToken}`;
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "email",
      emailVerified: false,
      emailVerificationToken: verifyToken,
      emailVerificationExpiresAt: verifyExpiresAt,
      plan: resolvePlanFromCode(String(premiumCode || "").trim()),
    });

    const emailContent = buildVerifyEmail(verifyUrl);
    Promise.resolve()
      .then(async () => {
        const mailResult = await sendMail({
          to: user.email,
          ...emailContent,
        });

        if (!mailResult.delivered) {
          console.warn(`[email-verify] SMTP not configured. Verify link for ${user.email}: ${verifyUrl}`);
        }
      })
      .catch((mailError) => {
        console.error(`[email-verify] Failed to send verification email to ${user.email}:`, mailError);
      });

    res.status(201).json({
      message: "Account created. Please verify your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not create account" });
  }
};

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.authProvider === "email" && !user.emailVerified) {
      const hasPendingLegacyVerification =
        Boolean(user.emailVerificationToken) ||
        Boolean(user.signupCodeHash) ||
        Boolean(user.signupCodeExpiresAt);

      if (!hasPendingLegacyVerification) {
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiresAt = null;
        user.signupCodeHash = null;
        user.signupCodeExpiresAt = null;
        user.signupCodeVerifiedAt = null;
        await user.save();
      } else {
        return res.status(403).json({ message: "Please verify your email before signing in" });
      }
    }

    const isMatch = await bcrypt.compare(String(password), user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createAuthToken(user, { rememberMe: Boolean(rememberMe) });
    res.json({
      token,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not sign in" });
  }
};

exports.googleStart = async (req, res) => {
  const fallbackTo = getAuthFallbackPath(req.query.fallbackTo, "/login");

  if (!hasGoogleAuthConfig()) {
    return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=not-configured`);
  }

  try {
    const client = getGoogleClient();
    const state = encodeState({
      returnTo: typeof req.query.returnTo === "string" && req.query.returnTo.startsWith("/")
        ? req.query.returnTo
        : "/",
      fallbackTo,
    });

    const url = client.generateAuthUrl({
      access_type: "offline",
      include_granted_scopes: true,
      prompt: "select_account",
      scope: ["openid", "email", "profile"],
      state,
    });

    return res.redirect(url);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not start Google sign-in" });
  }
};

exports.googleCallback = async (req, res) => {
  const statePayload = decodeState(req.query.state);
  const fallbackTo = getAuthFallbackPath(statePayload.fallbackTo, "/login");

  if (!hasGoogleAuthConfig()) {
    return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=not-configured`);
  }

  const returnTo =
    typeof statePayload.returnTo === "string" && statePayload.returnTo.startsWith("/")
      ? statePayload.returnTo
      : "/";

  try {
    const code = String(req.query.code || "");

    if (!code) {
      return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=failed`);
    }

    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=failed`);
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub) {
      return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=failed`);
    }

    const normalizedEmail = String(payload.email).trim().toLowerCase();
    const avatar = payload.picture || "/avatar/avatar-meow.jpg";
    const fallbackName = String(payload.name || normalizedEmail.split("@")[0] || "Bangalicon User").trim();

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: normalizedEmail }],
    });

    if (!user) {
      const generatedPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      user = await User.create({
        name: fallbackName,
        email: normalizedEmail,
        googleId: payload.sub,
        password: generatedPassword,
        authProvider: "google",
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
        avatar,
        plan: "free",
      });
    } else {
      user.googleId = payload.sub;
      user.authProvider = "google";
      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpiresAt = null;
      if (!user.name) {
        user.name = fallbackName;
      }
      if (!user.avatar || user.avatar === "/avatar/avatar-meow.jpg") {
        user.avatar = avatar;
      }
      if (!user.password) {
        user.password = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      }
      await user.save();
    }

    const token = createAuthToken(user);
    return res.redirect(
      `${getFrontendBaseUrl()}/auth/google?token=${encodeURIComponent(token)}&returnTo=${encodeURIComponent(returnTo)}&fallbackTo=${encodeURIComponent(fallbackTo)}`
    );
  } catch (error) {
    console.error("[google-auth] callback failed:", error);
    return res.redirect(`${getFrontendBaseUrl()}${fallbackTo}?google=failed`);
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body || {};

  if (!token || !String(token).trim()) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const hashedToken = hashEmailVerificationToken(token);
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "This verification link is invalid or has expired" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    return res.json({
      message: "Your email has been verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not verify email" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body || {};

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        message: "If this email is registered, a reset email is on the way.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetToken = hashResetToken(rawToken);
    const resetExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    const resetUrl = `${getFrontendBaseUrl()}/reset-password?token=${rawToken}`;

    user.passwordResetToken = resetToken;
    user.passwordResetExpiresAt = resetExpiresAt;
    await user.save();

    const emailContent = buildResetPasswordEmail(resetUrl);
    Promise.resolve()
      .then(async () => {
        const mailResult = await sendMail({
          to: user.email,
          ...emailContent,
        });

        if (!mailResult.delivered) {
          console.warn(`[password-reset] SMTP not configured. Reset link for ${user.email}: ${resetUrl}`);
        }
      })
      .catch((mailError) => {
        console.error(`[password-reset] Failed to send reset email to ${user.email}:`, mailError);
      });

    return res.json({
      message: "If this email is registered, a reset email is on the way.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not start password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body || {};

  if (!token || !String(token).trim()) {
    return res.status(400).json({ message: "Reset token is required" });
  }

  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(String(password), 10);
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    return res.json({
      message: "Your password has been reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not reset password" });
  }
};

exports.me = async (req, res) => {
  res.json({
    user: formatUser(req.user),
  });
};

exports.list = async (req, res) => {
  try {
    const users = await User.find({ emailVerified: true })
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    res.json(users.map(formatAdminUser));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load users" });
  }
};

exports.demoUpgrade = async (req, res) => {
  const { cycle, cardName, cardNumber, expiry, cvc } = req.body || {};

  if (!["monthly", "yearly"].includes(String(cycle))) {
    return res.status(400).json({ message: "Please choose monthly or yearly billing" });
  }

  if (!cardName || !String(cardName).trim()) {
    return res.status(400).json({ message: "Card name is required" });
  }

  const cleanCardNumber = String(cardNumber || "").replace(/\s+/g, "");
  if (!/^\d{12,19}$/.test(cleanCardNumber)) {
    return res.status(400).json({ message: "Please enter a valid demo card number" });
  }

  if (!/^\d{2}\/\d{2}$/.test(String(expiry || "").trim())) {
    return res.status(400).json({ message: "Expiry should look like MM/YY" });
  }

  if (!/^\d{3,4}$/.test(String(cvc || "").trim())) {
    return res.status(400).json({ message: "Please enter a valid demo security code" });
  }

  try {
    const now = new Date();
    const nextRenewal = String(cycle) === "yearly" ? addDays(now, 365) : addDays(now, 30);
    const amount = String(cycle) === "yearly" ? 15 : 1.5;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          plan: "premium",
          billingCycle: String(cycle),
          premiumSince: now,
          premiumExpiresAt: nextRenewal,
          lastDemoPayment: {
            amount,
            currency: "USD",
            paidAt: now,
            reference: `demo_${String(cycle)}_${Date.now()}`,
          },
        },
      },
      { returnDocument: "after" }
    );

    const token = createAuthToken(updatedUser);

    res.json({
      message: `Demo ${cycle} payment completed`,
      token,
      user: formatUser(updatedUser),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Demo payment could not be completed" });
  }
};

exports.getPremiumCdn = async (req, res) => {
  const accessKey = createPremiumAccessKey(req.user);

  res.json({
    tokenTtl: process.env.PREMIUM_CDN_TOKEN_TTL || "7d",
    urls: getPremiumRouteUrls(req, accessKey),
  });
};

exports.servePremiumCss = async (req, res) => {
  const accessKey = String(req.query.k || "");

  try {
    verifyPremiumAccessKey(accessKey);
    const rawCss = readProFile("bangalicon-pro.css");

    if (!rawCss) {
      return res.status(404).json({ message: "Premium CSS not generated yet" });
    }

    const css = replacePremiumAssetReferences(rawCss, req, accessKey);
    res.setHeader("Content-Type", "text/css; charset=utf-8");
    res.send(css);
  } catch (error) {
    res.status(401).json({ message: "Premium link expired or invalid" });
  }
};

exports.downloadPremiumPack = async (req, res) => {
  if (!fs.existsSync(PRO_DIR)) {
    return res.status(404).json({ message: "Premium pack is not ready yet" });
  }

  try {
    const { tempRoot, zipPath } = await createPremiumPackArchive(req.user);

    res.download(zipPath, "bangalicon-premium-pack.zip", () => {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not prepare premium pack" });
  }
};

exports.servePremiumManifest = async (req, res) => {
  const accessKey = String(req.query.k || "");

  try {
    verifyPremiumAccessKey(accessKey);
    const manifest = readProFile("bangalicon-pro.txt");

    if (!manifest) {
      return res.status(404).json({ message: "Premium manifest not generated yet" });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(manifest);
  } catch (error) {
    res.status(401).json({ message: "Premium link expired or invalid" });
  }
};

exports.servePremiumJson = async (req, res) => {
  const accessKey = String(req.query.k || "");

  try {
    verifyPremiumAccessKey(accessKey);
    const filePath = path.join(PRO_DIR, "bangalicon-pro.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Premium icon index not generated yet" });
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const nextPayload = {
      ...parsed,
      icons: Array.isArray(parsed.icons)
        ? parsed.icons.map((icon) => ({
            ...icon,
            svgUrl: icon.file ? buildPremiumAssetUrl(req, icon.file, accessKey) : icon.svgUrl,
          }))
        : [],
    };

    res.json(nextPayload);
  } catch (error) {
    res.status(401).json({ message: "Premium link expired or invalid" });
  }
};

exports.servePremiumSnippet = async (req, res) => {
  const accessKey = String(req.query.k || "");

  try {
    verifyPremiumAccessKey(accessKey);
    const urls = getPremiumRouteUrls(req, accessKey);
    const snippet = [
      "<!-- Bangalicon Premium CDN -->",
      `<link rel="stylesheet" href="${urls.css}">`,
      "",
      '<i class="bgp bgp-diamond-star"></i>',
      "",
    ].join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(snippet);
  } catch (error) {
    res.status(401).json({ message: "Premium link expired or invalid" });
  }
};

exports.servePremiumAsset = async (req, res) => {
  const accessKey = String(req.query.k || "");

  try {
    verifyPremiumAccessKey(accessKey);
    const fileName = path.basename(String(req.params.file || ""));
    const rootAssetPath = path.join(PRO_DIR, fileName);
    const iconAssetPath = path.join(PRO_DIR, "icons", fileName);
    const filePath = fs.existsSync(rootAssetPath) ? rootAssetPath : iconAssetPath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Premium asset not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(401).json({ message: "Premium link expired or invalid" });
  }
};
