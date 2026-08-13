import * as React from "react";

const innerMarkup = `<path d="M480.6 236.72L255.32 383.40000000000003l225.27999999999997 146.72-225.27999999999997 146.76-225.32-148 225.32-146.68L30 236.72 255.32 90zM254.08 723.3199999999999l225.32-146.72 225.32 146.72-225.32 146.68z m226.52-194.4l225.32-146.72-225.32-145.48 224.08-146.72 225.32 146.72-225.27999999999997 146.68 225.27999999999997 146.72-225.27999999999997 146.76z"/>`;

const DropboxBrand = ({ size = 24, color = "currentColor", ...props }) =>
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

export default DropboxBrand;
