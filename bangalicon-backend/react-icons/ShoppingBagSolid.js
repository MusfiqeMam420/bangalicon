import * as React from "react";

const innerMarkup = `<path d="M320 880a160 160 0 0 1-80-21A168 168 0 0 1 181 800 160 160 0 0 1 160 720v-320q0-43 21-80A158.8 158.8 0 0 1 240 262 154 154 0 0 1 320 240h320q43 0 80 22 37 21 58 58 22 37 22 80v320q0 43-22 80A158.8 158.8 0 0 1 720 859 160 160 0 0 1 640 880zM320 240q0-43 21-80A158.8 158.8 0 0 1 400 102 154 154 0 0 1 480 80q43 0 80 22 37 21 58 58 22 37 22 80v120q0 25-20 35-20 9-40 0Q560 385 560 360V240q0-37-22-58Q517 160 480 160t-59 22Q400 203 400 240v120q0 25-20 35-20 9-40 0Q320 385 320 360z"/>`;

const ShoppingBagSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ShoppingBagSolid;
