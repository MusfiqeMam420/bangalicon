const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const PRO_DIR = path.join(__dirname, "../../cdn/pro");
const DEFAULT_AUTH_SECRET = "bangalicon-dev-secret";
const premiumAccessKeys = new Map();

const getJwtSecret = () => process.env.JWT_SECRET || DEFAULT_AUTH_SECRET;

const createAuthToken = (user, options = {}) =>
  jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      plan: user.plan,
      type: "auth",
    },
    getJwtSecret(),
    {
      expiresIn:
        options.rememberMe
          ? process.env.AUTH_TOKEN_TTL_REMEMBER_ME || "30d"
          : process.env.AUTH_TOKEN_TTL || "7d",
    }
  );

const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

const createPremiumAccessToken = (user) =>
  jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      plan: user.plan,
      type: "premium-cdn",
    },
    getJwtSecret(),
    { expiresIn: process.env.PREMIUM_CDN_TOKEN_TTL || "7d" }
  );

const verifyPremiumAccessToken = (token) => {
  const payload = jwt.verify(token, getJwtSecret());

  if (payload.type !== "premium-cdn" || payload.plan !== "premium") {
    throw new Error("Invalid premium token");
  }

  return payload;
};

const parseTtlToMs = (raw) => {
  const value = String(raw || "7d").trim();
  const match = value.match(/^(\d+)\s*([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const cleanupExpiredPremiumKeys = () => {
  const now = Date.now();

  for (const [key, value] of premiumAccessKeys.entries()) {
    if (value.expiresAt <= now) {
      premiumAccessKeys.delete(key);
    }
  }
};

const createPremiumAccessKey = (user) => {
  cleanupExpiredPremiumKeys();

  const key = crypto.randomBytes(6).toString("base64url");
  const ttlMs = parseTtlToMs(process.env.PREMIUM_CDN_TOKEN_TTL || "7d");

  premiumAccessKeys.set(key, {
    sub: String(user._id),
    email: user.email,
    plan: user.plan,
    expiresAt: Date.now() + ttlMs,
  });

  return key;
};

const verifyPremiumAccessKey = (key) => {
  cleanupExpiredPremiumKeys();

  const record = premiumAccessKeys.get(String(key || ""));

  if (!record || record.plan !== "premium") {
    throw new Error("Invalid premium key");
  }

  return record;
};

const getRequestOrigin = (req) => `${req.protocol}://${req.get("host")}`;

const getPremiumRouteUrls = (req, accessKey) => {
  const baseUrl = `${getRequestOrigin(req)}/p`;
  const query = `k=${encodeURIComponent(accessKey)}`;

  return {
    css: `${baseUrl}/c.css?${query}`,
    manifest: `${baseUrl}/m.txt?${query}`,
    json: `${baseUrl}/i.json?${query}`,
    snippet: `${baseUrl}/s.txt?${query}`,
  };
};

const getProFilePath = (fileName) => path.join(PRO_DIR, fileName);

const readProFile = (fileName) => {
  const filePath = getProFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
};

const buildPremiumAssetUrl = (req, fileName, accessKey) =>
  `${getRequestOrigin(req)}/p/a/${encodeURIComponent(fileName)}?k=${encodeURIComponent(
    accessKey
  )}`;

module.exports = {
  PRO_DIR,
  createAuthToken,
  verifyAuthToken,
  createPremiumAccessToken,
  verifyPremiumAccessToken,
  createPremiumAccessKey,
  verifyPremiumAccessKey,
  getPremiumRouteUrls,
  readProFile,
  buildPremiumAssetUrl,
  getRequestOrigin,
};
