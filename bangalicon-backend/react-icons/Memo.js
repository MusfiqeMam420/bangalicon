import * as React from "react";

const innerMarkup = `<path d="M840 548q0 15-5 27a76 76 0 0 1-16 22l-221 222a72 72 0 0 1-23 16A68 68 0 0 1 548 840H280a160 160 0 0 1-80-21A168 168 0 0 1 141 760 160 160 0 0 1 120 680V280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80zM760 280q0-38-21-59T680 200H280q-37 0-59 21Q200 242 200 280v400q0 37 21 59Q243 760 280 760h263L760 543z m40 320h-200v200h-80v-240q0-19 10-29Q540.9599999999999 520 560 520h240z"/>`;

const Memo = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Memo;
