import * as React from "react";

const innerMarkup = `<path d="M360 560a36 36 0 0 1-28-12A44 44 0 0 1 320 520q0-17 12-28l120-120q11-12 28-12t28 12l120 120q12 12 11 28 0 16-11 28t-28 12z m120 320q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m0-80q88.96000000000001 0 162-42a304 304 0 0 0 116-115Q800 569 800 480t-42-162a304 304 0 0 0-116-116Q568.96 160 480 160 391 160 317 202a304 304 0 0 0-115 116Q160 391 160 480t42 163a308 308 0 0 0 115 115Q391 800 480 800"/>`;

const ArrowDropUpCircle = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowDropUpCircle;
