import * as React from "react";

const innerMarkup = `<path d="M217 840q-25 25.04-58 24a84 84 0 0 1-56-23Q80 818 80 783V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h480q43 0 80 22 37 21 58 58 22 37 22 80v320q0 43-22 80A158.8 158.8 0 0 1 800 739 160 160 0 0 1 720 760H297zM640 400q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40Q665 320 640 320H320q-25 0-35 20-9 20 0 40 10 20 35 20z m-160 160q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20H320q-25 0-35 20-9 20 0 40 10 20 35 20z"/>`;

const Chat2NoteSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Chat2NoteSolid;
