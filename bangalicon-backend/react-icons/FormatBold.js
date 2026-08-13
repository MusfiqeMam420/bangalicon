import * as React from "react";

const innerMarkup = `<path d="M320 800a80 80 0 0 1-57-23A80 80 0 0 1 240 720v-280h300q49.04 0 90 24 42 24 66 66 24 40.96 24 90t-24 91q-24 41-66 65-40.96 24-90 24z m220-80q46 0 73-27T640 620t-27-73T540 520H320v200q0 3-2 3-1 0-1-1 0-2 3-2zM240 240q0-34 23-57A80 80 0 0 1 320 160h199q48 0 90 24t66 66A169.60000000000002 169.60000000000002 0 0 1 700 340q0 49-25 91-24 41-66 65t-90 24H240z m279 200q46 0 73-27 28-27 28-73t-28-73Q565 240 519 240H320q-3 0-3-1 0-2 1-2Q320 237 320 240v200z"/>`;

const FormatBold = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FormatBold;
