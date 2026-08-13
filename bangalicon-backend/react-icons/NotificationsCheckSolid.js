import * as React from "react";

const innerMarkup = `<path d="M120 760q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h40v-280q0-87 43-160a320 320 0 0 1 116-117A314.8 314.8 0 0 1 480 80q87 0 160 43A317.6 317.6 0 0 1 757 240 309.6 309.6 0 0 1 800 400v280h40q25 0 34 20 10 20 0 40-9 20-34 20z m360 160q-27 0-49-16a81.19999999999999 81.19999999999999 0 0 1-28-43q-7-26 5-55 0-3 3-4a10.8 10.8 0 0 1 6-2H544q2 0 5 2a6 6 0 0 1 4 4q11 29 4 55a81.19999999999999 81.19999999999999 0 0 1-28 43Q508 920 480 920m-69-373q13 13 29 14 16 0 29-13l159-160q17-17 10-38-7-22-28-29-20-7-38 11L440 463 388 412q-18-18-39-11-20 7-27 29-7 21 10 38z"/>`;

const NotificationsCheckSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default NotificationsCheckSolid;
