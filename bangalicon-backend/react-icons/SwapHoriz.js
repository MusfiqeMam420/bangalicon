import * as React from "react";

const innerMarkup = `<path d="M612 188q-17-17-10-38 7-22 27-29 21-7 39 11l160 159q13 13 13 29t-13 29l-160 159q-17 17-39 10a42 42 0 0 1-28-27q-7-21 11-39L743 320zM800 280v80H320q-25 0-35-20a46.8 46.8 0 0 1 0-40Q295 280 320 280zM348 772q17 17 10 39-7 21-28 28-20 7-38-11l-160-159Q119 656 119 640t13-29l160-159q17-17 38-10 22 7 29 28 7 20-11 38L217 640zM160 680v-80h480q25 0 34 20 10 20 0 40-9 20-34 20z"/>`;

const SwapHoriz = ({ size = 24, color = "currentColor", ...props }) =>
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

export default SwapHoriz;
