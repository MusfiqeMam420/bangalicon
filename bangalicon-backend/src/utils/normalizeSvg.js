const fs = require("fs");
const { optimize } = require("svgo");
const svgpath = require("svgpath");

function normalizeSvg(filePath) {
  let svg = fs.readFileSync(filePath, "utf8");

  const result = optimize(svg, {
    multipass: true,
    plugins: [
      "removeDimensions",
      {
        name: "removeAttrs",
        params: {
          attrs: "(fill|stroke|style)",
        },
      },
      "convertPathData",
    ],
  });

  svg = result.data;

  if (/viewBox="[^"]+"/.test(svg)) {
    svg = svg.replace(/viewBox="[^"]+"/, 'viewBox="0 0 1000 1000"');
  } else {
    svg = svg.replace("<svg", '<svg viewBox="0 0 1000 1000"');
  }

  svg = svg.replace(/d="([^"]+)"/g, (match, d) => {
    const newPath = svgpath(d).scale(40).translate(0, 0).toString();
    return `d="${newPath}"`;
  });

  fs.writeFileSync(filePath, svg);
}

module.exports = normalizeSvg;
