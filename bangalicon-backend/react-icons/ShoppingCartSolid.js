import * as React from "react";

const innerMarkup = `<path d="M320 680a160 160 0 0 1-80-21A168 168 0 0 1 181 600 160 160 0 0 1 160 520V182q0-21-7-35a36.800000000000004 36.800000000000004 0 0 0-20-20Q119 120 98 120H80q-25 0-35-20a46.8 46.8 0 0 1 0-40Q55 40 80 40h18q54 0 93 33 39 32 47 83V160H696q49 0 88 27a154.8 154.8 0 0 1 59 70q19 44 10 92l-36 200q-9 56-54 94-44 37-103 37z m-40 200a80 80 0 0 1-57-23A80 80 0 0 1 200 800q0-34 23-57A80 80 0 0 1 280 720q34 0 57 23Q360 765.96 360 800a80 80 0 0 1-23 57Q314.04 880 280 880m400 0a80 80 0 0 1-57-23A80 80 0 0 1 600 800q0-34 23-57A80 80 0 0 1 680 720q34 0 57 23Q760 765.96 760 800a80 80 0 0 1-23 57Q714.04 880 680 880"/>`;

const ShoppingCartSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ShoppingCartSolid;
