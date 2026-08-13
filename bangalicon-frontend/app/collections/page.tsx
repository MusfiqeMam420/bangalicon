"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { AnimatePresence, motion } from "framer-motion";

import ConfirmModal from "@/components/ConfirmModal";
import ColorPicker, { getDarkerColor } from "@/components/ColorPicker";
import IconPreviewModal from "@/components/IconPreviewModal";
import SizeDropdown from "@/components/SizeDropdown";

import { useCollections } from "@/app/lib/useCollections";

import {
  getStoredUser,
  onAuthChange,
  refreshStoredUser,
  type AuthUser,
} from "@/app/lib/auth";

import {
  getUserAvatarGradient,
  getUserAvatarHeroIcon,
} from "@/app/lib/userAvatar";
import { getPublicApiBase } from "@/app/lib/runtime";

import { useToast } from "@/components/ui/ToastProvider";

/* =========================================================
   CONSTANTS
========================================================= */

const SAVED_ICONS_COLOR_KEY = "saved-icons-color";
const SAVED_ICONS_OPACITY_KEY = "saved-icons-opacity";

const API = getPublicApiBase();

const BASE_URL = API.replace(/\/api\/?$/, "");

/* =========================================================
   STATIC GRAIN
   SAME AS ACCOUNT PAGE
========================================================= */

const STATIC_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.65'/%3E%3C/svg%3E")`;

/* =========================================================
   DEFAULT THEME
========================================================= */

const DEFAULT_GRADIENT =
  "linear-gradient(110deg, #F4D54A 0%, #F2A900 48%, #E87900 100%)";

/* =========================================================
   TYPES
========================================================= */

type IconItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  filterType: string;
  access: string;
  style: string;
  tags: string[];
  file: string;
  svg?: string;
};

type ApiIcon = {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  file?: string;
  type?: string;
  style?: string;
  category_name?: string | null;
  tags?: string[];
};

/* =========================================================
   COLLECTION PAGE
========================================================= */

export default function CollectionsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    saved,
    ready,
    toggleSave,
    replaceSaved,
    clearAll,
  } = useCollections();

  /* =======================================================
     COLLECTION STATE
  ======================================================= */

  const [collectionIcons, setCollectionIcons] =
    useState<IconItem[]>([]);

  const [loadingIcons, setLoadingIcons] =
    useState(true);

  const [selectedIcon, setSelectedIcon] =
    useState<IconItem | null>(null);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [color, setColor] =
    useState("#000000");

  const [opacity, setOpacity] =
    useState(1);

  const [size, setSize] =
    useState(48);

  const [colorOpen, setColorOpen] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  /* =======================================================
     USER
  ======================================================= */

  const [viewer, setViewer] =
    useState<AuthUser | null>(null);

  const [authReady, setAuthReady] =
    useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const colorRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     SAVED KEY
  ======================================================= */

  const savedKey = useMemo(
    () => saved.join("||"),
    [saved]
  );

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const syncViewer = async () => {
      const storedUser = getStoredUser();

      if (!mounted) return;

      setViewer(storedUser);

      if (!storedUser) {
        setAuthReady(true);
        return;
      }

      try {
        const freshUser =
          await refreshStoredUser();

        if (!mounted) return;

        setViewer(
          freshUser ?? storedUser
        );
      } catch {
        if (!mounted) return;

        setViewer(storedUser);
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    };

    void syncViewer();

    const unsubscribe =
      onAuthChange(() => {
        setAuthReady(false);
        void syncViewer();
      });

    return () => {
      mounted = false;

      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }
    };
  }, []);

  /* =======================================================
     CUSTOM AVATAR GRADIENT

     Comes directly from userAvatar.ts.
  ======================================================= */

  const bannerBackground =
    useMemo(() => {
      if (!viewer) {
        return DEFAULT_GRADIENT;
      }

      return getUserAvatarGradient(
        viewer
      );
    }, [viewer]);

  /* =======================================================
     CUSTOM HERO ICON

     Comes directly from userAvatar.ts.
  ======================================================= */

  const heroIcon =
    useMemo(() => {
      if (!viewer) return "";

      return getUserAvatarHeroIcon(
        viewer
      );
    }, [viewer]);

  /* =======================================================
     FETCH SAVED ICONS
  ======================================================= */

  useEffect(() => {
    const fetchIcons = async () => {
      if (!ready) {
        return;
      }

      if (!saved.length) {
        setCollectionIcons([]);
        setLoadingIcons(false);
        return;
      }

      setLoadingIcons(true);

      try {
        const response =
          await fetch(
            `${API}/icons`,
            {
              cache: "no-store",
            }
          );

        const data =
          response.ok
            ? await response.json()
            : [];

        const safeIcons =
          Array.isArray(data)
            ? data
            : [];

        const savedSet =
          new Set(saved);

        const nextIcons =
          safeIcons
            .map(
              (
                item: ApiIcon
              ): IconItem => ({
                id: String(
                  item.id ||
                    item._id ||
                    item.name ||
                    ""
                ),

                name: String(
                  item.name || ""
                ),

                slug: String(
                  item.slug ||
                    item.name ||
                    ""
                )
                  .toLowerCase()
                  .replace(
                    /&/g,
                    "and"
                  )
                  .replace(
                    /\s+/g,
                    "-"
                  )
                  .replace(
                    /[^a-z0-9-]/g,
                    ""
                  )
                  .replace(
                    /-+/g,
                    "-"
                  ),

                category:
                  item.category_name ||
                  "Uncategorized",

                filterType:
                  item.style ===
                  "solid"
                    ? "Solid"
                    : item.style ===
                        "brand"
                      ? "Brands"
                      : "Regular",

                access: String(
                  item.type ||
                    "free"
                ),

                style: String(
                  item.style ||
                    "regular"
                ),

                tags:
                  Array.isArray(
                    item.tags
                  )
                    ? item.tags
                    : [],

                file: String(
                  item.file || ""
                ),
              })
            )
            .filter(
              (icon) =>
                savedSet.has(
                  icon.name
                )
            );

        /* =============================================
           LOAD SVG FILES
        ============================================= */

        const hydratedIcons =
          await Promise.all(
            nextIcons.map(
              async (icon) => {
                if (!icon.file) {
                  return icon;
                }

                try {
                  const svgResponse =
                    await fetch(
                      `${BASE_URL}/uploads/${icon.file}`,
                      {
                        cache:
                          "no-store",
                      }
                    );

                  const svg =
                    svgResponse.ok
                      ? await svgResponse.text()
                      : "";

                  return {
                    ...icon,
                    svg,
                  };
                } catch {
                  return icon;
                }
              }
            )
          );

        /* =============================================
           KEEP SAVED ORDER
        ============================================= */

        const orderedIcons =
          saved
            .map((name) =>
              hydratedIcons.find(
                (icon) =>
                  icon.name ===
                  name
              )
            )
            .filter(
              (
                icon
              ): icon is IconItem =>
                Boolean(icon)
            );

        const nextSavedNames =
          orderedIcons.map(
            (icon) =>
              icon.name
          );

        if (
          nextSavedNames.join(
            "||"
          ) !== savedKey
        ) {
          replaceSaved(
            nextSavedNames
          );
        }

        setCollectionIcons(
          orderedIcons
        );
      } catch {
        setCollectionIcons([]);
      } finally {
        setLoadingIcons(false);
      }
    };

    void fetchIcons();
  }, [
    ready,
    replaceSaved,
    saved,
    savedKey,
  ]);

  /* =======================================================
     LOAD SAVED COLOR + OPACITY
  ======================================================= */

  useEffect(() => {
    const savedColor =
      window.localStorage.getItem(
        SAVED_ICONS_COLOR_KEY
      );

    const savedOpacity =
      window.localStorage.getItem(
        SAVED_ICONS_OPACITY_KEY
      );

    if (savedColor) {
      setColor(savedColor);
    }

    if (savedOpacity) {
      const nextOpacity =
        Number(savedOpacity);

      if (
        !Number.isNaN(
          nextOpacity
        )
      ) {
        setOpacity(
          nextOpacity
        );
      }
    }
  }, []);

  /* =======================================================
     SAVE COLOR
  ======================================================= */

  useEffect(() => {
    window.localStorage.setItem(
      SAVED_ICONS_COLOR_KEY,
      color
    );
  }, [color]);

  /* =======================================================
     SAVE OPACITY
  ======================================================= */

  useEffect(() => {
    window.localStorage.setItem(
      SAVED_ICONS_OPACITY_KEY,
      String(opacity)
    );
  }, [opacity]);

  /* =======================================================
     CLOSE COLOR PICKER
  ======================================================= */

  useEffect(() => {
    const handleClick = (
      event: MouseEvent
    ) => {
      if (
        colorRef.current &&
        !colorRef.current.contains(
          event.target as Node
        )
      ) {
        setColorOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  /* =======================================================
     ICON DATA
  ======================================================= */

  const hydratedIcons =
    useMemo(
      () => collectionIcons,
      [collectionIcons]
    );

  const totalIcons =
    collectionIcons.length;

  /* =======================================================
     SAVE / REMOVE ICON
  ======================================================= */

  const handleToggleSave = (
    name: string
  ) => {
    const alreadySaved =
      saved.includes(name);

    toggleSave(name);

    showToast({
      message: alreadySaved
        ? "Removed from collection"
        : "Added to collection",

      tone: "success",
    });
  };

  /* =======================================================
     OPEN ICON PREVIEW
  ======================================================= */

  const openPreview = async (
    icon: IconItem
  ) => {
    if (icon.svg) {
      setSelectedIcon(icon);
      setPreviewOpen(true);
      return;
    }

    try {
      const response =
        await fetch(
          `${BASE_URL}/uploads/${icon.file}`,
          {
            cache: "no-store",
          }
        );

      const svg =
        response.ok
          ? await response.text()
          : "";

      setSelectedIcon({
        ...icon,
        svg,
      });
    } catch {
      setSelectedIcon(icon);
    } finally {
      setPreviewOpen(true);
    }
  };

  /* =======================================================
     GENERATE CUSTOM SVG
  ======================================================= */

  const generateSvg = (
    icon: IconItem
  ) => {
    const rawSvg =
      icon.svg?.trim() ||
      `<circle cx="12" cy="12" r="8" />`;

    const normalized =
      rawSvg
        .replace(
          /width=".*?"/gi,
          ""
        )
        .replace(
          /height=".*?"/gi,
          ""
        )
        .replace(
          /style=".*?"/gi,
          ""
        )
        .replace(
          /opacity=".*?"/gi,
          ""
        )
        .replace(
          /currentColor/gi,
          color
        )
        .replace(
          /stroke=".*?"/gi,
          `stroke="${color}"`
        )
        .replace(
          /fill="(?!none).*?"/gi,
          `fill="${color}"`
        );

    if (
      rawSvg.includes(
        "<svg"
      )
    ) {
      return normalized.replace(
        "<svg",
        `<svg width="${size}" height="${size}" fill="${color}" color="${color}" opacity="${opacity}" style="color:${color};fill:${color};stroke:${color};opacity:${opacity}"`
      );
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" color="${color}" opacity="${opacity}" style="color:${color};fill:${color};stroke:${color};opacity:${opacity}">${normalized}</svg>`;
  };

  /* =======================================================
     DOWNLOAD ZIP
  ======================================================= */

  const handleDownload =
    async () => {
      if (!viewer) {
        router.push(
          "/login?returnTo=%2Fcollections"
        );

        return;
      }

      setDownloading(true);

      try {
        const zip =
          new JSZip();

        hydratedIcons.forEach(
          (icon) => {
            zip.file(
              `${icon.name}.svg`,
              generateSvg(icon)
            );
          }
        );

        const blob =
          await zip.generateAsync(
            {
              type: "blob",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "bangalicon-collection.zip";

        link.click();

        URL.revokeObjectURL(
          url
        );

        showToast({
          message:
            "Collection downloaded",

          tone: "success",
        });
      } finally {
        setDownloading(false);
      }
    };

  /* =======================================================
     HERO BACKGROUND
  ======================================================= */

  const heroBackground =
    authReady && !viewer
      ? DEFAULT_GRADIENT
      : bannerBackground;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <main className="min-h-screen bg-[#F5F6F7]">
        {/* =================================================
            HERO
            SAME AS ACCOUNT PAGE
        ================================================= */}

        <section
          className="relative h-[120px] sm:h-[185px] w-full overflow-hidden"
          style={{
            background:
              heroBackground,
          }}
        >
          {/* ===============================================
              STATIC GRAIN
          =============================================== */}

          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
            style={{
              backgroundImage:
                STATIC_NOISE,

              backgroundRepeat:
                "repeat",

              backgroundSize:
                "180px 180px",
            }}
          />

          {/* ===============================================
              SOFT LIGHT
          =============================================== */}

          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "radial-gradient(circle at 18% 15%, rgba(255,255,255,0.14), transparent 34%)",
            }}
          />

          {/* ===============================================
              CUSTOM HERO ICON
          =============================================== */}

          {viewer &&
            heroIcon && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.82,
                  y: "-50%",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: "-50%",
                }}
                transition={{
                  duration: 0.4,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="
                  absolute
                  right-[8%]
                  top-1/2
                  z-[3]
                  sm:right-[10%]
                "
              >
                <img
                  src={heroIcon}
                  alt=""
                  draggable={
                    false
                  }
                  className="
                    h-[0px]
                    w-[0px]
                    object-contain
                    sm:h-[60px]
                    sm:w-[60px]
                  "
                />
              </motion.div>
            )}
        </section>

        {/* =================================================
            COLLECTION CARD
        ================================================= */}

        <div className="relative z-20 mx-auto -mt-[58px] w-full max-w-[940px] px-4 pb-24 sm:px-5">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.32,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              rounded-[28px]
              bg-white
              px-5
              pb-7
              pt-6
              shadow-[0_5px_20px_rgba(0,0,0,0.035)]
              sm:px-7
            "
          >
            {/* =============================================
                TOP HEADER
            ============================================= */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* TITLE */}

              <div className="max-w-[470px]">
                <h1 className="text-[23px] font-semibold tracking-[-0.035em] text-[#111111]">
                  Saved icons
                </h1>

                <p className="mt-[5px] text-[11px] leading-[1.45] text-[#777C84]">
                  Keep your selected icons in one place,
                  preview them, customize the color and
                  size, and download the whole collection
                  when you are ready.
                </p>
              </div>

              {/* CONTROLS */}

              <div className="flex flex-wrap items-center gap-[8px]">
                {/* SIZE */}

                <SizeDropdown
                  size={size}
                  setSize={setSize}
                />

                {/* COLOR */}

                <div
                  ref={colorRef}
                  className="relative z-40 mt-1"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setColorOpen(
                        (prev) =>
                          !prev
                      )
                    }
                    className="h-[28px] w-[28px] cursor-pointer rounded-full border shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                    style={{
                      backgroundColor:
                        color,

                      borderColor:
                        getDarkerColor(
                          color
                        ),
                    }}
                    aria-label="Open color picker"
                  />

                  <AnimatePresence>
                    {colorOpen ? (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.92,
                          y: -8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.96,
                          y: -6,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                          mass: 0.85,
                        }}
                        className="absolute right-0 top-[48px] z-50"
                      >
                        <ColorPicker
                          color={
                            color
                          }
                          setColor={
                            setColor
                          }
                          opacity={
                            opacity
                          }
                          setOpacity={
                            setOpacity
                          }
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* CLEAR */}

                <button
                  type="button"
                  onClick={() =>
                    setConfirmOpen(
                      true
                    )
                  }
                  disabled={
                    !totalIcons
                  }
                  className="
                    inline-flex
                    h-[36px]
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[6px]
                    rounded-full
                    bg-[#C9151B]
                    px-[17px]
                    text-[12px]
                    font-medium
                    text-white
                    transition
                    hover:bg-[#A80B10]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span
                    aria-hidden="true"
                    className="bg bg-delete text-[13px] leading-none text-white"
                  />

                  Clear all
                </button>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={
                    handleDownload
                  }
                  disabled={
                    !totalIcons ||
                    downloading
                  }
                  className="
                    inline-flex
                    h-[36px]
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[6px]
                    rounded-full
                    bg-[#111111]
                    px-[18px]
                    text-[12px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#C9151B]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span
                    aria-hidden="true"
                    className="bg bg-arrow-end-down text-[13px] leading-none text-white"
                  />

                  {downloading
                    ? "Preparing..."
                    : "Download"}
                </button>
              </div>
            </div>

            {/* =============================================
                MY COLLECTION
            ============================================= */}

            <div className="mt-[8px] overflow-hidden rounded-[20px] bg-white">
              {/* HEADER */}

              <div className="flex h-[52px] items-center justify-between border-b border-[#E8EAED] px-[18px]">
                <p className="text-[15px] font-semibold text-[#111111]">
                  My collection
                </p>

                <span className="rounded-full bg-[#F5F6F7] px-[9px] py-[4px] text-[10px] font-semibold text-[#89909A]">
                  {totalIcons}{" "}
                  {totalIcons === 1
                    ? "icon"
                    : "icons"}
                </span>
              </div>

              {/* ===========================================
                  CONTENT
              =========================================== */}

              <div className="min-h-[220px] p-[18px]">
                {!ready ||
                loadingIcons ? (
                  /* =============================
                     LOADING
                  ============================= */

                  <div className="flex min-h-[185px] items-center justify-center">
                    <p className="text-[12px] text-[#92969C]">
                      Loading saved icons...
                    </p>
                  </div>
                ) : !hydratedIcons.length ? (
                  /* =============================
                     EMPTY
                  ============================= */

                  <div className="flex min-h-[185px] flex-col items-center justify-center text-center">
                    <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#111111]">
                      No icons saved
                    </h2>

                    <p className="mt-2 max-w-[360px] text-[12px] leading-5 text-[#858A92]">
                      Save icons from the home page and
                      they will appear here automatically.
                    </p>

                    <Link
                      href="/"
                      className="mt-5 inline-flex h-[34px] items-center justify-center rounded-full bg-[#111111] px-5 text-[11px] font-semibold text-white transition hover:bg-[#C9151B]"
                    >
                      Browse icons
                    </Link>
                  </div>
                ) : (
                  /* =============================
                     ICON GRID
                  ============================= */

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {hydratedIcons.map(
                      (icon) => (
                        <motion.button
                          key={
                            icon.id
                          }
                          type="button"
                          layout
                          initial={{
                            opacity: 0,
                            scale: 0.94,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          onClick={() =>
                            openPreview(
                              icon
                            )
                          }
                          className="
                            group
                            relative
                            min-w-0
                            cursor-pointer
                            rounded-[17px]
                            border
                            border-[#E7E9ED]
                            bg-[#F8F9FA]
                            p-[10px]
                            text-left
                            transition
                            hover:border-[#D8DCE2]
                            hover:bg-[#F5F6F7]
                          "
                        >
                          {/* REMOVE */}

                          <span
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              handleToggleSave(
                                icon.name
                              );
                            }}
                            className="
                              absolute
                              right-[7px]
                              top-[7px]
                              z-10
                              flex
                              h-[19px]
                              w-[19px]
                              cursor-pointer
                              items-center
                              justify-center
                              rounded-full
                              bg-[#E8EAED]
                              text-[11px]
                              font-medium
                              leading-none
                              text-[#B4B8BE]
                              transition
                              hover:bg-[#111111]
                              hover:text-white
                            "
                            aria-label="Remove icon"
                          >
                            ✕
                          </span>

                          {/* ICON */}

                          <div
                            className="flex h-[88px] items-center justify-center overflow-hidden rounded-[13px] bg-white [&_svg]:block"
                            dangerouslySetInnerHTML={{
                              __html:
                                generateSvg(
                                  icon
                                ),
                            }}
                          />

                          {/* NAME */}

                          <p className="mt-[9px] truncate px-[2px] text-[11px] font-semibold text-[#111111]">
                            {icon.name}
                          </p>

                          {/* CATEGORY */}

                          <p className="mt-[2px] truncate px-[2px] pb-[2px] text-[9px] text-[#92979F]">
                            {
                              icon.category
                            }
                          </p>
                        </motion.button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ===================================================
          ICON PREVIEW
      =================================================== */}

      <IconPreviewModal
        open={previewOpen}
        onClose={() =>
          setPreviewOpen(false)
        }
        icon={selectedIcon}
        onTagClick={(tag) =>
          router.push(
            `/?search=${encodeURIComponent(
              tag
            )}`
          )
        }
        onCategoryClick={(
          category
        ) =>
          router.push(
            `/?category=${encodeURIComponent(
              category
            )}`
          )
        }
        saved={saved}
        toggleSave={
          handleToggleSave
        }
      />

      {/* ===================================================
          CLEAR CONFIRMATION
      =================================================== */}

      <ConfirmModal
        open={confirmOpen}
        onClose={() =>
          setConfirmOpen(false)
        }
        onConfirm={() => {
          clearAll();

          setConfirmOpen(
            false
          );

          showToast({
            message:
              "Collection cleared",

            tone: "success",
          });
        }}
        title="Delete all icons?"
        description="This will permanently remove all saved icons from your collection."
      />
    </>
  );
}
