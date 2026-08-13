import * as React from "react";

const innerMarkup = `<path d="M638 760q-50 0-84-34t-34-84v-324q0-51 34-84 34-34 84-34h4q51 0 84 34 34 33 34 84v324q0 50-34 84-33 34-84 34z m-320 0q-50 0-84-34T200 642v-324q0-51 34-84Q268 200 318 200h4q51 0 84 34 34 33 34 84v324q0 50-34 84-33 34-84 34z"/>`;

const PauseSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default PauseSolid;
