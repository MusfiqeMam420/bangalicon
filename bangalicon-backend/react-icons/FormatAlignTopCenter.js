import * as React from "react";

const innerMarkup = `<path d="M320 520q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h320q25 0 34 20 10 20 0 40-9 20-34 20zM160 280q-25 0-35-20a46.8 46.8 0 0 1 0-40Q135 200 160 200h640q25 0 34 20 10 20 0 40-9 20-34 20z m80 480q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h480q25 0 34 20 10 20 0 40-9 20-34 20z"/>`;

const FormatAlignTopCenter = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FormatAlignTopCenter;
