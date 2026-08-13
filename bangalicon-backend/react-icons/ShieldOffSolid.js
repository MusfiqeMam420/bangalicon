import * as React from "react";

const innerMarkup = `<path d="M120 282q0-46 21-83A146.4 146.4 0 0 1 198 142L200 144l569 569-197 148a148.8 148.8 0 0 1-92 31q-51 0-92-31l-211-158q-27-22-42-51A140 140 0 0 1 120 588z m173-157Q306 120 320 120h358q46 0 83 21t58 58T840 282v306q0 15-4 30a92 92 0 0 1-12 26l-10 2zM92 148q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>`;

const ShieldOffSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ShieldOffSolid;
