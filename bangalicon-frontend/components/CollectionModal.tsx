"use client";

import { useEffect, useState, useRef } from "react";
import JSZip from "jszip";
import { motion, AnimatePresence } from "framer-motion";
import ColorPicker, { getDarkerColor } from "@/components/ColorPicker";
import ConfirmModal from "@/components/ConfirmModal";
import SizeDropdown from "@/components/SizeDropdown";
import { getStoredUser, onAuthChange, type AuthUser } from "@/app/lib/auth";

const SAVED_ICONS_COLOR_KEY = "saved-icons-color";
const SAVED_ICONS_OPACITY_KEY = "saved-icons-opacity";
const DELETE_BUTTON_ICON =
  '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M240 280v440q0 37 21 59Q283 800 320 800h320q38 0 59-21Q720 757 720 720V280z m560 440q0 44-21 81a161.20000000000002 161.20000000000002 0 0 1-58 58A161.20000000000002 161.20000000000002 0 0 1 640 880H320a161.20000000000002 161.20000000000002 0 0 1-81-21 172 172 0 0 1-58-58A161.20000000000002 161.20000000000002 0 0 1 160 720V200h640zM120 280q-25 0-35-20a46.8 46.8 0 0 1 0-40Q95 200 120 200h80v80z m720-80q25 0 34 20 10 20 0 40-9 20-34 20h-80V200z m-240-120q25 0 34 20 10 20 0 40-9 20-34 20H360q-25 0-35-20a46.8 46.8 0 0 1 0-40Q335 80 360 80z"/></svg>';
const DOWNLOAD_BUTTON_ICON =
  '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M760 760q25 0 34 20 10 20 0 40-9 20-34 20H200q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20z m-280-177l132-131q18-18 38-11 21 7 28 29 7 21-10 38l-159 160q-13 13-29 13t-29-13l-159-160q-18-18-11-38 7-21 28-28 22-7 39 10zM440 160q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v480h-80z"/></svg>';

type Props = {
  open: boolean;
  onClose: () => void;
  icons: Array<{ name: string; svg?: string }>;
  loading: boolean;
  clearAll: () => void;
  toggleSave: (name: string) => void;
};

export default function CollectionModal({ open, onClose, icons, loading, clearAll, toggleSave }: Props) {
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(1);
  const [colorOpen, setColorOpen] = useState(false);
  const [size, setSize] = useState(48);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewer, setViewer] = useState<AuthUser | null>(null);

  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const syncViewer = () => {
      setViewer(getStoredUser());
    };

    syncViewer();
    return onAuthChange(syncViewer);
  }, []);

  useEffect(() => {
    const savedColor = window.localStorage.getItem(SAVED_ICONS_COLOR_KEY);
    const savedOpacity = window.localStorage.getItem(SAVED_ICONS_OPACITY_KEY);
    if (savedColor) {
      setColor(savedColor);
    }
    if (savedOpacity) {
      const nextOpacity = Number(savedOpacity);
      if (!Number.isNaN(nextOpacity)) {
        setOpacity(nextOpacity);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_ICONS_COLOR_KEY, color);
  }, [color]);

  useEffect(() => {
    window.localStorage.setItem(SAVED_ICONS_OPACITY_KEY, String(opacity));
  }, [opacity]);

  const generateSVG = (icon: { svg?: string }) => {
    const rawSvg = icon.svg?.trim() || `<circle cx="12" cy="12" r="8" />`;
    const normalized = rawSvg
        .replace(/width=".*?"/gi, "")
        .replace(/height=".*?"/gi, "")
        .replace(/style=".*?"/gi, "")
        .replace(/opacity=".*?"/gi, "")
        .replace(/currentColor/gi, color)
        .replace(/stroke=".*?"/gi, `stroke="${color}"`)
        .replace(/fill="(?!none).*?"/gi, `fill="${color}"`);

    if (rawSvg.includes("<svg")) {
      return normalized.replace(
        "<svg",
        `<svg width="${size}" height="${size}" fill="${color}" color="${color}" opacity="${opacity}" style="color:${color};fill:${color};stroke:${color};opacity:${opacity}"`
      );
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" color="${color}" opacity="${opacity}" style="color:${color};fill:${color};stroke:${color};opacity:${opacity}">${normalized}</svg>`;
  };

  const downloadSVGZip = async () => {
    const zip = new JSZip();
    icons.forEach((icon) => {
      zip.file(`${icon.name}.svg`, generateSVG(icon));
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "icons-svg.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadClick = async () => {
    if (!viewer) {
      window.location.href = "/login?returnTo=%2F%3FopenCollection%3D1";
      return;
    }

    await downloadSVGZip();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative bg-white rounded-3xl w-[700px] max-w-[90%] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 mr-1">
                <h2 className="text-xl font-semibold text-[#121212]">Saved Icons</h2>

                <div className="flex items-center gap-4">
                  <SizeDropdown size={size} setSize={setSize} />

                  <div ref={colorRef} className="relative">
                    <div
                      onClick={() => setColorOpen(!colorOpen)}
                      className="w-6 h-6 rounded-full border cursor-pointer"
                      style={{
                        background: color,
                        borderColor: getDarkerColor(color),
                      }}
                    />

                    <AnimatePresence>
                      {colorOpen && (
                        <motion.div
                          className="absolute right-0 mt-3 z-50 origin-top-right"
                          initial={{ opacity: 0, scale: 0.92, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: -6 }}
                          transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.85 }}
                        >
                          <ColorPicker color={color} setColor={setColor} opacity={opacity} setOpacity={setOpacity} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="border-t mb-4 border-[#E7E7E9]" />

              <div className="mb-6">
                {loading ? (
                  <div className="flex h-60 items-center justify-center text-center">
                    <p className="text-sm text-gray-400">Loading saved icons...</p>
                  </div>
                ) : icons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-15 ">Empty</div>
                    <h3 className="text-lg font-medium text-gray-700">No icons saved</h3>
                    <p className="text-sm text-gray-400">Save icons to build your collection</p>
                  </div>
                ) : (
                  <div className="flex min-h-60 gap-4 flex-wrap content-start">
                    <AnimatePresence>
                      {icons.map((icon) => (
                        <motion.div
                          key={icon.name}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          className="relative group"
                        >
                          <div
                            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#F5F6F8] [&_svg]:block"
                            dangerouslySetInnerHTML={{ __html: generateSVG(icon) }}
                          />

                          <button
                            onClick={() => toggleSave(icon.name)}
                            className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-[#F0151C] cursor-pointer text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            x
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t pt-4 border-[#E7E7E9]">
                <p className="text-sm text-gray-500">{icons.length} icons</p>

                <div className="flex gap-2">
                  <button
                    disabled={icons.length === 0 || loading}
                    onClick={() => setConfirmOpen(true)}
                    className={`inline-flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full text-white ${
                      icons.length === 0 || loading
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-[#C9151B] hover:bg-[#A80B10]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: DELETE_BUTTON_ICON }}
                    />
                    Delete
                  </button>

                  <button
                    disabled={icons.length === 0 || loading}
                    onClick={handleDownloadClick}
                    title={!viewer ? "Login to download your saved icons" : "Download saved icons"}
                    className={`inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-white rounded-4xl font-semibold transition ${
                      icons.length === 0 || loading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed "
                        : "bg-[#111111] hover:bg-[#C9151B] transition"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: DOWNLOAD_BUTTON_ICON }}
                    />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          clearAll();
          onClose();
        }}
        title="Delete all icons?"
        description="This will permanently remove all saved icons."
      />
    </>
  );
}
