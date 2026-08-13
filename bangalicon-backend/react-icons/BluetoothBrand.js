import * as React from "react";

const innerMarkup = `<path d="M537 799q-19.04 19-42 20-22 0-39-16-16-17-16-44v-182L348 668q-18 18-39 11a42 42 0 0 1-27-28q-7-22 10-39l131-132L292 348q-18-18-11-38 7-21 28-28 22-7 39 10L440 383v-182q0-27 16-43 17-17 39-17 23 0 42 19L668 291q13 13 13 29t-13 28L537 480l131 131q13 13 13 29t-13 28zM583 640L520 577v126z m0-320L520 257v126z"/>`;

const BluetoothBrand = ({ size = 24, color = "currentColor", ...props }) =>
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

export default BluetoothBrand;
