import * as React from "react";

const innerMarkup = `<path d="M440 200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v360q0 25-20 35-20 9-40 0-20-10-20-35z m100 540q0 25-18 43A57.199999999999996 57.199999999999996 0 0 1 480 800q-25 0-43-17A60 60 0 0 1 420 740q0-25.04 17-42Q455 680 480 680t42 18q18 16.96 18 42"/>`;

const Warning = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Warning;
