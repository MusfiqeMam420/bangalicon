import * as React from "react";

const innerMarkup = `<path d="M300 132a320 320 0 0 1 84-38A328 328 0 0 1 480 80q98 0 181 48A352 352 0 0 1 792 259 356 356 0 0 1 840 440q0 50-14 96a320 320 0 0 1-38 84L728 560q15-27 23-57Q760 471.96 760 440q0-79-37-143a257.6 257.6 0 0 0-100-100Q559 160 480 160q-34 0-64 8T360 192zM120 440q0-76 30-144a356 356 0 0 1 83-119L288 232q-42 38-65 92A292 292 0 0 0 200 440q0 59 21 109a272 272 0 0 0 61 88l140 141q19.04 19 39 25 20 6 40 0t39-25l134-136q3-3 6-7a12 12 0 0 1 3-2q2-2 2-4l57 57-12 12-134 136q-32 32-74 44a160 160 0 0 1-83 0 169.60000000000002 169.60000000000002 0 0 1-73-44l-140-139A368 368 0 0 1 148 580 356 356 0 0 1 120 440m-28-292q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>`;

const LocationOff = ({ size = 24, color = "currentColor", ...props }) =>
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

export default LocationOff;
