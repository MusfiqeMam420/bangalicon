import * as React from "react";

const innerMarkup = `<path d="M480 703l132-131q18-18 38-10 21 7 28 28t-10 38l-159 160q-13 13-29 13t-29-13l-159-160q-18-18-11-38 8-21 29-28t38 10zM440 200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v560h-80z"/>`;

const ArrowAlignDown = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowAlignDown;
