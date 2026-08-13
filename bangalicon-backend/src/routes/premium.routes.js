const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");

router.get("/c.css", controller.servePremiumCss);
router.get("/m.txt", controller.servePremiumManifest);
router.get("/i.json", controller.servePremiumJson);
router.get("/s.txt", controller.servePremiumSnippet);
router.get("/a/:file", controller.servePremiumAsset);

module.exports = router;
