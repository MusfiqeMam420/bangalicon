const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");
const { requireAuth, requirePremium } = require("../middleware/auth.middleware");

router.get("/", controller.list);
router.post("/signup/request-code", controller.requestSignupCode);
router.post("/signup/verify-code", controller.verifySignupCode);
router.post("/signup/complete", controller.completeSignup);
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/google/start", controller.googleStart);
router.get("/google/callback", controller.googleCallback);
router.post("/verify-email", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.get("/me", requireAuth, controller.me);
router.post("/demo-upgrade", requireAuth, controller.demoUpgrade);
router.get("/premium-pack", requireAuth, requirePremium, controller.downloadPremiumPack);

module.exports = router;
