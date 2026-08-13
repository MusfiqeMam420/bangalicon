import * as React from "react";

const innerMarkup = `<path d="M492 228q-17-17-10-38t27-28q21-8 39 10l280 279q13 13 13 29t-13 29l-280 279q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27q-7-21 11-39l251-252zM800 440v80H160q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20z"/>`;

const ArrowRight = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowRight;
