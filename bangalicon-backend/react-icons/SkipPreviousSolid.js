import * as React from "react";

const innerMarkup = `<path d="M670 254a56 56 0 0 1 40-7q22 4 36 21 14 16 14 39v346q0 22-14 39a58.8 58.8 0 0 1-36 21 56 56 0 0 1-40-7l-300-174a56 56 0 0 1-26-31 61.6 61.6 0 0 1 0-41 56 56 0 0 1 26-32zM200 280q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v400q0 25-20 35-20 9-40 0Q200 705 200 680z"/>`;

const SkipPreviousSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default SkipPreviousSolid;
