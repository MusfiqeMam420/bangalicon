import * as React from "react";

const innerMarkup = `<path d="M480 880a392 392 0 0 1-181-44l-116 29q-30 8-53-1a61.6 61.6 0 0 1-33-33q-10-23-2-53l29-117A392 392 0 0 1 80 480q0-109.03999999999999 54-201A398 398 0 0 1 279 134Q371 80 480 80t201 54a388 388 0 0 1 145 145Q880 371 880 480t-54 201a398 398 0 0 1-145 145Q589 880 480 880m-308-83q-2 9-10 1t0-10l136-33a20 20 0 0 1 11-1 32 32 0 0 1 13 5q37 20 76 31 39 10 82 10 90 0 163-42a308 308 0 0 0 115-115Q800 570 800 480t-42-163a308 308 0 0 0-115-115Q570 160 480 160T317 202A308 308 0 0 0 202 317Q160 390 160 480q0 43 10 82 11 39 31 76 8 12 4 24z m160-289q-17-17-10-38 7-22 27-29 21-7 39 11l52 51L572 372q18-18 38-11 21 7 28 29 7 21-10 38l-159 160q-13 13-29 13-16-1-29-14z"/>`;

const ChatCheck = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ChatCheck;
