const fs = require("fs");
const path = require("path");

const versionsPath = path.join(__dirname, "../../package-versions.json");

const defaultVersions = {
  react: "1.0.0",
  vue: "1.0.0",
  svelte: "1.0.0",
  updatedAt: new Date().toISOString(),
};

const ensureVersionsFile = () => {
  if (!fs.existsSync(versionsPath)) {
    fs.writeFileSync(versionsPath, JSON.stringify(defaultVersions, null, 2), "utf8");
  }
};

const readPackageVersions = () => {
  ensureVersionsFile();

  try {
    const raw = fs.readFileSync(versionsPath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      react: String(parsed.react || defaultVersions.react),
      vue: String(parsed.vue || defaultVersions.vue),
      svelte: String(parsed.svelte || defaultVersions.svelte),
      updatedAt: String(parsed.updatedAt || defaultVersions.updatedAt),
    };
  } catch {
    fs.writeFileSync(versionsPath, JSON.stringify(defaultVersions, null, 2), "utf8");
    return { ...defaultVersions };
  }
};

const bumpPatchVersion = (version) => {
  const [major, minor, patch] = String(version)
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);

  return `${major}.${minor}.${patch + 1}`;
};

const bumpPackageVersions = () => {
  const current = readPackageVersions();

  const next = {
    react: bumpPatchVersion(current.react),
    vue: bumpPatchVersion(current.vue),
    svelte: bumpPatchVersion(current.svelte),
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(versionsPath, JSON.stringify(next, null, 2), "utf8");
  return next;
};

module.exports = {
  readPackageVersions,
  bumpPackageVersions,
};
