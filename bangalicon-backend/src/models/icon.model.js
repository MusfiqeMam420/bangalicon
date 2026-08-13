const mongoose = require("mongoose");

const iconSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    type: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    style: {
      type: String,
      enum: ["regular", "solid", "brand"],
      default: "regular",
    },
    file: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Icon || mongoose.model("Icon", iconSchema);
