import * as React from "react";

const innerMarkup = `<path d="M394 460q-34.96 0-60-20a88 88 0 0 1-31-52q-5-32 13-63l87-150q17-31.04 47-42t60 0 48 42l87 150q18 31 12 63-6 31-31 52-25.04 20-60 20zM201 840a80.8 80.8 0 0 1-58-23A80.8 80.8 0 0 1 120 759v-158q0-34 23-57 24-24 58-24h158q34 0 57 24 24 23 24 57v158q0 34-24 58Q393 840 359 840zM680 860q-49.04 0-90-24a196 196 0 0 1-66-66q-24-40.96-24-90t24-90q25.04-42 66-66t90-24 90 24q42 24 66 66 24 40.96 24 90t-24 90-66 66q-40.96 24-90 24"/>`;

const CategorySolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default CategorySolid;
