import * as React from "react";

const innerMarkup = `<path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m-40-360q0 25 20 35 20 9 40 0 20-10 20-35 0-9 3-16 4-7 11-14t18-16l6-5q30-23 46-48T620 360q0-32-19-59a124 124 0 0 0-50-44A148 148 0 0 0 480 240q-39 0-71 17a132 132 0 0 0-51 44Q340 328 340 360q0 25 20 35 20 9 40 0 20-10 20-35 0-20 14-30Q449 320 480 320q31.04 0 45 10 15 10 15 30 0 15-7 24-6 8-25 23l-3 3q-21 17-35 32-13 14-22 34-8 19-8 44m100 140q0-25.04-18-42Q505.03999999999996 600 480 600q-25 0-43 18-17 18-17 42 0 25 17 43Q455 720 480 720t42-18q18-18 18-42"/>`;

const QuestionCircleSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default QuestionCircleSolid;
