import * as React from "react";

const innerMarkup = `<path d="M840 548q0 15-5 27a76 76 0 0 1-16 22l-221 222a72 72 0 0 1-23 16A68 68 0 0 1 548 840H280a160 160 0 0 1-80-21A168 168 0 0 1 141 760 160 160 0 0 1 120 680V280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80z m-360-12l62 62q18 18 38 11 21-8 28-29t-10-38L536 480l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 424l-62-62Q400 344 379 352a42 42 0 0 0-27 28q-7 21 10 38L424 480l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>`;

const MemoCloseSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default MemoCloseSolid;
