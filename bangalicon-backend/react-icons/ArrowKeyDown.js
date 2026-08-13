import * as React from "react";

const innerMarkup = `<path d="M732 332q18-18 38-11 21 7 28 29 7 21-10 38l-280 281q-13 13-28 13-14 0-28-13L172 388q-17-17-10-38a42 42 0 0 1 27-28q21-8 39 10l252 251z"/>`;

const ArrowKeyDown = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowKeyDown;
