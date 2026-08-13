import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m0-200q54 0 100-27a192 192 0 0 0 73-73Q680 534 680 480t-27-100A184 184 0 0 0 580 307 194 194 0 0 0 480 280q-54 0-100 27A192 192 0 0 0 307 380Q280 426 280 480t27 100A201.6 201.6 0 0 0 380 653Q426 680 480 680"/>`;

const RecodeCircleSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default RecodeCircleSolid;
