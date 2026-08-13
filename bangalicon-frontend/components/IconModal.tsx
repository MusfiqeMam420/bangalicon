"use client";

import { useState } from "react";

export default function IconModal({ icon, onClose }: any) {
  const [copied, setCopied] = useState("");

  if (!icon) return null;

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  };

  const jsxCode = icon.svg
    .replace(/class=/g, "className=")
    .replace(/stroke-width=/g, "strokeWidth=");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        {/* ICON PREVIEW */}
        <div
          className="w-20 h-20 mx-auto mb-4"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />

        <h2 className="text-center font-semibold mb-4">{icon.name}</h2>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => copy(icon.svg, "svg")}
            className="bg-gray-100 p-2 rounded"
          >
            Copy SVG {copied === "svg" && "✅"}
          </button>

          <button
            onClick={() => copy(jsxCode, "jsx")}
            className="bg-gray-100 p-2 rounded"
          >
            Copy JSX {copied === "jsx" && "✅"}
          </button>

          <button className="bg-primary text-white p-2 rounded">
            Download SVG
          </button>

          <button className="border p-2 rounded">
            + Add to Collection
          </button>
        </div>
      </div>
    </div>
  );
}