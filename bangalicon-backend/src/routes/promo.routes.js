const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const controller = require("../controllers/promo.controller");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || ""}`);
  },
});

const imageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

    if (allowedExtensions.includes(extension) || allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PNG, JPG, WEBP, or SVG files are allowed"), false);
  },
});

router.get("/", controller.getPromo);
router.get("/all", controller.getAllPromos);
router.post("/", controller.createPromo);
router.put("/:id", controller.savePromo);
router.delete("/:id", controller.deletePromo);
router.post("/upload", imageUpload.single("image"), controller.uploadPromoAsset);

router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
