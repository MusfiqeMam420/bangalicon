import * as React from "react";

const innerMarkup = `<path d="M680 120q43 0 80 22 37 21 58 58 22 37 22 80v400q0 43-22 80A158.8 158.8 0 0 1 760 819 160 160 0 0 1 680 840h-40q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h40q37 0 58-21 22-22 22-59V280q0-37-22-58Q717 200 680 200h-40q-18 0-29-12a42.400000000000006 42.400000000000006 0 0 1-10-28q0-16 10-28Q622 120 640 120z m-228 228q-17-17-10-38 7-22 27-29 21-7 39 11l160 159q13 13 13 29t-13 29l-160 159q-17 17-39 10a42 42 0 0 1-28-27q-7-21 11-39l131-132zM640 440v80H160q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20z"/>`;

const ArrowInRight = ({ size = 24, color = "currentColor", ...props }) =>
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

export default ArrowInRight;
