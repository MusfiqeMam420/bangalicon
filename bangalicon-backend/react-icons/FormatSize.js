import * as React from "react";

const innerMarkup = `<path d="M560 200h80v560q0 25-20 35-20 9-40 0-20-10-20-35z m-320 200h80v360q0 25-20 35-20 9-40 0Q240 785 240 760z m-80 40q-25 0-35-20a46.8 46.8 0 0 1 0-40Q135 360 160 360h240q25 0 34 20 10 20 0 40-9 20-34 20z m240-200q-25 0-35-20a46.8 46.8 0 0 1 0-40Q375 160 400 160h400q25 0 34 20 10 20 0 40-9 20-34 20z"/>`;

const FormatSize = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FormatSize;
