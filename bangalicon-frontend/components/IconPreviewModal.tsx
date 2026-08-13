"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";
import BangaliconControlIcon from "@/components/BangaliconControlIcon";
import SizeDropdown from "@/components/SizeDropdown";
import ColorPicker, { getDarkerColor } from "@/components/ColorPicker";
import { getStoredUser, onAuthChange, type AuthUser } from "@/app/lib/auth";
import { SHOW_PRICING } from "@/app/lib/features";
import { getPublicApiBase } from "@/app/lib/runtime";

type IconType = {
  id?: string;
  name?: string;
  slug?: string;
  category?: string;
  file?: string;
  svg?: string;
  access?: string;
  style?: string;
  tags?: string[];
};

function CodeWord({
  children,
  tone = "white",
}: {
  children: React.ReactNode;
  tone?: "white" | "blue" | "red" | "green" | "gray";
}) {
  const tones = {
    white: "text-white",
    blue: "text-[#7bc6ff]",
    red: "text-[#ff8d82]",
    green: "text-[#a7df77]",
    gray: "text-[#b9c0ca]",
  };

  return <span className={tones[tone]}>{children}</span>;
}

export default function IconPreviewModal({
  open,
  onClose,
  icon,
  onTagClick,
  onCategoryClick,
  saved,
  toggleSave,
}: {
  open: boolean;
  onClose: () => void;
  icon?: IconType | null;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
  saved: string[];
  toggleSave: (name: string) => void;
}) {
  const apiBase = getPublicApiBase();
  const cdnBase = apiBase.replace(/\/api\/?$/, "");
  const freeCssLink = `${cdnBase}/cdn/free/bangalicon-free.css`;
  const [size, setSize] = useState(64);
  const [color, setColor] = useState<string>("#000000");
  const [opacity, setOpacity] = useState(1);
  const frameworkTabs = [
    { label: "Font", value: "font" },
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ] as const;

  type FrameworkTab = (typeof frameworkTabs)[number]["value"];

  const [tab, setTab] = useState<FrameworkTab>("font");
  const [showFrameworkCode, setShowFrameworkCode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPlacement, setPickerPlacement] = useState<"top" | "bottom">("top");
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<"svg" | "png" | "webp">("svg");
  const [copied, setCopied] = useState(false);
  const [usageCopied, setUsageCopied] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const [viewer, setViewer] = useState<AuthUser | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const pickerButtonRef = useRef<HTMLButtonElement | null>(null);
  const pickerPanelRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const isSaved = icon && saved.includes(icon.name || "");

  useEffect(() => {
    const savedType = document.cookie
      .split("; ")
      .find((row) => row.startsWith("downloadType="))
      ?.split("=")[1] as "svg" | "png" | "webp" | undefined;

    if (savedType) setDownloadType(savedType);
  }, []);

  useEffect(() => {
    const syncViewer = () => {
      setViewer(getStoredUser());
    };

    syncViewer();
    return onAuthChange(syncViewer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedPickerButton = pickerButtonRef.current?.contains(target);
      const clickedPickerPanel = pickerPanelRef.current?.contains(target);

      if (!clickedPickerButton && !clickedPickerPanel) {
        setPickerOpen(false);
      }
      if ((e.target as HTMLElement).closest("[data-download-root]") === null) {
        setDownloadOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!pickerOpen || !pickerButtonRef.current || !modalRef.current) return;

    const updatePickerPosition = () => {
      const buttonRect = pickerButtonRef.current?.getBoundingClientRect();
      const modalRect = modalRef.current?.getBoundingClientRect();
      if (!buttonRect || !modalRect) return;

      const pickerHeight = 340;
      const pickerWidth = 228;
      const gap = 14;
      const spaceAbove = buttonRect.top - modalRect.top;
      const spaceBelow = modalRect.bottom - buttonRect.bottom;
      const nextPlacement: "top" | "bottom" =
        spaceAbove >= pickerHeight + gap
          ? "top"
          : spaceBelow >= pickerHeight + gap
            ? "bottom"
            : spaceAbove > spaceBelow
              ? "top"
              : "bottom";

      setPickerPlacement(nextPlacement);

      const rawLeft = buttonRect.left - modalRect.left;
      const maxLeft = Math.max(12, modalRect.width - pickerWidth - 12);
      const left = Math.min(Math.max(rawLeft, 12), maxLeft);
      const top =
        nextPlacement === "top"
          ? buttonRect.top - modalRect.top - pickerHeight - gap
          : buttonRect.bottom - modalRect.top + gap;

      setPickerPosition({
        left,
        top: Math.max(12, top),
      });
    };

    updatePickerPosition();
    window.addEventListener("resize", updatePickerPosition);
    window.addEventListener("scroll", updatePickerPosition, true);

    return () => {
      window.removeEventListener("resize", updatePickerPosition);
      window.removeEventListener("scroll", updatePickerPosition, true);
    };
  }, [pickerOpen]);

  if (!icon) return null;

  const normalizedSlug = String(icon.slug || icon.name || "icon")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
  const reactComponentName = normalizedSlug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("") || "BangaliconIcon";

  const isPremium = icon.access === "premium";
  const canUsePremium = !isPremium || viewer?.plan === "premium";
  const canSaveIcon = !isPremium || viewer?.plan === "premium";
  const classPrefix = isPremium
    ? icon.style === "solid"
      ? "bgps"
      : icon.style === "brand"
        ? "bgpl"
        : "bgp"
    : icon.style === "solid"
      ? "bgs"
      : icon.style === "brand"
        ? "bgl"
        : "bg";
  const iconFontClass = `${classPrefix} ${classPrefix}-${normalizedSlug}`;
  const defaultCodeSize = 64;
  const defaultCodeColor = "#000000";
  const defaultCodeOpacity = 1;
  const hasCustomSize = size !== defaultCodeSize;
  const hasCustomColor = color.toLowerCase() !== defaultCodeColor;
  const hasCustomOpacity = Math.abs(opacity - defaultCodeOpacity) > 0.001;

  const rawSvg = icon.svg?.trim() || `<circle cx="12" cy="12" r="8" />`;
  const formattedOpacity = Number(opacity.toFixed(2));
  const normalized = rawSvg
    .replace(/width=".*?"/gi, "")
    .replace(/height=".*?"/gi, "")
    .replace(/style=".*?"/gi, "")
    .replace(/opacity=".*?"/gi, "")
    .replace(/currentColor/gi, color)
    .replace(/stroke=".*?"/gi, `stroke="${color}"`)
    .replace(/fill="(?!none).*?"/gi, `fill="${color}"`);

  const svgString = rawSvg.includes("<svg")
    ? normalized
        .replace(
          /<svg\b/i,
          `<svg width="${size}" height="${size}" opacity="${formattedOpacity}" color="${color}" fill="${color}" stroke="${color}" style="opacity:${formattedOpacity}; color:${color};"`
        )
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" color="${color}" fill="${color}" stroke="${color}" opacity="${formattedOpacity}" style="opacity:${formattedOpacity}; color:${color};">${normalized}</svg>`;

  const copySVG = async () => {
    if (!canUsePremium) return;
    await navigator.clipboard.writeText(svgString);
    showToast({ message: "SVG copied to clipboard", tone: "success" });
  };

  const copyName = async () => {
    const iconName = icon.name || "icon";
    await navigator.clipboard.writeText(iconName);
    showToast({ message: "Icon name copied", tone: "success" });
  };

  const saveDownloadType = (type: "svg" | "png" | "webp") => {
    document.cookie = `downloadType=${type}; path=/; max-age=31536000`;
    setDownloadType(type);
  };

  const handleDownload = async () => {
    if (!canUsePremium) return;
    const fileName = icon.name || "icon";

    if (downloadType === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();

    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement("canvas");
      canvas.width = size * scale;
      canvas.height = size * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mime = downloadType === "png" ? "image/png" : "image/webp";
      const dataUrl = canvas.toDataURL(mime, 1.0);

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName}.${downloadType}`;
      a.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const fontStyleParts = [
    hasCustomColor ? `color: ${color};` : null,
    hasCustomOpacity ? `opacity: ${formattedOpacity};` : null,
  ].filter(Boolean);

  const fontStyleAttribute = fontStyleParts.length > 0 ? ` style="${fontStyleParts.join(" ")}"` : "";
  const reactPropParts = [
    hasCustomSize ? `size={${size}}` : null,
    hasCustomColor ? `color="${color}"` : null,
    hasCustomOpacity ? `style={{ opacity: ${formattedOpacity} }}` : null,
  ].filter(Boolean);
  const reactProps = reactPropParts.length > 0 ? ` ${reactPropParts.join(" ")}` : "";

  const vuePropParts = [
    hasCustomSize ? `:size="${size}"` : null,
    hasCustomColor ? `color="${color}"` : null,
    hasCustomOpacity ? `:style="{ opacity: ${formattedOpacity} }"` : null,
  ].filter(Boolean);
  const vueProps = vuePropParts.length > 0 ? ` ${vuePropParts.join(" ")}` : "";

  const sveltePropParts = [
    hasCustomSize ? `size={${size}}` : null,
    hasCustomColor ? `color="${color}"` : null,
    hasCustomOpacity ? `style="opacity: ${formattedOpacity};"` : null,
  ].filter(Boolean);
  const svelteProps = sveltePropParts.length > 0 ? ` ${sveltePropParts.join(" ")}` : "";
  const renderCodeProp = (
    label: string,
    value: React.ReactNode,
    tone: "white" | "blue" | "red" | "green" | "gray" = "red"
  ) => (
    <>
      <CodeWord>{label}</CodeWord>
      <CodeWord tone={tone}>{value}</CodeWord>
    </>
  );

  const codeMap = {
    font: {
      preview: `<i class="${iconFontClass}"${fontStyleAttribute}></i>`,
      full: `<i class="${iconFontClass}"${fontStyleAttribute}></i>`,
    },
    react: {
      preview: `<${reactComponentName}${reactProps} />`,
      full: `import { ${reactComponentName} } from "@bangalicon/react";

export default function Example() {
  return <${reactComponentName}${reactProps} />;
}`,
    },
    vue: {
      preview: `<${reactComponentName}${vueProps} />`,
      full: `<script setup>
import { ${reactComponentName} } from "@bangalicon/vue";
</script>

<template>
  <${reactComponentName}${vueProps} />
</template>`,
    },
    svelte: {
      preview: `<${reactComponentName}${svelteProps} />`,
      full: `<script>
  import { ${reactComponentName} } from "@bangalicon/svelte";
</script>

<${reactComponentName}${svelteProps} />`,
    },
  } satisfies Record<FrameworkTab, { preview: string; full: string }>;

  const codePreviewMap = {
    font: {
      preview: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">i</CodeWord>
          <CodeWord> class=</CodeWord>
          <CodeWord tone="red">{`"${iconFontClass}"`}</CodeWord>
          <CodeWord> style=</CodeWord>
          <CodeWord tone="red">{`"color: ${color}; opacity: ${formattedOpacity};"`}</CodeWord>
          <CodeWord>{"></"}</CodeWord>
          <CodeWord tone="blue">i</CodeWord>
          <CodeWord>{">"}</CodeWord>
        </>
      ),
      full: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">i</CodeWord>
          <CodeWord> class=</CodeWord>
          <CodeWord tone="red">{`"${iconFontClass}"`}</CodeWord>
          <CodeWord> style=</CodeWord>
          <CodeWord tone="red">{`"color: ${color}; opacity: ${formattedOpacity};"`}</CodeWord>
          <CodeWord>{"></"}</CodeWord>
          <CodeWord tone="blue">i</CodeWord>
          <CodeWord>{">"}</CodeWord>
        </>
      ),
    },
    react: {
      preview: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` size={`, size) : null}
          {hasCustomSize ? <CodeWord>{`}`}</CodeWord> : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` style={{ opacity: `, formattedOpacity) : null}
          {hasCustomOpacity ? <CodeWord>{` }}`}</CodeWord> : null}
          <CodeWord>{` />`}</CodeWord>
        </>
      ),
      full: (
        <>
          <CodeWord tone="blue">import</CodeWord>
          <CodeWord> {"{ "}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          <CodeWord>{" } "}</CodeWord>
          <CodeWord tone="blue">from</CodeWord>
          <CodeWord> </CodeWord>
          <CodeWord tone="red">{`"@bangalicon/react"`}</CodeWord>
          {";"}
          {"\n\n"}
          <CodeWord tone="blue">export default function</CodeWord>
          <CodeWord> Example() {"{"}</CodeWord>
          {"\n  "}
          <CodeWord tone="blue">return</CodeWord>
          <CodeWord> {"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` size={`, size) : null}
          {hasCustomSize ? <CodeWord>{`}`}</CodeWord> : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` style={{ opacity: `, formattedOpacity) : null}
          {hasCustomOpacity ? <CodeWord>{` }}`}</CodeWord> : null}
          <CodeWord>{` />;`}</CodeWord>
          {"\n"}
          <CodeWord>{"}"}</CodeWord>
        </>
      ),
    },
    vue: {
      preview: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` :size=`, `"${size}"`) : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` :style="{ opacity: `, formattedOpacity) : null}
          {hasCustomOpacity ? <CodeWord>{` }"`}</CodeWord> : null}
          <CodeWord>{` />`}</CodeWord>
        </>
      ),
      full: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">script setup</CodeWord>
          <CodeWord>{">"}</CodeWord>
          {"\n"}
          <CodeWord tone="blue">import</CodeWord>
          <CodeWord> {"{ "}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          <CodeWord>{" } "}</CodeWord>
          <CodeWord tone="blue">from</CodeWord>
          <CodeWord> </CodeWord>
          <CodeWord tone="red">{`"@bangalicon/vue"`}</CodeWord>
          {";"}
          {"\n"}
          <CodeWord>{"</"}</CodeWord>
          <CodeWord tone="blue">script</CodeWord>
          <CodeWord>{">"}</CodeWord>
          {"\n\n"}
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">template</CodeWord>
          <CodeWord>{">"}</CodeWord>
          {"\n  "}
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` :size=`, `"${size}"`) : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` :style="{ opacity: `, formattedOpacity) : null}
          {hasCustomOpacity ? <CodeWord>{` }"`}</CodeWord> : null}
          <CodeWord>{` />`}</CodeWord>
          {"\n"}
          <CodeWord>{"</"}</CodeWord>
          <CodeWord tone="blue">template</CodeWord>
          <CodeWord>{">"}</CodeWord>
        </>
      ),
    },
    svelte: {
      preview: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` size={`, size) : null}
          {hasCustomSize ? <CodeWord>{`}`}</CodeWord> : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` style=`, `"opacity: ${formattedOpacity};"`) : null}
          <CodeWord>{` />`}</CodeWord>
        </>
      ),
      full: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">script</CodeWord>
          <CodeWord>{">"}</CodeWord>
          {"\n  "}
          <CodeWord tone="blue">import</CodeWord>
          <CodeWord> {"{ "}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          <CodeWord>{" } "}</CodeWord>
          <CodeWord tone="blue">from</CodeWord>
          <CodeWord> </CodeWord>
          <CodeWord tone="red">{`"@bangalicon/svelte"`}</CodeWord>
          {";"}
          {"\n"}
          <CodeWord>{"</"}</CodeWord>
          <CodeWord tone="blue">script</CodeWord>
          <CodeWord>{">"}</CodeWord>
          {"\n\n"}
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="white">{reactComponentName}</CodeWord>
          {hasCustomSize ? renderCodeProp(` size={`, size) : null}
          {hasCustomSize ? <CodeWord>{`}`}</CodeWord> : null}
          {hasCustomColor ? renderCodeProp(` color=`, `"${color}"`) : null}
          {hasCustomOpacity ? renderCodeProp(` style=`, `"opacity: ${formattedOpacity};"`) : null}
          <CodeWord>{` />`}</CodeWord>
        </>
      ),
    },
  } satisfies Record<FrameworkTab, { preview: React.ReactNode; full: React.ReactNode }>;

  const copyCode = async () => {
    if (!canUsePremium) return;
    await navigator.clipboard.writeText(showFrameworkCode ? codeMap[tab].full : codeMap[tab].preview);
    setCopied(true);
    const activeLabel = frameworkTabs.find((item) => item.value === tab)?.label || "Code";
    showToast({ message: `${activeLabel} copied`, tone: "success" });
    setTimeout(() => setCopied(false), 1500);
  };

  const activeFrameworkLabel = frameworkTabs.find((item) => item.value === tab)?.label || "Font";
  const usageConfig = {
    font: {
      iconSrc: "/auth-login-icon.webp",
      iconAlt: "Bangalicon",
      title: "Font CDN",
      subtitle: "Use Bangalicon on the web",
      chip: "Install",
      code: `<link rel="stylesheet" href="${freeCssLink}">`,
      richCode: (
        <>
          <CodeWord>{"<"}</CodeWord>
          <CodeWord tone="blue">link</CodeWord>
          <CodeWord> rel=</CodeWord>
          <CodeWord tone="red">{`"stylesheet"`}</CodeWord>
          <CodeWord> href=</CodeWord>
          <CodeWord tone="red">{`"${freeCssLink}"`}</CodeWord>
          <CodeWord>{">"}</CodeWord>
        </>
      ),
    },
    react: {
      iconSrc: "/hero/react-icon.webp",
      iconAlt: "React",
      title: "React Package",
      subtitle: "Installation",
      chip: "Install",
      code: "npm install @bangalicon/react",
      richCode: (
        <>
          <CodeWord tone="blue">npm</CodeWord>
          <CodeWord> install </CodeWord>
          <CodeWord tone="red">@bangalicon/react</CodeWord>
        </>
      ),
    },
    vue: {
      iconSrc: "/hero/vue-icon.png",
      iconAlt: "Vue",
      title: "Vue Package",
      subtitle: "Installation",
      chip: "Install",
      code: "npm install @bangalicon/vue",
      richCode: (
        <>
          <CodeWord tone="blue">npm</CodeWord>
          <CodeWord> install </CodeWord>
          <CodeWord tone="red">@bangalicon/vue</CodeWord>
        </>
      ),
    },
    svelte: {
      iconSrc: "/hero/svelte-icon.webp",
      iconAlt: "Svelte",
      title: "Svelte Package",
      subtitle: "Installation",
      chip: "Install",
      code: "npm install @bangalicon/svelte",
      richCode: (
        <>
          <CodeWord tone="blue">npm</CodeWord>
          <CodeWord> install </CodeWord>
          <CodeWord tone="red">@bangalicon/svelte</CodeWord>
        </>
      ),
    },
  } satisfies Record<
    FrameworkTab,
    {
      iconSrc: string;
      iconAlt: string;
      title: string;
      subtitle: string;
      chip: string;
      code: string;
      richCode: React.ReactNode;
    }
  >;
  const activeUsage = usageConfig[tab];

  const copyUsageCode = async () => {
    await navigator.clipboard.writeText(activeUsage.code);
    setUsageCopied(true);
    showToast({ message: `${activeFrameworkLabel} usage copied`, tone: "success" });
    setTimeout(() => setUsageCopied(false), 1500);
  };

  const handleCategoryClick = () => {
    if (!icon.category) return;
    onCategoryClick?.(icon.category);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[70] px-4 pointer-events-none"
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto relative isolate w-full max-w-[680px] rounded-[28px] bg-white shadow-2xl"
            >
              <div className="max-h-[calc(100vh-32px)] overflow-y-auto p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-row">
                <div
                  className="flex h-[180px] w-full items-center justify-center rounded-xl border border-[#E6E6E6] sm:h-[220px] md:h-40 md:w-[220px] md:min-w-[220px]"
                  style={{
                    backgroundColor: "#f5f6f8",
                    backgroundImage:
                      "linear-gradient(#ffffff 0.6px, transparent 0.6px), linear-gradient(to right, #ffffff 0.6px, #f5f6f8 0.6px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "center",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: svgString }} />
                </div>

                <div className="relative w-full min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={handleCategoryClick}
                    className="block text-sm text-gray-500 transition hover:text-black cursor-pointer"
                  >
                    {icon.category}
                  </button>
                  <button
                    type="button"
                    onClick={copyName}
                    className="group mb-4 mt-0.5 flex w-fit items-center gap-2 rounded-xl text-left cursor-pointer"
                    aria-label={`Copy ${icon.name || "icon"} name`}
                  >
                    <h2 className="text-xl font-semibold text-black">{icon.name}</h2>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#8D8D92] opacity-0 transition duration-150 group-hover:opacity-100 group-hover:bg-[#F3F4F6] group-hover:text-[#111111]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 9.75C9 8.50736 10.0074 7.5 11.25 7.5H18C19.2426 7.5 20.25 8.50736 20.25 9.75V16.5C20.25 17.7426 19.2426 18.75 18 18.75H11.25C10.0074 18.75 9 17.7426 9 16.5V9.75Z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M15 7.5V6.75C15 5.50736 13.9926 4.5 12.75 4.5H6C4.75736 4.5 3.75 5.50736 3.75 6.75V13.5C3.75 14.7426 4.75736 15.75 6 15.75H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      if (!canSaveIcon) return;
                      if (icon.name) toggleSave(icon.name);
                    }}
                    className={`absolute right-0 top-0 flex items-center justify-center gap-1 rounded-full px-1 py-1 text-sm transition sm:right-0 sm:top-0 ${
                      canSaveIcon ? "cursor-pointer" : "cursor-not-allowed text-[#9C9CA1]"
                    } ${
                      isSaved
                        ? ""
                        : canSaveIcon
                          ? "hover:scale-115"
                          : ""
                    }`}
                    aria-label={!canSaveIcon ? "Premium icon" : isSaved ? "Saved icon" : "Save icon"}
                  >
                    {!canSaveIcon ? (
                      "Premium"
                    ) : isSaved ? (
                      <BangaliconControlIcon
                        name="check-circle"
                        className="text-[28px] text-[#D1151B]"
                      />
                    ) : (
                      <BangaliconControlIcon
                        name="add-circle"
                        className="text-[28px] text-[#111111]"
                      />
                    )}
                  </button>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {icon.tags?.map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagClick?.(tag);
                        }}
                        className="text-xs text-[#696c6e] bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="h-[1px] w-full bg-[#E7E7E9] mb-3"></div>

                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          ref={pickerButtonRef}
                          onClick={() => setPickerOpen((v) => !v)}
                          className="h-7 w-7 cursor-pointer rounded-full border-2 shadow"
                          style={{
                            background: color,
                            borderColor: getDarkerColor(color),
                          }}
                        />
                        <SizeDropdown size={size} setSize={setSize} />
                      </div>
                      <div className="hidden h-7 w-[1px] bg-gray-200 md:block" />
                    </div>

                    <div className="flex min-w-0 flex-wrap gap-2 md:flex-nowrap md:justify-end" data-download-root>
                      {canUsePremium ? (
                        <>
                          <button
                            onClick={copySVG}
                            aria-label="Copy SVG"
                            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-[#F2F2F2] px-4 py-2 text-sm font-semibold text-[#5a5959] transition hover:bg-[#e6e6e6] cursor-pointer"
                          >
                            <BangaliconControlIcon
                              name="copy"
                              className="text-[16px] text-[#5a5959]"
                            />
                            <span>SVG</span>
                          </button>

                          <div className="relative min-w-0 flex-1 md:flex-none">
                            <div className="flex w-full items-center justify-center rounded-full bg-black cursor-pointer md:w-auto">
                              <button
                                onClick={handleDownload}
                                className="min-w-0 flex-1 truncate pl-3 text-sm text-white cursor-pointer md:flex-none"
                              >
                                Download {downloadType.toUpperCase()}
                              </button>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDownloadOpen((v) => !v);
                                }}
                                className="mt-1 cursor-pointer py-3 pl-2 pr-2"
                              >
                                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.53403 0.216001C9.73403 0.0160013 9.94516 -0.0451124 10.1674 0.0326676C10.4007 0.110448 10.5562 0.271554 10.634 0.516001C10.7118 0.749334 10.6562 0.960448 10.4674 1.14933L5.80069 5.83267C5.65623 5.97713 5.5007 6.04933 5.33403 6.04933C5.17849 6.04933 5.0229 5.97713 4.86736 5.83267L0.200695 1.14933C0.0118084 0.960448 -0.0437516 0.749334 0.0340284 0.516001C0.111808 0.282668 0.261808 0.127115 0.484028 0.0493346C0.717362 -0.0395521 0.934028 0.0160013 1.13403 0.216001L5.33403 4.39933L9.53403 0.216001Z" fill="#fff" />
                                </svg>
                              </span>
                            </div>

                            <AnimatePresence>
                              {downloadOpen && (
                                <motion.div
                                  className="absolute right-0 z-50 mt-2 rounded-xl bg-white p-2 shadow-lg"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                >
                                  {(["svg", "png", "webp"] as const).map((type) => (
                                    <button
                                      key={type}
                                      onClick={() => {
                                        saveDownloadType(type);
                                        setDownloadOpen(false);
                                      }}
                                      className={`block px-4 py-2 text-sm w-full text-left rounded-lg cursor-pointer ${
                                        downloadType === type ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
                                      }`}
                                    >
                                      {type.toUpperCase()}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      ) : SHOW_PRICING ? (
                        <Link
                          href="/pricing"
                          className="inline-flex items-center justify-center rounded-full bg-[#C9151B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
                        >
                          Buy Premium
                        </Link>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-[#ECEEF2] px-5 py-3 text-sm font-semibold text-[#6F6F6F]">
                          Premium Hidden
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                {canUsePremium ? (
                  <>
                    <div className="mb-1 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                        {frameworkTabs.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => {
                              setTab(t.value);
                              setShowFrameworkCode(false);
                            }}
                            className={`relative shrink-0 snap-start overflow-hidden rounded-full px-3 py-1 text-sm transition cursor-pointer ${
                              tab === t.value ? "text-white" : "bg-gray-100 hover:bg-gray-200 text-[#727171]"
                            }`}
                          >
                            {tab === t.value ? (
                              <motion.span
                                layoutId="active-framework-pill"
                                className="absolute inset-0 rounded-full bg-black"
                                transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
                              />
                            ) : null}
                            <span className="relative z-10">{t.label}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setUsageOpen(true)}
                        className="self-end pb-0.5 text-[15px] font-medium text-[#D1151B] transition hover:text-[#111111] cursor-pointer md:shrink-0"
                      >
                        Usage
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {tab !== "font" ? (
                        <motion.div
                          key={tab}
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="mb-0 overflow-hidden px-2"
                        >
                          <button
                            type="button"
                            onClick={() => setShowFrameworkCode((value) => !value)}
                            className="text-[12px] font-medium text-[#D1151B] transition hover:text-[#111111] cursor-pointer"
                          >
                            {showFrameworkCode ? `Hide ${activeFrameworkLabel} Code` : `See ${activeFrameworkLabel} Code`}
                          </button>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="mt-2 flex flex-col gap-3 overflow-hidden rounded-[14px] bg-[#191e28] px-4 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.08)] md:flex-row md:justify-between md:gap-4 md:px-5">
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.pre
                            key={`${tab}-${showFrameworkCode ? "full" : "preview"}`}
                            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[14px] leading-7 text-white"
                          >
                            <code>{showFrameworkCode ? codePreviewMap[tab].full : codePreviewMap[tab].preview}</code>
                          </motion.pre>
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={copyCode}
                        aria-label="Copy code"
                        className="relative h-8 w-8 shrink-0 self-end rounded-full text-[15px] font-medium text-white/95 transition hover:bg-white/6 hover:text-white cursor-pointer md:self-start"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <BangaliconControlIcon
                                name="check"
                                className="text-[18px] text-white"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <BangaliconControlIcon
                                name="copy"
                                className="text-[18px] text-white"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#E7E7E9] bg-[#F7F8FA] p-5">
                    <p className="text-sm font-semibold text-[#121212]">Premium icon</p>
                    <p className="mt-2 text-sm leading-7 text-[#6F6F6F]">
                      Upgrade to premium to unlock code snippets, copy actions, and downloads for this icon.
                    </p>
                    {SHOW_PRICING ? (
                      <Link
                        href="/pricing"
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#C9151B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
                      >
                        View Pricing
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>
              </div>
              <AnimatePresence>
                {pickerOpen ? (
                  <motion.div
                    ref={pickerPanelRef}
                    className={`absolute z-[95] ${
                      pickerPlacement === "top" ? "origin-bottom-left" : "origin-top-left"
                    }`}
                    style={{
                      left: pickerPosition.left,
                      top: pickerPosition.top,
                    }}
                    initial={{ opacity: 0, scale: 0.92, y: pickerPlacement === "top" ? 8 : -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: pickerPlacement === "top" ? 6 : -6 }}
                    transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.85 }}
                  >
                    <ColorPicker
                      color={color}
                      setColor={setColor}
                      opacity={opacity}
                      setOpacity={setOpacity}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <AnimatePresence>
                {usageOpen ? (
                  <>
                    <motion.div
                      className="fixed inset-0 z-[90] bg-black/22 backdrop-blur-[12px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setUsageOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 12 }}
                      transition={{
                        opacity: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                        y: { type: "spring", stiffness: 280, damping: 24, mass: 0.9 },
                        scale: { type: "spring", stiffness: 260, damping: 22, mass: 0.88 },
                      }}
                      className={`fixed left-1/2 top-1/2 z-[100] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white p-5 shadow-[0_24px_60px_rgba(17,17,17,0.18)] ${
                        tab === "font" ? "max-w-[430px]" : "max-w-[380px]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-1">
                          <div className="relative h-11 w-11 overflow-hidden rounded-2xl  ">
                            <NextImage
                              src={activeUsage.iconSrc}
                              alt={activeUsage.iconAlt}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold leading-4 text-[#141414]">{activeUsage.title}</p>
                            <p className="mt-1 text-[13px] leading-4 text-[#5F6572]">{activeUsage.subtitle}</p>
                          </div>
                        </div>

                        <span className="inline-flex rounded-full border border-[#E4E6EC] bg-[#F7F8FB] px-3 py-1 text-[11px] font-medium text-[#5D6572]">
                          {activeUsage.chip}
                        </span>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-[14px] bg-[#191e28] px-5 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
                        <div className={`flex gap-3 ${tab === "font" ? "items-start" : "items-center justify-between"}`}>
                          <code
                            className={`min-w-0 flex-1 font-mono text-[13px] text-white ${
                              tab === "font"
                                ? "whitespace-pre-wrap break-words leading-7"
                                : "whitespace-pre-wrap break-words leading-7"
                            }`}
                          >
                            {activeUsage.richCode}
                          </code>
                          <button
                            type="button"
                            onClick={copyUsageCode}
                            aria-label="Copy usage code"
                            className={`relative h-8 w-8  cursor-pointer shrink-0 self-start rounded-full text-white/95 transition hover:bg-white/6 hover:text-white ${
                              tab === "font" ? "mt-0.5 self-start" : ""
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {usageCopied ? (
                                <motion.div
                                  key="usage-check"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <BangaliconControlIcon
                                    name="check"
                                    className="text-[18px] text-white"
                                  />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="usage-copy"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <BangaliconControlIcon
                                    name="copy"
                                    className="text-[18px] text-white"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
