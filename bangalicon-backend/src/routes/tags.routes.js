const express = require("express");
const Tag = require("../models/tag.model");
const Icon = require("../models/icon.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean();
    res.json(tags.map((tag) => ({ id: String(tag._id), name: tag.name })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim().toLowerCase();

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Tag already exists" });
    }

    const tag = await Tag.create({ name });
    res.json({ message: "Tag created", id: String(tag._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await Icon.updateMany({}, { $pull: { tags: deleted.name } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
