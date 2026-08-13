import * as React from "react";

const innerMarkup = `<path d="M480 800q-68 0-133-22a424 424 0 0 1-118-65 428 428 0 0 1-95-104q-39-60-55-129 16-69 55-129a404 404 0 0 1 95-104q54-42 118-64a396 396 0 0 1 266 0 388 388 0 0 1 118 64 404 404 0 0 1 95 104q39 60 56 129a420 420 0 0 1-56 129q-39 60-95 104-53 42-118 65Q548 800 480 800m0-160q43 0 80-21A158.8 158.8 0 0 0 618 560q22-37 22-80t-22-80A152 152 0 0 0 560 342 154 154 0 0 0 480 320q-43 0-80 22A158.8 158.8 0 0 0 341 400 160 160 0 0 0 320 480q0 43 21 80A168 168 0 0 0 400 619q37 21 80 21m0-80q-37 0-59-21Q400 517 400 480t21-58Q443 400 480 400t58 22q22 21 22 58t-22 59Q517 560 480 560"/>`;

const VisibilitySolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default VisibilitySolid;
