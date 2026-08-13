import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m63-440H320q-25 0-35 20-9 20 0 40 10 20 35 20h223L472 592q-18 18-11 39 7 20 28 27 22 7 39-10l140-139a38 38 0 0 0 13-29 38 38 0 0 0-13-29L528 312q-18-18-39-11-20 7-27 29-7 21 10 38z"/>`;

const ArrowRightCircleSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowRightCircleSolid;
