"use client";

type BangaliconControlIconName = "copy" | "check" | "add-circle" | "check-circle";

const STROKE_ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const renderControlIcon = (name: BangaliconControlIconName) => {
  switch (name) {
    case "copy":
      return (
        <svg viewBox="0 0 24 24" className="h-[1em] w-[1em]" aria-hidden="true">
          <rect x="9" y="9" width="10" height="11" rx="2.4" {...STROKE_ICON_PROPS} />
          <rect x="5" y="4" width="10" height="11" rx="2.4" {...STROKE_ICON_PROPS} />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className="h-[1em] w-[1em]" aria-hidden="true">
          <path d="m5.5 12.5 4.3 4.3 8.7-9.1" {...STROKE_ICON_PROPS} />
        </svg>
      );
    case "add-circle":
      return (
        <svg viewBox="0 0 24 24" className="h-[1em] w-[1em]" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 7.5v9M7.5 12h9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "check-circle":
      return (
        <svg viewBox="0 0 24 24" className="h-[1em] w-[1em]" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="m7.4 12.3 3.1 3.2 6.2-6.7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

export default function BangaliconControlIcon({
  name,
  className = "",
}: {
  name: BangaliconControlIconName;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center leading-none ${className}`}
    >
      {renderControlIcon(name)}
    </span>
  );
}
