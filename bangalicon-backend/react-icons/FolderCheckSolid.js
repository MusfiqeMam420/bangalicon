import * as React from "react";

const innerMarkup = `<path d="M240 800a160 160 0 0 1-80-21A168 168 0 0 1 101 720 160 160 0 0 1 80 640V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h148q15 0 27 5t23 16L497 200H720q43 0 80 22 37 21 58 58 22 37 22 80v280q0 43-22 80A158.8 158.8 0 0 1 800 779 160 160 0 0 1 720 800z m171-213q13 13 29 14 16 0 29-13l159-160q17-17 10-38-7-22-28-29-20-7-38 11L440 503 388 452q-18-18-39-11-20 7-27 29-7 21 10 38z"/>`;

const FolderCheckSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FolderCheckSolid;
