import * as React from "react";

const innerMarkup = `<path d="M226 695A368 368 0 0 1 148 580 356 356 0 0 1 120 440q0-98 48-181A364 364 0 0 1 299 128 356 356 0 0 1 480 80q98 0 181 48A352 352 0 0 1 792 259Q840 341 840 440q0 74-28 140a356 356 0 0 1-78 114l-138 140q-32 32-74 44a160 160 0 0 1-83 0 169.60000000000002 169.60000000000002 0 0 1-73-44zM560 440q0-34-23-57T480 360a80 80 0 0 0-57 23Q400 406 400 440q0 33 23 57 24 23 57 23 34 0 57-23Q560 473 560 440"/>`;

const LocationSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default LocationSolid;
