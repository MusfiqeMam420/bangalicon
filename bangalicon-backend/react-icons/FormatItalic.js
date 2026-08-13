import * as React from "react";

const innerMarkup = `<path d="M479 200h82l-80 560h-82zM320 800q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h240q25 0 34 20 10 20 0 40-9 20-34 20z m80-560q-25 0-35-20a46.8 46.8 0 0 1 0-40Q375 160 400 160h240q25 0 34 20 10 20 0 40-9 20-34 20z"/>`;

const FormatItalic = ({ size = 24, color = "currentColor", ...props }) =>
  React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 1000 1000",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: { color },
    dangerouslySetInnerHTML: { __html: innerMarkup },
    ...props,
  });

export default FormatItalic;
