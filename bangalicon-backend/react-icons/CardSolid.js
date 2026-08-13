import * as React from "react";

const innerMarkup = `<path d="M880 400V320H80v80zM240 800q-75 0-118-42Q80 715 80 640V320q0-76 42-118Q165 160 240 160h480q75 0 117 42Q880 244 880 320v320q0 75-43 118Q795 800 720 800z"/>`;

const CardSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default CardSolid;
