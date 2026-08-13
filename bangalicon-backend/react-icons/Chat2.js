import * as React from "react";

const innerMarkup = `<path d="M217 840q-25 25.04-58 24a84 84 0 0 1-56-23Q80 818 80 783V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h480q43 0 80 22 37 21 58 58 22 37 22 80v320q0 43-22 80A158.8 158.8 0 0 1 800 739 160 160 0 0 1 720 760H297zM160 783a10.8 10.8 0 0 1-3 8 9.6 9.6 0 0 1-5 2q-2 0 1-3L252 692q6-6 13-9A36 36 0 0 1 280 680h440q33 0 56-23 24-24 24-57V280q0-33-24-56Q753 200 720 200H240q-33 0-57 24Q160 247 160 280z"/>`;

const Chat2 = ({ size = 24, color = "currentColor", ...props }) =>
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

export default Chat2;
