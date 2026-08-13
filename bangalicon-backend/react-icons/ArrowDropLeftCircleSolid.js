import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m80-520q0-17-12-28a40 40 0 0 0-28-11 35.2 35.2 0 0 0-28 11l-120 120q-12 11-12 28t12 28l120 120q10.96 12 27 12a45.599999999999994 45.599999999999994 0 0 0 29-12q12-11 12-28z"/>`;

const ArrowDropLeftCircleSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowDropLeftCircleSolid;
