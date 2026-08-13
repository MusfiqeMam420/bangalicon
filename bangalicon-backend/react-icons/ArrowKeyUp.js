import * as React from "react";

const innerMarkup = `<path d="M228 628q-18 18-39 11a42 42 0 0 1-27-28q-7-22 10-39l280-281q14-13 28-13 15 0 28 13l280 281q17 17 10 38t-28 29q-20 7-38-11L480 377z"/>`;

const ArrowKeyUp = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowKeyUp;
