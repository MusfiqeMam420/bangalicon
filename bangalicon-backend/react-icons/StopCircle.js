import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m0-80q88.96000000000001 0 162-42a304 304 0 0 0 116-115Q800 569 800 480t-42-162a304 304 0 0 0-116-116Q568.96 160 480 160 391 160 317 202a304 304 0 0 0-115 116Q160 391 160 480t42 163a308 308 0 0 0 115 115Q391 800 480 800M320 380q0-25 17-42Q355 320 380 320h200q25 0 42 18 18 16.96 18 42v200q0 25-18 43A57.199999999999996 57.199999999999996 0 0 1 580 640h-200q-25 0-43-17A60 60 0 0 1 320 580z"/>`;

const StopCircle = ({ size = 24, color = "currentColor", ...props }) =>
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

export default StopCircle;
