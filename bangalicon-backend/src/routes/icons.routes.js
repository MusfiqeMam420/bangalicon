const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// controller
const controller = require("../controllers/icons.controller");

// =======================
// ENSURE UPLOAD FOLDER EXISTS
// =======================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// =======================
// MULTER STORAGE (TEMP FILE)
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || ""}`);
  },
});

// =======================
// FILE FILTER (SVG ONLY)
// =======================
const svgFileFilter = (req, file, cb) => {
  if (file.mimetype === "image/svg+xml") {
    cb(null, true);
  } else {
    cb(new Error("Only SVG files are allowed"), false);
  }
};

const bulkFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "icons") {
    if (file.mimetype === "image/svg+xml" || extension === ".svg") {
      cb(null, true);
      return;
    }

    cb(new Error("Bulk icon upload only accepts SVG files"), false);
    return;
  }

  if (file.fieldname === "sheet") {
    if ([".csv", ".xlsx", ".xls"].includes(extension)) {
      cb(null, true);
      return;
    }

    cb(new Error("Sheet must be a CSV or Excel file"), false);
    return;
  }

  cb(new Error("Unexpected file field"), false);
};

// =======================
// MULTER INSTANCE
// =======================
const upload = multer({
  storage,
  fileFilter: svgFileFilter,
});

const bulkUpload = multer({
  storage,
  fileFilter: bulkFileFilter,
});

const generateFont = require("../utils/generateFont");

// =======================
// ROUTES
// =======================

// GET all icons
router.get("/", controller.getAll);

// POST create/update
router.post("/", upload.single("icon"), controller.create);
router.post(
  "/bulk",
  bulkUpload.fields([
    { name: "sheet", maxCount: 1 },
    { name: "icons", maxCount: 5000 },
  ]),
  controller.createBulk
);

// PUT update by ID
router.put("/:id", upload.single("icon"), controller.update);

router.delete("/:id", controller.remove);



// =======================
// ERROR HANDLER (important)
// =======================
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
