import * as React from "react";

const innerMarkup = `<path d="M160 240q0-43 21-80A158.8 158.8 0 0 1 240 102 154 154 0 0 1 320 80h320q43 0 80 22 37 21 58 58 22 37 22 80v586q0 17-11 30a46 46 0 0 1-26 17q-16 4-32-2L480 763l-251 108q-16 6-32 2a50.8 50.8 0 0 1-26-17A45.199999999999996 45.199999999999996 0 0 1 160 826z m440 240q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20H360q-25 0-35 20-9 20 0 40 10 20 35 20z"/>`;

const BookmarkRemoveSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default BookmarkRemoveSolid;
