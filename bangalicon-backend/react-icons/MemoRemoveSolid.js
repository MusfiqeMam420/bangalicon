import * as React from "react";

const innerMarkup = `<path d="M840 548q0 15-5 27a76 76 0 0 1-16 22l-221 222a72 72 0 0 1-23 16A68 68 0 0 1 548 840H280a160 160 0 0 1-80-21A168 168 0 0 1 141 760 160 160 0 0 1 120 680V280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80z m-240-28q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20H360q-25 0-35 20-9 20 0 40 10 20 35 20z"/>`;

const MemoRemoveSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default MemoRemoveSolid;
