import * as React from "react";

const innerMarkup = `<path d="M120 280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80v40q0 25-20 35-20 9-40 0Q760 345 760 320V280q0-37-22-58Q717 200 680 200H280q-37 0-59 22Q200 243 200 280v40q0 18-12 29-12 10-28 10t-28-10Q120 338 120 320z m228 228q-17 17-39 10a42 42 0 0 1-28-27q-7-21 11-39l159-160q13-13 29-13t29 13l159 160q17 17 10 39-7 21-28 28-20 7-38-11L480 377zM440 320h80v480q0 25-20 35-20 9-40 0-20-10-20-35z"/>`;

const ArrowInUp = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowInUp;
