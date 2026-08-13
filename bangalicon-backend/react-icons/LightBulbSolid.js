import * as React from "react";

const innerMarkup = `<path d="M401 760a80.8 80.8 0 0 1-58-23A80.8 80.8 0 0 1 320 679v-6q1 1 1 2 1 0 2 2H322q-79-51-121-122A308 308 0 0 1 160 400q0-87 42-161a310.4 310.4 0 0 1 117-116A314.8 314.8 0 0 1 480 80q87 0 161 43 74 42 116 116A314.8 314.8 0 0 1 800 400a302.4 302.4 0 0 1-42 155q-41 71-119 122h-2 1v-2l2-2v6q0 34-24 58-23 23-57 23zM480 920q-27 0-49-16a81.19999999999999 81.19999999999999 0 0 1-28-43q-7-26 5-55 2-6 9-6H544q6 0 9 6 11 29 4 55a81.19999999999999 81.19999999999999 0 0 1-28 43Q508 920 480 920"/>`;

const LightBulbSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default LightBulbSolid;
