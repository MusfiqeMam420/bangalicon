const Promo = require("../models/promo.model");
const { getBackendBaseUrl, getFrontendBaseUrl, normalizePublicUrl } = require("../utils/publicUrls");

const DEFAULT_PROMO = {
  key: "promo-default",
  name: "New promo",
  enabled: false,
  badgeText: "Ad",
  message: "",
  ctaLabel: "",
  ctaUrl: "",
  popupEnabled: true,
  popupTitle: "",
  popupIconUrl: "",
  popupBadge: "",
  popupSubtitle: "",
  cards: [],
};

const normalizePromoLinkUrl = (value = "") => {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (raw.startsWith("/")) {
    return `${getFrontendBaseUrl()}${raw}`;
  }

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : raw.startsWith("//") ? `https:${raw}` : `https://${raw}`;

  try {
    const parsed = new URL(candidate);

    if (!/^https?:$/i.test(parsed.protocol)) {
      return "";
    }

    return normalizePublicUrl(parsed.toString());
  } catch (error) {
    return "";
  }
};

const normalizePromoAssetUrl = (value = "") => {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (/^data:/i.test(raw)) {
    return raw;
  }

  const backendBase = getBackendBaseUrl();

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);

      if (parsed.pathname.startsWith("/uploads/")) {
        return `${backendBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      return normalizePublicUrl(parsed.toString());
    } catch (error) {
      return raw;
    }
  }

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;

  if (normalizedPath.startsWith("/uploads/")) {
    return `${backendBase}${normalizedPath}`;
  }

  return raw;
};

const normalizeCard = (card = {}) => ({
  title: String(card.title || "").trim(),
  subtitle: String(card.subtitle || "").trim(),
  iconUrl: normalizePromoAssetUrl(card.iconUrl),
  buttonLabel: String(card.buttonLabel || "").trim(),
  buttonUrl: normalizePromoLinkUrl(card.buttonUrl),
});

const buildPromoUpdate = (payload = {}) => ({
  name: String(payload.name || DEFAULT_PROMO.name).trim() || DEFAULT_PROMO.name,
  enabled: Boolean(payload.enabled),
  badgeText: String(payload.badgeText || DEFAULT_PROMO.badgeText).trim() || DEFAULT_PROMO.badgeText,
  message: String(payload.message || "").trim(),
  ctaLabel: String(payload.ctaLabel || "").trim(),
  ctaUrl: normalizePromoLinkUrl(payload.ctaUrl),
  popupEnabled: payload.popupEnabled !== false,
  popupTitle: String(payload.popupTitle || "").trim(),
  popupIconUrl: normalizePromoAssetUrl(payload.popupIconUrl),
  popupBadge: String(payload.popupBadge || "").trim(),
  popupSubtitle: String(payload.popupSubtitle || "").trim(),
  cards: Array.isArray(payload.cards) ? payload.cards.map(normalizeCard).filter((card) => card.title) : [],
});

const createPromoKey = () => `promo-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

const formatPromo = (promo) => ({
  id: promo?._id ? String(promo._id) : "default",
  key: promo?.key || DEFAULT_PROMO.key,
  name: promo?.name || DEFAULT_PROMO.name,
  enabled: Boolean(promo?.enabled),
  badgeText: promo?.badgeText || DEFAULT_PROMO.badgeText,
  message: promo?.message || "",
  ctaLabel: promo?.ctaLabel || "",
  ctaUrl: normalizePromoLinkUrl(promo?.ctaUrl),
  popupEnabled: promo?.popupEnabled !== false,
  popupTitle: promo?.popupTitle || "",
  popupIconUrl: normalizePromoAssetUrl(promo?.popupIconUrl),
  popupBadge: promo?.popupBadge || "",
  popupSubtitle: promo?.popupSubtitle || "",
  cards: Array.isArray(promo?.cards) ? promo.cards.map(normalizeCard).filter((card) => card.title) : [],
  createdAt: promo?.createdAt || null,
  updatedAt: promo?.updatedAt || null,
});

exports.getPromo = async (req, res) => {
  try {
    const promo = await Promo.findOne({ enabled: true }).sort({ updatedAt: -1 }).lean();
    res.json(formatPromo(promo || DEFAULT_PROMO));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load promo settings" });
  }
};

exports.getAllPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ updatedAt: -1, createdAt: -1 }).lean();
    res.json(promos.map(formatPromo));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load promo library" });
  }
};

exports.createPromo = async (req, res) => {
  const payload = req.body || {};

  try {
    const update = buildPromoUpdate(payload);

    if (update.enabled) {
      await Promo.updateMany({}, { $set: { enabled: false } });
    }

    const promo = await Promo.create({
      key: createPromoKey(),
      ...update,
    });

    res.status(201).json(formatPromo(promo));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not create promo" });
  }
};

exports.savePromo = async (req, res) => {
  const payload = req.body || {};
  const { id } = req.params;

  try {
    const update = buildPromoUpdate(payload);

    if (update.enabled) {
      await Promo.updateMany({ _id: { $ne: id } }, { $set: { enabled: false } });
    }

    const promo = await Promo.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }

    res.json(formatPromo(promo));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not save promo settings" });
  }
};

exports.deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }

    res.json({ message: "Promo removed" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not remove promo" });
  }
};

exports.uploadPromoAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Promo image file is required" });
    }

    const backendBase = getBackendBaseUrl();
    const fileUrl = `${backendBase}/uploads/${req.file.filename}`;

    res.status(201).json({
      message: "Promo image uploaded",
      file: req.file.filename,
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not upload promo image" });
  }
};
