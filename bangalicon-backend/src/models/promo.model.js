const mongoose = require("mongoose");

const promoCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    iconUrl: {
      type: String,
      default: "",
      trim: true,
    },
    buttonLabel: {
      type: String,
      default: "",
      trim: true,
    },
    buttonUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const promoSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "promo-default",
    },
    name: {
      type: String,
      default: "New promo",
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    badgeText: {
      type: String,
      default: "Ad",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    ctaLabel: {
      type: String,
      default: "",
      trim: true,
    },
    ctaUrl: {
      type: String,
      default: "",
      trim: true,
    },
    popupEnabled: {
      type: Boolean,
      default: true,
    },
    popupTitle: {
      type: String,
      default: "",
      trim: true,
    },
    popupIconUrl: {
      type: String,
      default: "",
      trim: true,
    },
    popupBadge: {
      type: String,
      default: "",
      trim: true,
    },
    popupSubtitle: {
      type: String,
      default: "",
      trim: true,
    },
    cards: {
      type: [promoCardSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Promo || mongoose.model("Promo", promoSchema);
