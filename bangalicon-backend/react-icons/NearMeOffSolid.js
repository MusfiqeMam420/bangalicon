import * as React from "react";

const innerMarkup = `<path d="M158 485q-29-16-38-46t5-58A80 80 0 0 1 170 340l168-59 336 336-65 181q-12 32-41 46a81.19999999999999 81.19999999999999 0 0 1-60 3q-31-10-46-41l-103-204H358q0-1-1-2z m543-330q32-10 60 3 28 12 40 41 13.040000000000001 28 3 59l-101 277-282-282zM92 148q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>`;

const NearMeOffSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default NearMeOffSolid;
