import * as React from "react";

const innerMarkup = `<path d="M120 440q0-76 30-144a360 360 0 0 1 84-118l508 508-12 12-134 136q-32 32-74 44a160 160 0 0 1-83 0 169.60000000000002 169.60000000000002 0 0 1-73-44l-140-139A368 368 0 0 1 148 580 356 356 0 0 1 120 440m180-308a316 316 0 0 1 85-38A324 324 0 0 1 480 80q98 0 181 48A352 352 0 0 1 792 259 356 356 0 0 1 840 440q0 49-14 95a344 344 0 0 1-38 84z m-208 16q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>`;

const LocationOffSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default LocationOffSolid;
