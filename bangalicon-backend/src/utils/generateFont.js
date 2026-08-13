const fs = require("fs");
const path = require("path");
const svgicons2svgfont = require("svgicons2svgfont");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const { getCdnBundleBaseUrl } = require("./publicUrls");

const START_CODEPOINT = 0xe900;

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const sanitizeSvgForFont = (svg) =>
  String(svg)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(?:id|transform)=""/g, "")
    .replace(/\sfill="none"/g, "")
    .replace(/\sstyle=""/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const loadCodepoints = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    console.warn(`Could not read ${path.basename(filePath)}, rebuilding it.`);
    return {};
  }
};

const saveJson = (filePath, value) => {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
};

const toUnicodeEscape = (value) => `\\${value.toString(16)}`;

const getFreePrefix = (style) => {
  if (style === "solid") return "bgs";
  if (style === "brand") return "bgl";
  return "bg";
};

const getProPrefix = (style) => {
  if (style === "solid") return "bgps";
  if (style === "brand") return "bgpl";
  return "bgp";
};

const toPublicSlug = (icon) =>
  String(icon.name || icon.slug || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const getSlugStyleParts = (publicSlug) => {
  if (publicSlug.endsWith("-solid")) {
    return {
      baseSlug: publicSlug.slice(0, -"-solid".length),
      derivedStyle: "solid",
    };
  }

  if (publicSlug.endsWith("-brand")) {
    return {
      baseSlug: publicSlug.slice(0, -"-brand".length),
      derivedStyle: "brand",
    };
  }

  return {
    baseSlug: publicSlug,
    derivedStyle: null,
  };
};

const getBundleClassNames = (icon, getPrefix) => {
  const publicSlug = toPublicSlug(icon);
  const primaryClassName = `${getPrefix(icon.style)}-${publicSlug}`;
  const { baseSlug, derivedStyle } = getSlugStyleParts(publicSlug);
  const classNames = new Set([primaryClassName]);

  if (derivedStyle && baseSlug) {
    classNames.add(`${getPrefix(derivedStyle)}-${baseSlug}`);
  }

  return Array.from(classNames);
};

const bundles = [
  {
    key: "free",
    filter: (icon) => icon.type !== "premium",
    fontFamily: "bangalicon-free",
    fileStem: "bangalicon-free",
    codepointsFile: "codepoints-free.json",
    manifestFile: "bangalicon-free.txt",
    jsonFile: "bangalicon-free.json",
    snippetFile: "cdn-link-free.txt",
    sampleClass: '<i class="bg bg-cart-check"></i>',
    getPrefix: getFreePrefix,
  },
  {
    key: "pro",
    filter: (icon) => icon.type === "premium",
    fontFamily: "bangalicon-pro",
    fileStem: "bangalicon-pro",
    codepointsFile: "codepoints-pro.json",
    manifestFile: "bangalicon-pro.txt",
    jsonFile: "bangalicon-pro.json",
    snippetFile: "cdn-link-pro.txt",
    sampleClass: '<i class="bgp bgp-diamond-star"></i>',
    getPrefix: getProPrefix,
  },
];

const buildBundleCss = ({
  fontFamily,
  fileStem,
  publicUrl,
  icons,
  codepoints,
  getPrefix,
  assetVersion,
}) => {
  if (!icons.length) {
    return [
      `/* Bangalicon ${fontFamily} bundle */`,
      "/* No icons published in this bundle yet. */",
      "",
    ].join("\n");
  }

  const versionSuffix = assetVersion ? `?v=${assetVersion}` : "";
  const normalizedPublicUrl = String(publicUrl || "").trim().replace(/\/$/, "");
  const assetBase = normalizedPublicUrl ? `${normalizedPublicUrl}/${fileStem}` : `./${fileStem}`;
  const iconClassMap = icons.map((icon) => ({
    icon,
    classNames: getBundleClassNames(icon, getPrefix),
  }));

  const rules = iconClassMap.flatMap(({ icon, classNames }) =>
    classNames.map(
      (className) =>
        `.${className}::before { content: "${toUnicodeEscape(codepoints[icon.slug])}"; }`
    )
  );
  const selectorLines = [
    ...new Set(
      iconClassMap.flatMap(({ classNames }) =>
        classNames.flatMap((className) => {
          const prefix = className.split("-")[0];
          return [
            `[class^="${prefix}-"]::before`,
            `[class*=" ${prefix}-"]::before`,
            `.${prefix}::before`,
          ];
        })
      )
    ),
  ].filter(Boolean);

  return [
    `/* Bangalicon ${fontFamily} bundle */`,
    "@font-face {",
    `  font-family: "${fontFamily}";`,
    `  src: url("${assetBase}.eot${versionSuffix}");`,
    `  src: url("${assetBase}.eot${versionSuffix}#iefix") format("embedded-opentype"),`,
    `       url("${assetBase}.woff${versionSuffix}") format("woff"),`,
    `       url("${assetBase}.ttf${versionSuffix}") format("truetype"),`,
    `       url("${assetBase}.svg${versionSuffix}#${fontFamily}") format("svg");`,
    "  font-weight: normal;",
    "  font-style: normal;",
    "  font-display: block;",
    "}",
    "",
    `${selectorLines.join(",\n")}`,
    "{",
    `  font-family: "${fontFamily}" !important;`,
    "  font-style: normal;",
    "  font-weight: normal;",
    "  font-variant: normal;",
    "  text-transform: none;",
    "  line-height: 1;",
    "  display: inline-block;",
    "  speak: none;",
    "  -webkit-font-smoothing: antialiased;",
    "  -moz-osx-font-smoothing: grayscale;",
    "}",
    "",
    ...rules,
    "",
  ].join("\n");
};

const buildManifest = ({ label, cssUrl, icons, codepoints, iconsBaseUrl, getPrefix }) =>
  [
    `Bangalicon ${label} Manifest`,
    `Generated: ${new Date().toISOString()}`,
    `CDN CSS: ${cssUrl}`,
    `Total icons: ${icons.length}`,
    "",
    ...icons.map((icon) => {
      const className = `${getPrefix(icon.style)}-${toPublicSlug(icon)}`;
      return `${className} | ${icon.style} | ${icon.type} | ${toUnicodeEscape(
        codepoints[icon.slug]
      )} | ${iconsBaseUrl}/${icon.file}`;
    }),
    "",
  ].join("\n");

const buildIndexJson = ({ fontFamily, cssUrl, publicUrl, iconsBaseUrl, icons, codepoints, getPrefix }) => ({
  generatedAt: new Date().toISOString(),
  publicUrl,
  cssUrl,
  fontFamily,
  icons: icons.map((icon) => {
    const prefix = getPrefix(icon.style);
    return {
      name: icon.name,
      slug: toPublicSlug(icon),
      internalSlug: icon.slug,
      type: icon.type,
      style: icon.style,
      file: icon.file,
      prefix,
      className: `${prefix} ${prefix}-${toPublicSlug(icon)}`,
      unicode: toUnicodeEscape(codepoints[icon.slug]),
      svgUrl: `${iconsBaseUrl}/${icon.file}`,
      tags: Array.isArray(icon.tags) ? icon.tags : [],
    };
  }),
});

const buildSnippet = (cssUrl, sampleClass) =>
  [
    "<!-- Bangalicon CDN -->",
    `<link rel="stylesheet" href="${cssUrl}">`,
    "",
    sampleClass,
    "",
  ].join("\n");

const createSvgFont = ({ icons, iconsDir, svgFontPath, codepoints, tempDir, fontName }) =>
  new Promise((resolve, reject) => {
    const fontStream = svgicons2svgfont({
      fontName,
      fontId: fontName,
      normalize: true,
      fontHeight: 1000,
      descent: 200,
      log: () => {},
    });

    const output = fs.createWriteStream(svgFontPath);
    fontStream.pipe(output);

    output.on("finish", resolve);
    output.on("error", reject);
    fontStream.on("error", reject);

    for (const icon of icons) {
      const originalSvg = fs.readFileSync(path.join(iconsDir, icon.file), "utf8");
      const sanitizedPath = path.join(tempDir, icon.file);
      fs.writeFileSync(sanitizedPath, sanitizeSvgForFont(originalSvg), "utf8");

      const glyph = fs.createReadStream(sanitizedPath);
      glyph.metadata = {
        unicode: [String.fromCodePoint(codepoints[icon.slug])],
        name: icon.slug,
      };
      fontStream.write(glyph);
    }

    fontStream.end();
  });

const generateWebfont = async ({ icons, iconsDir, outputDir, codepoints, fileStem, fontFamily }) => {
  const svgFontPath = path.join(outputDir, `${fileStem}.svg`);
  const ttfFontPath = path.join(outputDir, `${fileStem}.ttf`);
  const woffFontPath = path.join(outputDir, `${fileStem}.woff`);
  const eotFontPath = path.join(outputDir, `${fileStem}.eot`);

  if (!icons.length) {
    for (const assetPath of [svgFontPath, ttfFontPath, woffFontPath, eotFontPath]) {
      if (fs.existsSync(assetPath)) {
        fs.rmSync(assetPath, { force: true });
      }
    }
    return;
  }

  const tempDir = path.join(outputDir, `.font-temp-${fileStem}`);

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  ensureDir(tempDir);

  await createSvgFont({
    icons,
    iconsDir,
    svgFontPath,
    codepoints,
    tempDir,
    fontName: fontFamily,
  });

  const svgFont = fs.readFileSync(svgFontPath, "utf8");
  const ttf = svg2ttf(svgFont, {});
  const ttfBuffer = Buffer.from(ttf.buffer);

  fs.writeFileSync(ttfFontPath, ttfBuffer);
  fs.writeFileSync(woffFontPath, Buffer.from(ttf2woff(ttfBuffer).buffer));
  fs.writeFileSync(eotFontPath, Buffer.from(ttf2eot(ttfBuffer).buffer));

  fs.rmSync(tempDir, { recursive: true, force: true });
};

const assignCodepoints = (icons, savedCodepoints) => {
  const nextCodepoints = {};
  let currentCodepoint =
    Math.max(
      START_CODEPOINT - 1,
      ...Object.values(savedCodepoints).map((value) => Number(value) || 0)
    ) + 1;

  for (const icon of icons) {
    if (savedCodepoints[icon.slug]) {
      nextCodepoints[icon.slug] = savedCodepoints[icon.slug];
      continue;
    }

    nextCodepoints[icon.slug] = currentCodepoint;
    currentCodepoint += 1;
  }

  return nextCodepoints;
};

const generateFont = async (icons = []) => {
  const iconsDir = path.join(__dirname, "../../uploads");
  const outputDir = path.join(__dirname, "../../cdn");
  const fallbackIcons = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      name: path.basename(file, ".svg"),
      slug: path.basename(file, ".svg"),
      style: "regular",
      type: "free",
      file,
      tags: [],
    }));

  const sourceIcons = (Array.isArray(icons) && icons.length ? icons : fallbackIcons)
    .filter((icon) => icon?.file && fs.existsSync(path.join(iconsDir, icon.file)))
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));

  ensureDir(outputDir);

  const bundleIndex = {
    generatedAt: new Date().toISOString(),
    bundles: {},
  };

  for (const bundle of bundles) {
    const bundleIcons = sourceIcons.filter(bundle.filter);
    const bundleDir = path.join(outputDir, bundle.key);
    const iconsOutputDir = path.join(bundleDir, "icons");
    const assetVersion = Date.now();
    const publicBase = getCdnBundleBaseUrl(bundle.key);
    const cssUrl = `${publicBase}/${bundle.fileStem}.css`;
    const iconsBaseUrl = `${publicBase}/icons`;
    const codepointsPath = path.join(bundleDir, bundle.codepointsFile);

    ensureDir(bundleDir);
    if (fs.existsSync(iconsOutputDir)) {
      fs.rmSync(iconsOutputDir, { recursive: true, force: true });
    }
    ensureDir(iconsOutputDir);

    for (const icon of bundleIcons) {
      fs.copyFileSync(path.join(iconsDir, icon.file), path.join(iconsOutputDir, icon.file));
    }

    const codepoints = assignCodepoints(bundleIcons, loadCodepoints(codepointsPath));
    saveJson(codepointsPath, codepoints);

    await generateWebfont({
      icons: bundleIcons,
      iconsDir,
      outputDir: bundleDir,
      codepoints,
      fileStem: bundle.fileStem,
      fontFamily: bundle.fontFamily,
    });

    const css = buildBundleCss({
      fontFamily: bundle.fontFamily,
      fileStem: bundle.fileStem,
      publicUrl: publicBase,
      icons: bundleIcons,
      codepoints,
      getPrefix: bundle.getPrefix,
      assetVersion,
    });

    fs.writeFileSync(path.join(bundleDir, `${bundle.fileStem}.css`), css, "utf8");
    fs.writeFileSync(
      path.join(bundleDir, bundle.manifestFile),
      buildManifest({
        label: bundle.key.toUpperCase(),
        cssUrl,
        icons: bundleIcons,
        codepoints,
        iconsBaseUrl,
        getPrefix: bundle.getPrefix,
      }),
      "utf8"
    );
    saveJson(
      path.join(bundleDir, bundle.jsonFile),
      buildIndexJson({
        fontFamily: bundle.fontFamily,
        cssUrl,
        publicUrl: publicBase,
        iconsBaseUrl,
        icons: bundleIcons,
        codepoints,
        getPrefix: bundle.getPrefix,
      })
    );
    fs.writeFileSync(
      path.join(bundleDir, bundle.snippetFile),
      buildSnippet(cssUrl, bundle.sampleClass),
      "utf8"
    );

    bundleIndex.bundles[bundle.key] = {
      cssUrl,
      manifestUrl: `${publicBase}/${bundle.manifestFile}`,
      jsonUrl: `${publicBase}/${bundle.jsonFile}`,
      snippetUrl: `${publicBase}/${bundle.snippetFile}`,
      iconsCount: bundleIcons.length,
    };
  }

  saveJson(path.join(outputDir, "bundle-index.json"), bundleIndex);
  console.log(`Bangalicon free/pro bundles generated successfully for ${sourceIcons.length} icons`);
};

module.exports = generateFont;
