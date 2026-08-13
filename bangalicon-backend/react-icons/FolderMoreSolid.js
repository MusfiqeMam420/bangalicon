import * as React from "react";

const innerMarkup = `<path d="M240 800a160 160 0 0 1-80-21A168 168 0 0 1 101 720 160 160 0 0 1 80 640V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h148q15 0 27 5t23 16L497 200H720q43 0 80 22 37 21 58 58 22 37 22 80v280q0 43-22 80A158.8 158.8 0 0 1 800 779 160 160 0 0 1 720 800z m140-320q0-25-18-42-16.96-18-42-18-25 0-43 18A57.199999999999996 57.199999999999996 0 0 0 260 480q0 25 17 43 18 17 43 17t42-17q18-18 18-43m320 0q0-25-18-42-16.96-18-42-18-25 0-43 18A57.199999999999996 57.199999999999996 0 0 0 580 480q0 25 17 43 18 17 43 17 25.04 0 42-17 18-18 18-43m-160 0q0-25-18-42-16.96-18-42-18-25 0-43 18A57.199999999999996 57.199999999999996 0 0 0 420 480q0 25 17 43 18 17 43 17t42-17q18-18 18-43"/>`;

const FolderMoreSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FolderMoreSolid;
