import * as React from "react";

const innerMarkup = `<path d="M240 800a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 80 640V320q0-44 21-81a161.20000000000002 161.20000000000002 0 0 1 58-58A161.20000000000002 161.20000000000002 0 0 1 240 160h320q44 0 80 21 37 21 58 58A156 156 0 0 1 720 320v320a156 156 0 0 1-22 81 161.20000000000002 161.20000000000002 0 0 1-58 58Q604 800 560 800z m400-260v-120L774 320q23-17 47-14 25 2 42 21 17 18 17 46v214q0 28-17 47-17 18-42 21-24 2-47-15z"/>`;

const VideocamSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default VideocamSolid;
