const SeoSnapshot = require("../models/seoSnapshot.model");
const {
  AUTO_SOURCE_TOKEN,
  buildAutoSnapshotKey,
  getGoogleSeoStatus,
  syncGoogleSeoSnapshot,
} = require("../utils/googleSeoSync");

const clampNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

const buildSnapshotKey = (value) => {
  const fallback = new Date();
  const parsed = value ? new Date(value) : fallback;
  const safeDate = Number.isNaN(parsed.getTime()) ? fallback : parsed;
  return safeDate.toISOString().slice(0, 10);
};

const buildSnapshotDate = (snapshotKey) => new Date(`${snapshotKey}T12:00:00.000Z`);

const formatSnapshot = (snapshot) => ({
  id: String(snapshot._id),
  snapshotDate: snapshot.snapshotKey,
  source: snapshot.source || "manual",
  sessions: snapshot.sessions || 0,
  users: snapshot.users || 0,
  organicClicks: snapshot.organicClicks || 0,
  organicImpressions: snapshot.organicImpressions || 0,
  avgPosition: snapshot.avgPosition || 0,
  backlinks: snapshot.backlinks || 0,
  referringDomains: snapshot.referringDomains || 0,
  indexedPages: snapshot.indexedPages || 0,
  notes: snapshot.notes || "",
  createdAt: snapshot.createdAt || null,
  updatedAt: snapshot.updatedAt || null,
});

const latestAutoFilter = {
  source: {
    $regex: `(^|\\+)${AUTO_SOURCE_TOKEN}(\\+|$)`,
  },
};

exports.getSnapshots = async (req, res) => {
  try {
    const snapshots = await SeoSnapshot.find().sort({ snapshotKey: -1, updatedAt: -1 }).lean();
    res.json(snapshots.map(formatSnapshot));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load SEO snapshots" });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const [latestSnapshot, latestAutoSnapshot] = await Promise.all([
      SeoSnapshot.findOne().sort({ snapshotKey: -1, updatedAt: -1 }).lean(),
      SeoSnapshot.findOne(latestAutoFilter).sort({ snapshotKey: -1, updatedAt: -1 }).lean(),
    ]);

    res.json({
      ...getGoogleSeoStatus(),
      latestSnapshotDate: latestSnapshot?.snapshotKey || null,
      latestAutoSnapshotDate: latestAutoSnapshot?.snapshotKey || null,
      latestAutoSource: latestAutoSnapshot?.source || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load SEO sync status" });
  }
};

exports.saveSnapshot = async (req, res) => {
  const payload = req.body || {};
  const snapshotKey = buildSnapshotKey(payload.snapshotDate);

  try {
    const snapshot = await SeoSnapshot.findOneAndUpdate(
      { snapshotKey },
      {
        $set: {
          snapshotKey,
          snapshotDate: buildSnapshotDate(snapshotKey),
          source: String(payload.source || "manual").trim() || "manual",
          sessions: clampNumber(payload.sessions),
          users: clampNumber(payload.users),
          organicClicks: clampNumber(payload.organicClicks),
          organicImpressions: clampNumber(payload.organicImpressions),
          avgPosition: clampNumber(payload.avgPosition),
          backlinks: clampNumber(payload.backlinks),
          referringDomains: clampNumber(payload.referringDomains),
          indexedPages: clampNumber(payload.indexedPages),
          notes: String(payload.notes || "").trim(),
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnDocument: "after",
      }
    );

    res.status(201).json(formatSnapshot(snapshot));
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not save SEO snapshot" });
  }
};

exports.syncSnapshot = async (req, res) => {
  try {
    const snapshotKey = buildSnapshotKey(req.body?.snapshotDate || buildAutoSnapshotKey());
    const snapshot = await syncGoogleSeoSnapshot({ snapshotKey });

    res.json({
      message: "Google SEO data synced. Your latest search and traffic numbers are ready.",
      snapshot: formatSnapshot(snapshot),
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Could not sync Google SEO data" });
  }
};

exports.deleteSnapshot = async (req, res) => {
  try {
    const snapshot = await SeoSnapshot.findByIdAndDelete(req.params.id);

    if (!snapshot) {
      return res.status(404).json({ message: "Snapshot not found" });
    }

    res.json({ message: "Snapshot removed" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not remove snapshot" });
  }
};
