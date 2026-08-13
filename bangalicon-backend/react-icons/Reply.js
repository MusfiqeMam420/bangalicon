import * as React from "react";

const innerMarkup = `<path d="M680 400q43 0 80 22 37 21 58 58 22 37 22 80v160q0 25-20 35-20 9-40 0-20-10-20-35v-160q0-37-22-58Q717 480 680 480H160v-80zM332 212q18-18 38-11 21 7 28 29 7 21-10 38L217 440 388 612q18 18 11 39-7 20-29 27-21 7-38-10l-200-199Q119 456 119 440t13-29z"/>`;

const Reply = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Reply;
