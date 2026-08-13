import * as React from "react";

const innerMarkup = `<path d="M147 874a46 46 0 0 1-34-3 52 52 0 0 1-24-24 46 46 0 0 1-3-34l38-154L634 150q24-24 55-32a109.2 109.2 0 0 1 62 0q31 8 55 32l4 4q24 24 32 55 9 31 0 62a118.80000000000001 118.80000000000001 0 0 1-32 55L301 836zM600 183L543 240 720 417 777 360z"/>`;

const EditSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default EditSolid;
