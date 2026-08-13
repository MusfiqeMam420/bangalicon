import * as React from "react";

const innerMarkup = `<path d="M480 80C259 80 80 259 80 480s179 400 400 400 400-179 400-400S701 80 480 80M207 358a36 36 0 0 1 24-43 756 756 0 0 1 268-21c90 9 177 34 257 75 18 8 24 29 15 45-5 12-18 20-31 20a28 28 0 0 1-15-4A672 672 0 0 0 492 363c-82-8-163-1-242 19a35.08 35.08 0 0 1-43-24m23 128a33.6 33.6 0 0 1 24-43 604 604 0 0 1 232-21c78 8 153 30 222 67 18 8 24 29 15 46-6 12-18 19-31 19-5 0-10-2-16-4-62-32-127-52-198-59a536 536 0 0 0-206 19c-18 4-37-6-42-24m23 128c-6-18 5-38 23-44 63-20 130-27 197-20s130 27 189 59c16 10 22 31 13 48a34 34 0 0 1-30 17c-6 0-12-1-17-4a420 420 0 0 0-162-51c-57-5-115 0-169 18a36 36 0 0 1-44-23"/>`;

const SpotifyBrand = ({ size = 24, color = "currentColor", ...props }) =>
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

export default SpotifyBrand;
