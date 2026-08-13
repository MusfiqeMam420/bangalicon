const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const Category = require("../models/category.model");
const Icon = require("../models/icon.model");
const Release = require("../models/release.model");
const Tag = require("../models/tag.model");
const generateFont = require("../utils/generateFont");
const normalizeSvg = require("../utils/normalizeSvg");
const generateReactIcons = require("../utils/generateReactIcons");
const { bumpPackageVersions } = require("../utils/packageVersions");
const { getBackendBaseUrl, getCdnBundleBaseUrl } = require("../utils/publicUrls");

const uploadsDir = path.join(__dirname, "../../uploads");
const projectRoot = path.join(__dirname, "../..");
const publishScriptPath = path.join(__dirname, "../scripts/publish.js");
let publishTimeout = null;
let cdnSyncTimeout = null;
let publishInFlight = false;
let publishQueuedAgain = false;
let cdnSyncInFlight = false;
let cdnSyncQueuedAgain = false;

const parseTags = (raw) => {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.from(
      new Set(
        (Array.isArray(arr) ? arr : [])
          .map((tag) => String(tag).trim().toLowerCase())
          .filter(Boolean)
      )
    );
  } catch {
    return [];
  }
};

const makeSafeName = (name) =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const getPublicSlug = (name) => makeSafeName(name);

const getInternalSlug = (name, style = "regular") => {
  const publicSlug = getPublicSlug(name);

  if (!publicSlug) {
    return "";
  }

  return style === "regular" ? publicSlug : `${publicSlug}--${style}`;
};

const parseSheetTags = (raw) => {
  if (Array.isArray(raw)) {
    return Array.from(
      new Set(raw.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))
    );
  }

  const value = String(raw || "").trim();

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parseSheetTags(parsed);
    }
  } catch {
    // fallback to simple separators
  }

  return Array.from(
    new Set(
      value
        .split(/[,\n|]/)
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );
};

const normalizeSheetRow = (row) =>
  Object.fromEntries(
    Object.entries(row || {}).map(([key, value]) => [
      String(key).trim().toLowerCase(),
      typeof value === "string" ? value.trim() : value,
    ])
  );

const getRowValue = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
};

const parseSheetRows = (sheetFilePath) => {
  const workbook = XLSX.readFile(sheetFilePath);
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  return rows.map(normalizeSheetRow);
};

const normalizeType = (value) => {
  const candidate = String(value || "free").trim().toLowerCase();
  return candidate === "premium" ? "premium" : "free";
};

const normalizeStyleValue = (value) => {
  const candidate = String(value || "regular").trim().toLowerCase();
  if (candidate === "solid" || candidate === "brand") {
    return candidate;
  }

  return "regular";
};

const deleteTempFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const resolveCategory = async (rawCategory) => {
  const value = String(rawCategory || "").trim();

  if (!value) {
    return null;
  }

  if (/^[a-f\d]{24}$/i.test(value)) {
    return Category.findById(value);
  }

  let category = await Category.findOne({ name: value });

  if (!category) {
    category = await Category.create({ name: value });
  }

  return category;
};

const queuePublish = () => {
  if (publishTimeout) {
    clearTimeout(publishTimeout);
  }

  publishTimeout = setTimeout(() => {
    publishTimeout = null;

    if (publishInFlight) {
      publishQueuedAgain = true;
      return;
    }

    publishInFlight = true;

    exec(`node "${publishScriptPath}"`, { cwd: projectRoot }, (error, stdout, stderr) => {
      publishInFlight = false;

      if (error) {
        console.error("Publish script failed:", error.message);
      }

      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.error(stderr);
      }

      if (publishQueuedAgain) {
        publishQueuedAgain = false;
        queuePublish();
      }
    });
  }, 3000);
};

const queueCdnSync = () => {
  const command = process.env.CDN_SYNC_COMMAND;

  if (!command) {
    return;
  }

  if (cdnSyncTimeout) {
    clearTimeout(cdnSyncTimeout);
  }

  cdnSyncTimeout = setTimeout(() => {
    cdnSyncTimeout = null;

    if (cdnSyncInFlight) {
      cdnSyncQueuedAgain = true;
      return;
    }

    cdnSyncInFlight = true;

    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
      cdnSyncInFlight = false;

      if (error) {
        console.error("CDN sync failed:", error.message);
      }

      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.error(stderr);
      }

      if (cdnSyncQueuedAgain) {
        cdnSyncQueuedAgain = false;
        queueCdnSync();
      }
    });
  }, 3000);
};

const regenerateAssets = async () => {
  bumpPackageVersions();
  const icons = await Icon.find().lean();
  await generateFont(
    icons.map((icon) => ({
      name: icon.name,
      slug: icon.slug,
      type: icon.type,
      style: icon.style,
      file: icon.file,
      tags: Array.isArray(icon.tags) ? icon.tags : [],
    }))
  );
  await generateReactIcons(icons);
  queuePublish();
  queueCdnSync();
};

const getCdnUrls = (req) => {
  const backendBase = getBackendBaseUrl();
  const freeBase = getCdnBundleBaseUrl("free");

  return {
    free: {
      css: `${freeBase}/bangalicon-free.css`,
      manifest: `${freeBase}/bangalicon-free.txt`,
      json: `${freeBase}/bangalicon-free.json`,
      snippet: `${freeBase}/cdn-link-free.txt`,
    },
    pro: {
      access: `${backendBase}/api/users/premium-cdn`,
    },
    index: `${backendBase}/cdn/bundle-index.json`,
  };
};

const syncTags = async (tags) => {
  if (!tags.length) return;

  await Promise.all(
    tags.map((tag) =>
      Tag.updateOne({ name: tag }, { $setOnInsert: { name: tag } }, { upsert: true })
    )
  );
};

const getMonthLabel = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

const getReleaseGroupDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const syncReleaseNoteForIcon = async (req, icon) => {
  const now = new Date();
  const releaseVersion = String(process.env.RELEASE_VERSION || "3.1.0").trim();
  const monthLabel = String(process.env.RELEASE_MONTH_LABEL || getMonthLabel(now)).trim();
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${icon.file}`;
  const groupDate = getReleaseGroupDate(now);
  const iconName = String(icon.name || "").trim();
  const previewItem = {
    label: iconName,
    imageUrl,
  };

  let release = await Release.findOne({ version: releaseVersion });

  if (!release) {
    release = await Release.create({
      version: releaseVersion,
      monthLabel,
      entries: [],
    });
  }

  release.monthLabel = monthLabel;

  const existingEntry = release.entries.find(
    (entry) => entry.type === "add" && entry.autoGenerated && entry.groupDate === groupDate
  );

  if (existingEntry) {
    const nextPreviewItems = Array.isArray(existingEntry.previewItems)
      ? existingEntry.previewItems.filter((item) => item?.label && item.label !== iconName)
      : [];

    nextPreviewItems.push(previewItem);

    const nextTags = nextPreviewItems.map((item) => item.label);
    existingEntry.type = "add";
    existingEntry.autoGenerated = true;
    existingEntry.groupDate = groupDate;
    existingEntry.title = `Added ${nextTags.length} icons`;
    existingEntry.description = `Added ${nextTags.length} icons`;
    existingEntry.tags = nextTags;
    existingEntry.previewItems = nextPreviewItems;
    existingEntry.imageUrl = nextPreviewItems[nextPreviewItems.length - 1]?.imageUrl || imageUrl;
  } else {
    release.entries.unshift({
      type: "add",
      autoGenerated: true,
      groupDate,
      title: `Added ${iconName}`,
      description: `Added 1 icon`,
      tags: [iconName],
      previewItems: [previewItem],
      imageUrl,
    });
  }

  await release.save();
};

const formatIcon = (icon) => ({
  id: String(icon._id),
  _id: String(icon._id),
  name: icon.name,
  slug: getPublicSlug(icon.name),
  internal_slug: icon.slug,
  type: icon.type,
  style: icon.style,
  file: icon.file,
  tags: Array.isArray(icon.tags) ? icon.tags : [],
  category_id: icon.category ? String(icon.category._id || icon.category) : null,
  category_name: icon.category?.name ?? null,
  createdAt: icon.createdAt,
  updatedAt: icon.updatedAt,
});

exports.getAll = async (req, res) => {
  try {
    const icons = await Icon.find().populate("category").sort({ createdAt: -1 }).lean();
    res.json(icons.map(formatIcon));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { name, category, type, style } = req.body;
  const normalizedStyle = normalizeStyleValue(style);
  const tags = parseTags(req.body.tags);
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Icon name is required" });
  }

  const safeName = getInternalSlug(name, normalizedStyle);
  const filename = `${safeName}.svg`;
  const newPath = path.join(uploadsDir, filename);

  try {
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }

    fs.renameSync(file.path, newPath);
    normalizeSvg(newPath);

    const categoryDoc = category ? await Category.findById(category) : null;

    const icon = await Icon.create({
      name: String(name).trim(),
      slug: safeName,
      category: categoryDoc?._id ?? null,
      type: type || "free",
      style: normalizedStyle,
      file: filename,
      tags,
    });

    await syncTags(tags);
    await syncReleaseNoteForIcon(req, {
      name: String(name).trim(),
      file: filename,
      tags,
    });
    await regenerateAssets();

    res.json({
      message: "Icon created and CDN assets regenerated",
      id: String(icon._id),
      cdn: getCdnUrls(req),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "File move failed" });
  }
};

exports.createBulk = async (req, res) => {
  const sheetFile = req.files?.sheet?.[0];
  const iconFiles = Array.isArray(req.files?.icons) ? req.files.icons : [];

  if (!sheetFile) {
    return res.status(400).json({ message: "Sheet file is required" });
  }

  if (!iconFiles.length) {
    deleteTempFile(sheetFile.path);
    return res.status(400).json({ message: "Upload at least one SVG icon file" });
  }

  const cleanupPaths = [sheetFile.path, ...iconFiles.map((file) => file.path)];

  try {
    const rawRows = parseSheetRows(sheetFile.path);

    if (!rawRows.length) {
      throw new Error("The sheet is empty");
    }

    const uploadedFiles = new Map();
    for (const file of iconFiles) {
      uploadedFiles.set(file.originalname.toLowerCase(), file);
      uploadedFiles.set(path.basename(file.originalname).toLowerCase(), file);
    }

    const preparedRows = [];
    const seenSlugs = new Set();

    for (let index = 0; index < rawRows.length; index += 1) {
      const row = rawRows[index];
      const rowNumber = index + 2;
      const name = String(getRowValue(row, ["name", "icon", "icon_name"])).trim();
      const fileName = String(
        getRowValue(row, ["file", "filename", "file_name", "svg", "icon_file"])
      ).trim();
      const categoryValue = getRowValue(row, ["category", "category_name"]);
      const type = normalizeType(getRowValue(row, ["type", "access", "plan"]));
      const style = normalizeStyleValue(getRowValue(row, ["style", "variant"]));
      const tags = parseSheetTags(getRowValue(row, ["tags", "keywords"]));

      if (!name) {
        throw new Error(`Row ${rowNumber}: icon name is required`);
      }

      if (!fileName) {
        throw new Error(`Row ${rowNumber}: file name is required`);
      }

      const matchedFile =
        uploadedFiles.get(fileName.toLowerCase()) ||
        uploadedFiles.get(path.basename(fileName).toLowerCase());

      if (!matchedFile) {
        throw new Error(`Row ${rowNumber}: no uploaded SVG matches "${fileName}"`);
      }

      const slug = getInternalSlug(name, style);

      if (!slug) {
        throw new Error(`Row ${rowNumber}: icon name "${name}" is not valid`);
      }

      if (seenSlugs.has(slug)) {
        throw new Error(
          `Row ${rowNumber}: duplicate icon name "${name}" with style "${style}" in this sheet`
        );
      }

      const existingIcon = await Icon.findOne({ slug }).lean();
      if (existingIcon) {
        throw new Error(`Row ${rowNumber}: icon "${name}" with style "${style}" already exists`);
      }

      seenSlugs.add(slug);
      preparedRows.push({
        name,
        slug,
        fileName: `${slug}.svg`,
        matchedFile,
        categoryValue,
        type,
        style,
        tags,
      });
    }

    const createdIds = [];

    for (const row of preparedRows) {
      const targetPath = path.join(uploadsDir, row.fileName);
      deleteTempFile(targetPath);
      fs.renameSync(row.matchedFile.path, targetPath);
      normalizeSvg(targetPath);

      const categoryDoc = await resolveCategory(row.categoryValue);
      const icon = await Icon.create({
        name: row.name,
        slug: row.slug,
        category: categoryDoc?._id ?? null,
        type: row.type,
        style: row.style,
        file: row.fileName,
        tags: row.tags,
      });

      createdIds.push(String(icon._id));
      await syncTags(row.tags);
      await syncReleaseNoteForIcon(req, {
        name: row.name,
        file: row.fileName,
        tags: row.tags,
      });
    }

    await regenerateAssets();
    deleteTempFile(sheetFile.path);

    res.json({
      message: `${createdIds.length} icons imported and CDN assets regenerated`,
      count: createdIds.length,
      ids: createdIds,
      cdn: getCdnUrls(req),
    });
  } catch (error) {
    console.error(error);

    for (const filePath of cleanupPaths) {
      deleteTempFile(filePath);
    }

    res.status(400).json({ message: error.message || "Bulk upload failed" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, type, style } = req.body;
  const normalizedStyle = normalizeStyleValue(style);
  const tags = parseTags(req.body.tags);
  const file = req.file;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Icon name is required" });
  }

  try {
    const icon = await Icon.findById(id);

    if (!icon) {
      return res.status(404).json({ message: "Icon not found" });
    }

    const safeName = getInternalSlug(name, normalizedStyle);
    const newFilename = `${safeName}.svg`;
    const newPath = path.join(uploadsDir, newFilename);
    let finalFilename = icon.file;

    if (file) {
      const oldPath = path.join(uploadsDir, icon.file);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }

      fs.renameSync(file.path, newPath);
      normalizeSvg(newPath);
      finalFilename = newFilename;
    } else if (icon.file !== newFilename) {
      const oldPath = path.join(uploadsDir, icon.file);

      if (fs.existsSync(oldPath)) {
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
        }

        fs.renameSync(oldPath, newPath);
        normalizeSvg(newPath);
        finalFilename = newFilename;
      }
    }

    const categoryDoc = category ? await Category.findById(category) : null;

    icon.name = String(name).trim();
    icon.slug = safeName;
    icon.category = categoryDoc?._id ?? null;
    icon.type = type || "free";
    icon.style = normalizedStyle;
    icon.file = finalFilename;
    icon.tags = tags;

    await icon.save();
    await syncTags(tags);
    await regenerateAssets();

    res.json({
      message: "Icon updated and CDN assets regenerated",
      cdn: getCdnUrls(req),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "File operation failed" });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const icon = await Icon.findById(id);

    if (!icon) {
      return res.status(404).json({ message: "Not found" });
    }

    const filePath = path.join(uploadsDir, icon.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Icon.findByIdAndDelete(id);
    await regenerateAssets();

    res.json({
      message: "Icon deleted and CDN assets regenerated",
      cdn: getCdnUrls(req),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
