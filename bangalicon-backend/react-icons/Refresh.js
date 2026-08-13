import * as React from "react";

const innerMarkup = `<path d="M480 800a314.8 314.8 0 0 1-161-43 322.40000000000003 322.40000000000003 0 0 1-116-116A314.8 314.8 0 0 1 160 480q0-87 43-161a312 312 0 0 1 116-116Q392 160 480 160q65 0 123 25 58 24 102 68l123 118-56 58-123-118A260 260 0 0 0 572 258Q531 240 480 240q-68 0-123 31a222 222 0 0 0-86 86Q240 412 240 480t31 123a222 222 0 0 0 86 86Q412 720 480 720q32 0 59-7 28-7 52-20a292 292 0 0 0 47-32l12-12q18-17 39-9 21 7 27 29 7 21-10 38-30 29-65 50a296 296 0 0 1-76 32A320 320 0 0 1 480 800m160-360q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h120V240q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v159q0 18-12 30-11 11-29 11z"/>`;

const Refresh = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Refresh;
