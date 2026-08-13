import * as React from "react";

const innerMarkup = `<path d="M132 468q-18-18-11-38 7-21 28-28 22-7 39 10l212 211L772 252q18-18 38-11 21 7 28 29 7 21-10 38l-399 400q-13 13-29 13t-29-13z"/>`;

const Check = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Check;
