const User = require("../models/user.model");
const { verifyAuthToken } = require("../utils/premiumAccess");

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
};

const requireAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ message: "Account not found" });
    }

    req.user = user;
    req.authToken = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

const requirePremium = (req, res, next) => {
  if (!req.user || req.user.plan !== "premium") {
    return res.status(403).json({ message: "Premium access required" });
  }

  next();
};

module.exports = {
  requireAuth,
  requirePremium,
};
