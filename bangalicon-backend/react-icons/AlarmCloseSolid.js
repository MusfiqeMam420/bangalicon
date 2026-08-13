import * as React from "react";

const innerMarkup = `<path d="M480 840q-98 0-181-48A352 352 0 0 1 168 661 356 356 0 0 1 120 480q0-98 48-181A352 352 0 0 1 299 168 356 356 0 0 1 480 120q98 0 181 48A352 352 0 0 1 792 299 356 356 0 0 1 840 480a356 356 0 0 1-48 181 352 352 0 0 1-131 131A356 356 0 0 1 480 840M148 228q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27Q74 190 92 172l80-80q18-18 38-11 21 7 28 29 7 21-10 38z m584-80q-18-18-11-38 7-21 28-28 22-7 39 10l80 80q17 17 10 38t-28 29q-20 7-38-11zM480 536l62 62q18 18 38 11 21-8 28-29t-10-38L536 480l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 424l-62-62Q400 344 379 352a42 42 0 0 0-27 28q-7 21 10 38L424 480l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>`;

const AlarmCloseSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default AlarmCloseSolid;
