import * as React from "react";

const innerMarkup = `<path d="M240 800q-75 0-118-42Q80 715 80 640v-61q0-23 13-38 14-16 37-22 11-3 17-7a28 28 0 0 0 10-12Q160 492 160 480t-3-19a22.400000000000002 22.400000000000002 0 0 0-10-12A56 56 0 0 0 130 440q-23-5-37-20Q80 404 80 381V320q0-76 42-118Q165 160 240 160h480q75 0 117 42Q880 244 880 320v320q0 75-43 118Q795 800 720 800z m-80-160q0 46 17 63T240 720h480q46 0 63-17T800 640V320q0-46-17-63T720 240H240q-46 0-63 17T160 320v61q0-3-3-7a21.6 21.6 0 0 0-6-7q-2-3-2-4 39 11 65 43T240 480t-26 74a120 120 0 0 1-65 42l2-2q3-3 6-7a16 16 0 0 0 3-8z m212-132q-17-17-10-38 7-22 27-29 21-7 39 11l52 51L612 372q18-18 38-11 21 7 28 29 7 21-10 38l-159 160q-13 13-29 13-16-1-29-14z"/>`;

const CouponCheck = ({ size = 24, color = "currentColor", ...props }) =>
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

export default CouponCheck;
