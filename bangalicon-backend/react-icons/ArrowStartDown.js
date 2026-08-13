import * as React from "react";

const innerMarkup = `<path d="M200 200q-25 0-35-20a46.8 46.8 0 0 1 0-40Q175 120 200 120h560q25 0 34 20 10 20 0 40-9 20-34 20z m280 543l132-131q18-18 38-11 21 7 28 29 7 21-10 38l-159 160q-13 13-29 13t-29-13l-159-160q-18-18-11-38 7-21 28-28 22-7 39 10zM440 320q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v480h-80z"/>`;

const ArrowStartDown = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowStartDown;
