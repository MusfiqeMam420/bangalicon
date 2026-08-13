import * as React from "react";

const innerMarkup = `<path d="M400.43999999999994 480h159.07999999999998L480 312.44z"/><path d="M480 60L60 210 146.48 720 480 900l333.28000000000003-180L900 210z m165 600l-49.84-105H364.79999999999995L315 660H240l240-525L720 660z"/>`;

const AngularBrand = ({ size = 24, color = "currentColor", ...props }) =>
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

export default AngularBrand;
