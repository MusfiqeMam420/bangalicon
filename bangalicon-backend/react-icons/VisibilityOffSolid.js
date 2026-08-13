import * as React from "react";

const innerMarkup = `<path d="M79 480Q100 390 154 323q55-68 119-106l126 126a161.20000000000002 161.20000000000002 0 0 0-58 58A154 154 0 0 0 320 480q0 43 21 80A168 168 0 0 0 400 619q37 21 80 21a154 154 0 0 0 79-21 161.20000000000002 161.20000000000002 0 0 0 58-58l135 134q-49 46-121 76A400 400 0 0 1 480 800q-68 0-133-22a424 424 0 0 1-118-65 428 428 0 0 1-95-104q-39-60-55-129M352 184Q414 160 480 160q68 0 133 23a388 388 0 0 1 118 64 404 404 0 0 1 95 104q39 60 56 129-11 42-31 82A424 424 0 0 1 804 636l-173-174a110 110 0 0 0-16-67 136 136 0 0 0-51-50 118.4 118.4 0 0 0-66-16zM400 480q0-32 16-51t46-23l92 92q-4 30-23 46T480 560q-37 0-59-21Q400 517 400 480M92 148q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>`;

const VisibilityOffSolid = ({ size = 24, color = "currentColor", ...props }) =>
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

export default VisibilityOffSolid;
