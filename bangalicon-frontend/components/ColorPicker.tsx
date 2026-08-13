"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  color?: string;
  setColor?: (value: string) => void;
  opacity?: number;
  setOpacity?: (value: number) => void;
};

type HslState = {
  h: number;
  s: number;
  l: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hslToHex(h: number, s: number, l: number) {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness - chroma / 2;
  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function hexToHsl(hex: string): HslState {
  const safeHex = hex.replace("#", "");
  const normalized =
    safeHex.length === 3
      ? safeHex
          .split("")
          .map((char) => char + char)
          .join("")
      : safeHex.padEnd(6, "0").slice(0, 6);

  const red = parseInt(normalized.slice(0, 2), 16) / 255;
  const green = parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = 60 * (((green - blue) / delta) % 6);
        break;
      case green:
        hue = 60 * ((blue - red) / delta + 2);
        break;
      default:
        hue = 60 * ((red - green) / delta + 4);
        break;
    }
  }

  if (hue < 0) hue += 360;

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function parseColorToHsl(color: string): HslState {
  const value = color.trim().toLowerCase();

  if (value.startsWith("#")) {
    return hexToHsl(value);
  }

  const match = value.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
  if (match) {
    return {
      h: Math.round(Number(match[1])),
      s: Math.round(Number(match[2])),
      l: Math.round(Number(match[3])),
    };
  }

  return { h: 0, s: 0, l: 0 };
}

function channelToHex(value: number) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

export function getDarkerColor(color: string, amount = 0.32) {
  const value = color.trim();

  if (value.startsWith("#")) {
    const safeHex = value.replace("#", "");
    const normalized =
      safeHex.length === 3
        ? safeHex
            .split("")
            .map((char) => char + char)
            .join("")
        : safeHex.padEnd(6, "0").slice(0, 6);

    const red = parseInt(normalized.slice(0, 2), 16);
    const green = parseInt(normalized.slice(2, 4), 16);
    const blue = parseInt(normalized.slice(4, 6), 16);

    return `#${channelToHex(red * (1 - amount))}${channelToHex(green * (1 - amount))}${channelToHex(blue * (1 - amount))}`;
  }

  const { h, s, l } = parseColorToHsl(value);
  return hslToHex(h, s, clamp(l * (1 - amount), 0, 100));
}

export default function ColorPicker({
  color = "#000000",
  setColor = () => {},
  opacity = 1,
  setOpacity = () => {},
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hsl, setHsl] = useState<HslState>(() => parseColorToHsl(color));

  useEffect(() => {
    setHsl(parseColorToHsl(color));
  }, [color]);

  const hexColor = useMemo(() => hslToHex(hsl.h, hsl.s, hsl.l), [hsl]);

  const cursorX = (hsl.s / 100) * 100;
  const cursorY = 100 - (hsl.l / 50) * 100;

  const emitColor = (next: HslState) => {
    const clamped = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 100),
      l: clamp(next.l, 0, 50),
    };

    setHsl(clamped);

    if (typeof setColor === "function") {
      setColor(hslToHex(clamped.h, clamped.s, clamped.l));
    }
  };

  const handlePick = (event: MouseEvent | React.MouseEvent) => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();
    const rawX = (event as MouseEvent).clientX - rect.left;
    const rawY = (event as MouseEvent).clientY - rect.top;

    const x = clamp(rawX, 0, rect.width);
    const y = clamp(rawY, 0, rect.height);

    emitColor({
      h: hsl.h,
      s: Math.round((x / rect.width) * 100),
      l: Math.round((1 - y / rect.height) * 50),
    });
  };

  const safeOpacity = clamp(opacity, 0, 1);
  const displayOpacity = Number(safeOpacity.toFixed(2));

  return (
    <div className="w-[14.2rem] rounded-[1.9rem] bg-white px-4 py-5 shadow-[0_24px_60px_rgba(17,17,17,0.18)]">
      

      <div
        ref={boxRef}
        onMouseDown={(event) => {
          handlePick(event);

          const move = (nextEvent: MouseEvent) => handlePick(nextEvent);
          const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };

          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
        className="relative h-[9.2rem] w-full cursor-crosshair overflow-hidden rounded-xl"
        style={{
          background: `
            linear-gradient(to top, #000000 0%, transparent 100%),
            linear-gradient(to right, #ffffff 0%, hsl(${hsl.h}, 100%, 50%) 100%)
          `,
        }}
      >
        <div
          className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-transparent shadow-[0_4px_12px_rgba(0,0,0,0.16)]"
          style={{
            left: `${cursorX}%`,
            top: `${cursorY}%`,
          }}
        />
      </div>

      <div className="mt-1.5 h-px w-full bg-[#D7D7D7]" />

      <div className="relative mt-2">
        <input
          type="range"
          min="0"
          max="360"
          value={hsl.h}
          onChange={(event) =>
            emitColor({
              ...hsl,
              h: Number(event.target.value),
            })
          }
          className="h-5 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            background:
              "linear-gradient(to right, #ff1d25 0%, #fff200 17%, #00ff5a 34%, #00d2ff 51%, #0057ff 68%, #a100ff 84%, #ff1d7a 100%)",
            borderRadius: "999px",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/3  h-6 w-6 -translate-y-1/2 rounded-full border-[2px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.22)]"
          style={{
            left: `calc(${(hsl.h / 360) * 100}% - 12px)`,
            backgroundColor: `hsl(${hsl.h}, 100%, 50%)`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <p className="text-[1.05rem] font-medium lowercase tracking-[0.01em] text-[#2A2A2A]">
          {hexColor.replace("#", "")}
        </p>
        <button
          type="button"
          onClick={() => emitColor({ h: 0, s: 0, l: 0 })}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#8B8B8B] transition hover:bg-[#F3F3F3] hover:text-[#121212]"
          aria-label="Reset color"
        >
          <svg width="24" height="24" opacity="1" color="#000000" fill="#000000" stroke="#000000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M653 306a228 228 0 0 0-78-53Q532 234 480 234q-50 0-94 18a228 228 0 0 0-76 49q-33 31-54 76-10 21-32 22a42 42 0 0 1-36-16q-14-17-4-40a326.4 326.4 0 0 1 120-137 316 316 0 0 1 176-52 320 320 0 0 1 126 25 316 316 0 0 1 105 71l112 116-58 56zM120 561q0-18 11-29 12-12 30-12H320q25 0 34 20 10 20 0 40-9 20-34 20H200v120q0 25-20 35-20 9-40 0Q120 745 120 720z m360 245a328 328 0 0 1-127-25 340 340 0 0 1-104-71l-112-116 58-56 112 116A244 244 0 0 0 384 708q44 18 96 18 51 0 94-17 43-18 76-50t54-76q10-22 32-23 23-1 37 17 14 17 3 40a326.4 326.4 0 0 1-120 137 316 316 0 0 1-176 52M640 440q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h120V240q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v159q0 18-12 30-11 11-29 11z"/></svg>
        </button>
      </div>

      <div className="my-2 h-px w-full bg-[#E7E7E9]" />

      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.95rem] text-[#868686]">Opacity</span>
        <label className="flex min-w-[4.9rem] items-center justify-center rounded-[0.95rem] border border-[#DBDBDB] bg-[#FAFAFA] px-3 py-1.5 text-[1rem] font-semibold text-[#121212]">
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={displayOpacity}
            onChange={(event) => {
              const nextOpacity = Number(event.target.value);
              if (Number.isNaN(nextOpacity)) return;
              if (typeof setOpacity === "function") {
                setOpacity(clamp(nextOpacity, 0, 1));
              }
            }}
            className="w-full bg-transparent text-center outline-none"
          />
        </label>
      </div>

      <div className="mt-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={safeOpacity}
          onChange={(event) => {
            if (typeof setOpacity === "function") {
              setOpacity(clamp(Number(event.target.value), 0, 1));
            }
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E3E3E3]"
        />
      </div>
    </div>
  );
}
