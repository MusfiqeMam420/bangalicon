const express = require("express");
const router = express.Router();
const controller = require("../controllers/seo.controller");

router.get("/", controller.getSnapshots);
router.get("/status", controller.getStatus);
router.post("/", controller.saveSnapshot);
router.post("/sync", controller.syncSnapshot);
router.delete("/:id", controller.deleteSnapshot);

module.exports = router;
