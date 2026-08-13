import * as React from "react";

const innerMarkup = `<path d="M628 732q18 18 11 39-7 20-29 27-21 7-38-10l-281-280q-13-14-13-28 0-15 13-28l281-280q17-17 38-10t28 28q8 20-10 38L377 480z"/>`;

const ArrowKeyLeft = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowKeyLeft;
