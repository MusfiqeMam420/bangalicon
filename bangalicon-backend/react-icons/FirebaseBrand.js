import * as React from "react";

const innerMarkup = `<path d="M174.72000000000003 617.6L263.72 47.44c3.04-19.439999999999998 29.119999999999997-24 38.36-6.640000000000001l95.60000000000001 178.96z m635.28 132.4L722.4 231a20.64 20.64 0 0 0-34.8-11.200000000000001L150 750l298.8 172.32a62.400000000000006 62.400000000000006 0 0 0 59.84 0z m-243.07999999999998-452L498.40000000000003 167.60000000000002a20.36 20.36 0 0 0-36.28 0l-301.2 536.92z"/>`;

const FirebaseBrand = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FirebaseBrand;
