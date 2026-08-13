import * as React from "react";

const innerMarkup = `<path d="M188 348q-17 17-39 10a42 42 0 0 1-28-27Q114 310 132 292l159-160Q304 119 320 119t29 13l159 160q17 16.96 10 39-7 21-28 28-20 7-38-11L320 217zM280 160h80v480q0 25-20 35-20 9-40 0Q280 665 280 640z m492 452q17-17 38-10 22 7 29 28 7 20-11 38l-159 160q-13 13-29 13t-29-13l-159-160q-17-17-10-38 7-22 27-29 21-7 39 11l132 131zM680 800h-80V320q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34z"/>`;

const SwapVert = ({ size = 24, color = "currentColor", ...props }) =>
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

export default SwapVert;
