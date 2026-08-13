const fs = require("fs");
const path = require("path");
const { readPackageVersions } = require("./packageVersions");

const iconsDir = path.join(__dirname, "../../uploads");
const reactOutputDir = path.join(__dirname, "../../react-icons");
const vueOutputDir = path.join(__dirname, "../../vue-icons");
const svelteOutputDir = path.join(__dirname, "../../svelte-icons");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const cleanOutputDir = (dirPath) => {
  ensureDir(dirPath);

  for (const existingFile of fs.readdirSync(dirPath)) {
    fs.rmSync(path.join(dirPath, existingFile), { recursive: true, force: true });
  }
};

const toPascalCase = (value) =>
  String(value)
    .replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");

const toPublicSlug = (icon) =>
  String(icon.name || icon.slug || path.basename(icon.file || "", ".svg"))
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const componentNameForIcon = (icon) => {
  const baseName = toPascalCase(toPublicSlug(icon));

  if (icon.style === "solid") {
    return `${baseName}Solid`;
  }

  if (icon.style === "brand") {
    return `${baseName}Brand`;
  }

  return baseName;
};

const reactAttributeMap = {
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "vector-effect": "vectorEffect",
  "xmlns:xlink": "xmlnsXlink",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
};

const normalizeInnerSvg = (markup, mode) => {
  let output = String(markup)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(?:id|style|data-name)=".*?"/gi, "")
    .replace(/\sfill="(?!none).*?"/gi, ' fill="currentColor"')
    .replace(/\sstroke="(?!none).*?"/gi, ' stroke="currentColor"')
    .replace(/\s{2,}/g, " ")
    .trim();

  if (mode === "react") {
    output = output.replace(/\s([:@a-zA-Z-]+)=/g, (full, attribute) => {
      const nextAttribute = reactAttributeMap[attribute];
      return ` ${nextAttribute || attribute}=`;
    });
  }

  return output;
};

const extractSvgParts = (svgCode) => {
  const viewBoxMatch = String(svgCode).match(/viewBox="([^"]+)"/i);
  const innerMarkup = String(svgCode)
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

  return {
    viewBox: viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24",
    reactInnerMarkup: normalizeInnerSvg(innerMarkup, "react"),
    templateInnerMarkup: normalizeInnerSvg(innerMarkup, "template"),
  };
};

const buildReactInnerMarkupForTemplate = (innerMarkup) =>
  String(innerMarkup)
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

const buildReactComponentCode = ({ componentName, viewBox, innerMarkup }) => `import * as React from "react";

const innerMarkup = \`${buildReactInnerMarkupForTemplate(innerMarkup)}\`;

const ${componentName} = ({ size = 24, color = "currentColor", ...props }) =>
  React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "${viewBox}",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: { color },
    dangerouslySetInnerHTML: { __html: innerMarkup },
    ...props,
  });

export default ${componentName};
`;

const buildReactTypes = (componentName) => `import * as React from "react";

declare const ${componentName}: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default ${componentName};
`;

const buildVueComponentCode = ({ componentName, viewBox, innerMarkup }) => `<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24,
  },
  color: {
    type: String,
    default: "currentColor",
  },
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="${viewBox}"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color }"
  >
    ${innerMarkup}
  </svg>
</template>
`;

const buildSvelteComponentCode = ({ componentName, viewBox, innerMarkup }) => `<script>
  /** @type {number | string} */
  export let size = 24;
  /** @type {string} */
  export let color = "currentColor";
</script>

<svg
  width={size}
  height={size}
  viewBox="${viewBox}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style:color={color}
>
  ${innerMarkup}
</svg>
`;

const frameworkLabels = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
};

const frameworkProps = {
  react: "| `size` | `number | string` | `24` | Controls the rendered icon size. |\n| `color` | `string` | `currentColor` | Uses your chosen icon color. |\n| `...props` | `SVG props` | - | Pass any native SVG attributes or accessibility props. |",
  vue: "| `size` | `number | string` | `24` | Controls the rendered icon size. |\n| `color` | `string` | `currentColor` | Uses your chosen icon color. |",
  svelte: "| `size` | `number | string` | `24` | Controls the rendered icon size. |\n| `color` | `string` | `currentColor` | Uses your chosen icon color. |",
};

const buildReadme = (framework, installCommand, sampleImport, sampleBody, count) => {
  const frameworkLabel = frameworkLabels[framework] || framework;
  const propsTable = frameworkProps[framework] || frameworkProps.react;

  return [
    `# @bangalicon/${framework}`,
    "",
    `${frameworkLabel} icon components for Bangalicon, generated directly from the latest icon library uploads.`,
    "",
    "## Why use this package",
    "",
    `- Built for ${frameworkLabel} projects with ready-to-import icon components.`,
    "- Follows the Bangalicon library automatically as new icons are published.",
    "- Supports simple sizing and color control with clean SVG output.",
    "",
    "## Install",
    "",
    "```bash",
    installCommand,
    "```",
    "",
    "## Quick start",
    "",
    sampleImport,
    sampleBody,
    "",
    "## Component props",
    "",
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    propsTable,
    "",
    "## Notes",
    "",
    "- Icons inherit `currentColor` by default, so they fit naturally into your UI.",
    "- Use your framework's normal class and style patterns to control spacing and layout.",
    `- This package currently includes ${count} generated icons.`,
    "",
    "## Package details",
    "",
    `- Package: \`@bangalicon/${framework}\``,
    `- Framework: ${frameworkLabel}`,
    `- Generated icons: ${count}`,
    "",
  ].join("\n");
};

const buildReactPackageJson = (version) => ({
  name: "@bangalicon/react",
  version,
  description: "React icon components generated from Bangalicon uploads.",
  license: "MIT",
  type: "module",
  sideEffects: false,
  main: "./index.js",
  module: "./index.js",
  types: "./index.d.ts",
  exports: {
    ".": {
      types: "./index.d.ts",
      import: "./index.js",
      default: "./index.js",
    },
  },
  files: ["*.js", "*.d.ts", "README.md", "icons.json"],
  keywords: ["icons", "react", "bangalicon", "svg"],
  peerDependencies: {
    react: ">=18",
  },
  publishConfig: {
    access: "public",
  },
});

const buildVuePackageJson = (version) => ({
  name: "@bangalicon/vue",
  version,
  description: "Vue icon components generated from Bangalicon uploads.",
  license: "MIT",
  type: "module",
  sideEffects: false,
  main: "./index.js",
  module: "./index.js",
  exports: {
    ".": "./index.js",
  },
  files: ["*.vue", "*.js", "README.md", "icons.json"],
  keywords: ["icons", "vue", "bangalicon", "svg"],
  peerDependencies: {
    vue: ">=3",
  },
  publishConfig: {
    access: "public",
  },
});

const buildSveltePackageJson = (version) => ({
  name: "@bangalicon/svelte",
  version,
  description: "Svelte icon components generated from Bangalicon uploads.",
  license: "MIT",
  type: "module",
  sideEffects: false,
  main: "./index.js",
  module: "./index.js",
  exports: {
    ".": "./index.js",
  },
  files: ["*.svelte", "*.js", "README.md", "icons.json"],
  keywords: ["icons", "svelte", "bangalicon", "svg"],
  peerDependencies: {
    svelte: ">=4",
  },
  publishConfig: {
    access: "public",
  },
});

const generateFrameworkIcons = async (icons = []) => {
  cleanOutputDir(reactOutputDir);
  cleanOutputDir(vueOutputDir);
  cleanOutputDir(svelteOutputDir);
  const versions = readPackageVersions();

  const sourceIcons = (Array.isArray(icons) && icons.length
    ? icons
    : fs
        .readdirSync(iconsDir)
        .filter((file) => file.endsWith(".svg"))
        .sort((a, b) => a.localeCompare(b))
        .map((file) => ({
          name: path.basename(file, ".svg"),
          slug: path.basename(file, ".svg"),
          style: "regular",
          file,
        })))
    .filter((icon) => icon?.file && fs.existsSync(path.join(iconsDir, icon.file)))
    .sort((a, b) => String(a.file).localeCompare(String(b.file)));

  const generatedIcons = [];

  for (const icon of sourceIcons) {
    const svgPath = path.join(iconsDir, icon.file);
    const svgCode = fs.readFileSync(svgPath, "utf8");
    const componentName = componentNameForIcon(icon);
    const { viewBox, reactInnerMarkup, templateInnerMarkup } = extractSvgParts(svgCode);

    generatedIcons.push({
      file: icon.file,
      name: icon.name,
      slug: toPublicSlug(icon),
      style: icon.style || "regular",
      componentName,
      packages: {
        react: "@bangalicon/react",
        vue: "@bangalicon/vue",
        svelte: "@bangalicon/svelte",
      },
      usage: {
        react: `<${componentName} size={24} color="currentColor" />`,
        vue: `<${componentName} :size="24" color="currentColor" />`,
        svelte: `<${componentName} size={24} color="currentColor" />`,
      },
    });

    fs.writeFileSync(
      path.join(reactOutputDir, `${componentName}.js`),
      buildReactComponentCode({ componentName, viewBox, innerMarkup: reactInnerMarkup }),
      "utf8"
    );
    fs.writeFileSync(path.join(reactOutputDir, `${componentName}.d.ts`), buildReactTypes(componentName), "utf8");

    fs.writeFileSync(
      path.join(vueOutputDir, `${componentName}.vue`),
      buildVueComponentCode({ componentName, viewBox, innerMarkup: templateInnerMarkup }),
      "utf8"
    );

    fs.writeFileSync(
      path.join(svelteOutputDir, `${componentName}.svelte`),
      buildSvelteComponentCode({ componentName, viewBox, innerMarkup: templateInnerMarkup }),
      "utf8"
    );
  }

  const reactExportsJs = generatedIcons
    .map((icon) => `export { default as ${icon.componentName} } from "./${icon.componentName}.js";`)
    .join("\n");
  const reactExportsTypes = generatedIcons
    .map((icon) => `export { default as ${icon.componentName} } from "./${icon.componentName}";`)
    .join("\n");
  const vueExportsJs = generatedIcons
    .map((icon) => `export { default as ${icon.componentName} } from "./${icon.componentName}.vue";`)
    .join("\n");
  const svelteExportsJs = generatedIcons
    .map((icon) => `export { default as ${icon.componentName} } from "./${icon.componentName}.svelte";`)
    .join("\n");

  fs.writeFileSync(path.join(reactOutputDir, "index.js"), `${reactExportsJs}\n`, "utf8");
  fs.writeFileSync(path.join(reactOutputDir, "index.d.ts"), `${reactExportsTypes}\n`, "utf8");
  fs.writeFileSync(
    path.join(reactOutputDir, "README.md"),
    buildReadme(
      "react",
      "npm install @bangalicon/react",
      "```jsx\nimport { CartCheck } from \"@bangalicon/react\";\n",
      "\nexport default function Example() {\n  return <CartCheck size={24} color=\"#111111\" />;\n}\n```",
      generatedIcons.length
    ),
    "utf8"
  );
  fs.writeFileSync(
    path.join(reactOutputDir, "package.json"),
    JSON.stringify(buildReactPackageJson(versions.react), null, 2),
    "utf8"
  );
  fs.writeFileSync(path.join(reactOutputDir, "icons.json"), JSON.stringify(generatedIcons, null, 2), "utf8");

  fs.writeFileSync(path.join(vueOutputDir, "index.js"), `${vueExportsJs}\n`, "utf8");
  fs.writeFileSync(
    path.join(vueOutputDir, "README.md"),
    buildReadme(
      "vue",
      "npm install @bangalicon/vue",
      "```vue\n<script setup>\nimport { CartCheck } from \"@bangalicon/vue\";\n</script>\n\n<template>",
      "\n  <CartCheck :size=\"24\" color=\"#111111\" />\n</template>\n```",
      generatedIcons.length
    ),
    "utf8"
  );
  fs.writeFileSync(
    path.join(vueOutputDir, "package.json"),
    JSON.stringify(buildVuePackageJson(versions.vue), null, 2),
    "utf8"
  );
  fs.writeFileSync(path.join(vueOutputDir, "icons.json"), JSON.stringify(generatedIcons, null, 2), "utf8");

  fs.writeFileSync(path.join(svelteOutputDir, "index.js"), `${svelteExportsJs}\n`, "utf8");
  fs.writeFileSync(
    path.join(svelteOutputDir, "README.md"),
    buildReadme(
      "svelte",
      "npm install @bangalicon/svelte",
      "```svelte\n<script>\n  import { CartCheck } from \"@bangalicon/svelte\";\n</script>\n",
      "\n<CartCheck size={24} color=\"#111111\" />\n```",
      generatedIcons.length
    ),
    "utf8"
  );
  fs.writeFileSync(
    path.join(svelteOutputDir, "package.json"),
    JSON.stringify(buildSveltePackageJson(versions.svelte), null, 2),
    "utf8"
  );
  fs.writeFileSync(path.join(svelteOutputDir, "icons.json"), JSON.stringify(generatedIcons, null, 2), "utf8");

  console.log(`React, Vue, and Svelte icons updated for ${generatedIcons.length} icons`);
};

module.exports = generateFrameworkIcons;
