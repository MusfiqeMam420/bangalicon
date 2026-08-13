"use client";

import { useState } from "react";
import IconModal from "./IconModal";

export default function IconCard({ icon }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="icon-card border rounded-xl p-4 bg-white hover:shadow-md transition cursor-pointer relative"
        onClick={() => setOpen(true)}
      >
        {icon.type === "premium" && (
          <span className="absolute top-2 right-2 text-xs bg-yellow-400 px-2 py-1 rounded">
            PRO
          </span>
        )}

        <div
          className="w-12 h-12 mx-auto mb-3"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />

        <p className="text-sm text-center">{icon.name}</p>
      </div>

      {open && <IconModal icon={icon} onClose={() => setOpen(false)} />}
    </>
  );
}