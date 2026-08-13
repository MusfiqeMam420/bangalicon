import * as React from "react";

const innerMarkup = `<path d="M415 540q11 16 11 18l104 204q-2 6-1 9a12 12 0 0 0 2 3q2 0 3-2l192-536q6-2 5-4 0-3-3-2L197 415q-5-3-5 0 0 2 4 0zM158 485q-29-16-38-46-8-30 5-58A80 80 0 0 1 170 340l531-185q32-10 60 3 28 12 40 41 13.040000000000001 28 3 59l-195 540q-12 32-41 45t-60 4q-30-10-45-41L382 648q-34-68-28-59 5 11 8 14z"/>`;

const NearMe = ({ size = 24, color = "currentColor", ...props }) =>
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

export default NearMe;
