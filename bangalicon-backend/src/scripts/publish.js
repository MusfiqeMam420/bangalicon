const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const reactIconsDir = path.join(__dirname, "../../react-icons");
const vueIconsDir = path.join(__dirname, "../../vue-icons");
const svelteIconsDir = path.join(__dirname, "../../svelte-icons");
const packageDirs = [reactIconsDir, vueIconsDir, svelteIconsDir];
const registry = process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org";
const normalizedRegistryHost = registry.replace(/^https?:/, "");
const npmToken = String(process.env.NPM_TOKEN || "").trim();
const npmCacheDir = path.join(__dirname, "../../.npm-cache");

if (process.env.ENABLE_ICON_PACKAGES_PUBLISH !== "true") {
  console.log("Skipping npm publish for icon packages. Set ENABLE_ICON_PACKAGES_PUBLISH=true to enable.");
  process.exit(0);
}

if (!npmToken) {
  console.log("Skipping npm publish for icon packages. Set NPM_TOKEN to enable authenticated publish.");
  process.exit(0);
}

const writeNpmRc = (packageDir) => {
  const npmrcPath = path.join(packageDir, ".npmrc");
  const previous = fs.existsSync(npmrcPath) ? fs.readFileSync(npmrcPath, "utf8") : null;
  const content = [`registry=${registry}`, `${normalizedRegistryHost}/:_authToken=${npmToken}`, "always-auth=true"].join(os.EOL);
  fs.writeFileSync(npmrcPath, content, "utf8");

  return () => {
    if (previous === null) {
      if (fs.existsSync(npmrcPath)) {
        fs.unlinkSync(npmrcPath);
      }
      return;
    }

    fs.writeFileSync(npmrcPath, previous, "utf8");
  };
};

try {
  fs.mkdirSync(npmCacheDir, { recursive: true });

  for (const packageDir of packageDirs) {
    const restoreNpmRc = writeNpmRc(packageDir);

    try {
      execSync(`npm publish --access public --registry "${registry}"`, {
        cwd: packageDir,
        stdio: "inherit",
        env: {
          ...process.env,
          npm_config_cache: npmCacheDir,
        },
      });
    } finally {
      restoreNpmRc();
    }
  }
} catch (error) {
  console.error("Publish failed", error);
  process.exit(1);
}
