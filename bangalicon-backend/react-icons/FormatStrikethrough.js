import * as React from "react";

const innerMarkup = `<path d="M280 340q0-50 27-91A181.6 181.6 0 0 1 380 184Q426 160 480 160q36 0 70 11a240 240 0 0 1 63 31q30 20 54 48l4 4q13 17 4 39-8 21-29 27-20 6-36-15l-12-12a160 160 0 0 0-36-29q-18-12-39-18Q503 240 480 240q-37 0-64 13a96 96 0 0 0-41 35Q360 311 360 340q0 25-20 35-20 9-40 0Q280 365 280 340M480 800q-36 0-71-11A260 260 0 0 1 344 756a300 300 0 0 1-54-51q-17-19.04-8-39 9-20 31-25t38 13q27 33 59 50 32 16 70 16 37 0 64-12 27-13.040000000000001 41-36 15-23 15-52 0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34 0 50-27 91A192 192 0 0 1 580 776q-46 24-100 24m-280-280q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h560q25 0 34 20 10 20 0 40-9 20-34 20z"/>`;

const FormatStrikethrough = ({ size = 24, color = "currentColor", ...props }) =>
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

export default FormatStrikethrough;
