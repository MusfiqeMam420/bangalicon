import * as React from "react";

const innerMarkup = `<path d="M256 796q-32 10-60-5a77.6 77.6 0 0 1-37-45 84 84 0 0 1 3-61l245-506q14-30 43-40a79.2 79.2 0 0 1 58 0q30 11 44 39l244 520q14 31 3 61t-40 45q-28 15-61 3l-168-54q-42-14-56-18-13-5-5-4a40 40 0 0 0 8 3 28 28 0 0 0 7 1z"/>`;

const NavigationSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default NavigationSolid;
