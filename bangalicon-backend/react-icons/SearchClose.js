import * as React from "react";

const innerMarkup = `<path d="M440 780a340 340 0 0 1-171-45 345.6 345.6 0 0 1-124-124A340 340 0 0 1 100 440q0-92 45-170a336 336 0 0 1 124-124A334 334 0 0 1 440 100q92 0 170 46a325.6 325.6 0 0 1 124 124A328 328 0 0 1 780 440a334 334 0 0 1-46 171 336 336 0 0 1-124 124A334.4 334.4 0 0 1 440 780m0-80q74 0 133-33a240 240 0 0 0 93-93q34-60 34-134t-34-133a232 232 0 0 0-93-93Q514 180 440 180t-134 34a240 240 0 0 0-93 93Q180 366 180 440t33 134a248 248 0 0 0 93 93q60 33 134 33m163-40l57-57 168 169q17 17 10 38t-28 29q-20 7-38-11zM378 558q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27Q304 520 322 502l180-180q18-18 38-11 21 7 28 29 7 21-10 38z m-56-180q-17-17-10-38a42 42 0 0 1 27-28q21-8 39 10l180 180q17 17 10 38t-28 29q-20 7-38-11z"/>`;

const SearchClose = ({ size = 24, color = "currentColor", ...props }) =>
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

export default SearchClose;
