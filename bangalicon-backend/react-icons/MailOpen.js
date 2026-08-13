import * as React from "react";

const innerMarkup = `<path d="M240 880a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 80 720V342q0-38 21-74 22-36 54-53L410 74q31-17 70-17 40 0 70 17l255 141q32 17 53 53 22 36 22 74V720q0 44-21 81a161.20000000000002 161.20000000000002 0 0 1-58 58A161.20000000000002 161.20000000000002 0 0 1 720 880z m480-80q25 0 43-9 18-10 27-28 10-18 10-43v-292l-250 139Q520 584 480 584q-39 0-70-17L160 428V720q0 25 9 43 10 18 28 28Q215 800 240 800z m-272-303q16 8 32 8 17 0 32-8l287-160v-4a48 48 0 0 0-6-19 52 52 0 0 0-11-16 48 48 0 0 0-15-13L512 144a80 80 0 0 0-21-7 60 60 0 0 0-22 0 80 80 0 0 0-21 7L193 285q-9 5-16 13-7 7-11 16t-5 19v4z"/>`;

const MailOpen = ({ size = 24, color = "currentColor", ...props }) =>
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

export default MailOpen;
