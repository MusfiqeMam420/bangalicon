import * as React from "react";

const innerMarkup = `<path d="M800 720q0 44-21 81a161.20000000000002 161.20000000000002 0 0 1-58 58A161.20000000000002 161.20000000000002 0 0 1 640 880H320a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 160 720V200h640zM120 280q-25 0-35-20a46.8 46.8 0 0 1 0-40Q95 200 120 200h80v80z m720-80q25 0 34 20 10 20 0 40-9 20-34 20h-80V200z m-240-120q25 0 34 20 10 20 0 40-9 20-34 20H360q-25 0-35-20a46.8 46.8 0 0 1 0-40Q335 80 360 80z m-120 496l62 62q18 18 38 11 21-8 28-29t-10-38L536 520l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 464l-62-62Q400 384 379 392a42 42 0 0 0-27 28q-7 21 10 38L424 520l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>`;

const DeleteCloseSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default DeleteCloseSolid;
