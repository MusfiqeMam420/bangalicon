import * as React from "react";

const innerMarkup = `<path d="M241 880q-75 0-118-42-42-43-42-118v-4q0-59 55-103Q191 568 282 544t199-24q107 0 198 24 92 24 147 69 55 44 55 103v4q0 75-43 118Q796 880 721 880z m240-400a196 196 0 0 1-101-27 204 204 0 0 1-73-72A201.6 201.6 0 0 1 281 280q0-55 26-101a194 194 0 0 1 73-72A196 196 0 0 1 481 80q55 0 100 27a194 194 0 0 1 73 72q27 46 27 101t-27 101a204 204 0 0 1-73 72Q536 480 481 480"/>`;

const PersonSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default PersonSolid;
