const mongoose = require("mongoose");

const seoSnapshotSchema = new mongoose.Schema(
  {
    snapshotKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    snapshotDate: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      default: "manual",
      trim: true,
    },
    sessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    users: {
      type: Number,
      default: 0,
      min: 0,
    },
    organicClicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    organicImpressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgPosition: {
      type: Number,
      default: 0,
      min: 0,
    },
    backlinks: {
      type: Number,
      default: 0,
      min: 0,
    },
    referringDomains: {
      type: Number,
      default: 0,
      min: 0,
    },
    indexedPages: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SeoSnapshot || mongoose.model("SeoSnapshot", seoSnapshotSchema);
