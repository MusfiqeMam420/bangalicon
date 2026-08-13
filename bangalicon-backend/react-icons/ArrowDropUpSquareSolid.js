import * as React from "react";

const innerMarkup = `<path d="M280 840a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 120 680V280q0-44 21-81a161.20000000000002 161.20000000000002 0 0 1 58-58A161.20000000000002 161.20000000000002 0 0 1 280 120h400q44 0 81 21t58 58T840 280v400q0 44-21 81a161.20000000000002 161.20000000000002 0 0 1-58 58A161.20000000000002 161.20000000000002 0 0 1 680 840z m320-280q17 0 28-12t11-28a35.2 35.2 0 0 0-11-28l-120-120A36 36 0 0 0 480 360q-17 0-28 12l-120 120q-12 11-12 28 1.04 16 12 28 11 12 28 12z"/>`;

const ArrowDropUpSquareSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowDropUpSquareSolid;
