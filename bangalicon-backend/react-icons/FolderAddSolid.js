import * as React from "react";

const innerMarkup = `<path d="M240 800a160 160 0 0 1-80-21A168 168 0 0 1 101 720 160 160 0 0 1 80 640V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h148q15 0 27 5t23 16L497 200H720q43 0 80 22 37 21 58 58 22 37 22 80v280q0 43-22 80A158.8 158.8 0 0 1 800 779 160 160 0 0 1 720 800z m280-360V360q0-25-20-34a42.400000000000006 42.400000000000006 0 0 0-40 0q-20 9-20 34v80H360q-25 0-35 20-9 20 0 40 10 20 35 20h80v80q0 25 20 35 20 9 40 0 20-10 20-35v-80h80q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20z"/>`;

const FolderAddSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FolderAddSolid;
