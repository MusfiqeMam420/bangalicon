import * as React from "react";

const innerMarkup = `<path d="M240 800q-75 0-118-42Q80 715 80 640v-61q0-23 13-38 14-16 37-22 11-3 17-7a28 28 0 0 0 10-12Q160 492 160 480t-3-19a22.400000000000002 22.400000000000002 0 0 0-10-12A56 56 0 0 0 130 440q-23-5-37-20Q80 404 80 381V320q0-76 42-118Q165 160 240 160h480q75 0 117 42Q880 244 880 320v320q0 75-43 118Q795 800 720 800z m211-213q13 13 29 14 16 0 29-13l159-160q17-17 10-38-7-22-28-29-20-7-38 11L480 503 428 452q-18-18-39-11-20 7-27 29-7 21 10 38z"/>`;

const CouponCheckSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default CouponCheckSolid;
