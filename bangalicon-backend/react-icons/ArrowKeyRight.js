import * as React from "react";

const innerMarkup = `<path d="M332 228q-18-18-11-38 7-21 28-28 22-7 39 10l281 280q13 13 13 28 0 14-13 28l-281 280q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27q-7-21 11-39l251-252z"/>`;

const ArrowKeyRight = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowKeyRight;
