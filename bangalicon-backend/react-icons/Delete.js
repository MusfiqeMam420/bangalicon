import * as React from "react";

const innerMarkup = `<path d="M240 280v440q0 37 21 59Q283 800 320 800h320q38 0 59-21Q720 757 720 720V280z m560 440q0 44-21 81a161.20000000000002 161.20000000000002 0 0 1-58 58A161.20000000000002 161.20000000000002 0 0 1 640 880H320a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 160 720V200h640zM120 280q-25 0-35-20a46.8 46.8 0 0 1 0-40Q95 200 120 200h80v80z m720-80q25 0 34 20 10 20 0 40-9 20-34 20h-80V200z m-240-120q25 0 34 20 10 20 0 40-9 20-34 20H360q-25 0-35-20a46.8 46.8 0 0 1 0-40Q335 80 360 80z"/>`;

const Delete = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Delete;
