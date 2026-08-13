import * as React from "react";

const innerMarkup = `<path d="M480 880a392 392 0 0 1-181-44l-116 29q-30 8-53-1a61.6 61.6 0 0 1-33-33q-10-23-2-53l29-117A392 392 0 0 1 80 480q0-109.03999999999999 54-201A398 398 0 0 1 279 134Q371 80 480 80t201 54a388 388 0 0 1 145 145Q880 371 880 480t-54 201a398 398 0 0 1-145 145Q589 880 480 880m0-344l62 62q18 18 38 11 21-8 28-29t-10-38L536 480l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 424l-62-62Q400 344 379 352a42 42 0 0 0-27 28q-7 21 10 38L424 480l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>`;

const ChatCloseSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ChatCloseSolid;
