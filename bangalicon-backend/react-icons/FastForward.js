import * as React from "react";

const innerMarkup = `<path d="M210 706a58.4 58.4 0 0 1-41 7 58.4 58.4 0 0 1-35-21 60 60 0 0 1-14-39v-346q0-23 14-39 14-17 35-21a58.4 58.4 0 0 1 41 7l300 174q19 11 26 32 8 20 0 41a56 56 0 0 1-26 31zM200 653q0 9-11 7a42 42 0 0 1-19-11q-7-8 1-13l300-174q8-5 12 7a34 34 0 0 1 0 23q-4 10.96-12 6l-300-174q-8-5-1-13 8-8 19-11T200 307z m370 53a58.4 58.4 0 0 1-41 7 58.4 58.4 0 0 1-35-21 60 60 0 0 1-14-39v-346q0-23 14-39 14-17 35-21a58.4 58.4 0 0 1 41 7l300 174q19 11 26 32 8 20 0 41a56 56 0 0 1-26 31zM560 653q0 9-11 7a42 42 0 0 1-19-11q-7-8 1-13l300-174q8-5 12 7a34 34 0 0 1 0 23q-4 10.96-12 6l-300-174q-8-5-1-13 8-8 19-11t11 7z"/>`;

const FastForward = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FastForward;
