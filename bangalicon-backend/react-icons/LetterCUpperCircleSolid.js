import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m141-542a197.2 197.2 0 0 0-103-55q-60-12-115 12a196 196 0 0 0-89 74A193.2 193.2 0 0 0 280 480q0 61 34 112a198 198 0 0 0 89 73 198.79999999999998 198.79999999999998 0 0 0 115 12q60-12 103-55 17-17 10-38-7-22-28-29-20-8-38 10-28 28-62 35-33 6-69-9T379 548Q360 519 360 480q0-40 19-68t55-43 69-8q34 6 62 34 18 18 38 11 21-8 28-29 7-22-10-39"/>`;

const LetterCUpperCircleSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default LetterCUpperCircleSolid;
