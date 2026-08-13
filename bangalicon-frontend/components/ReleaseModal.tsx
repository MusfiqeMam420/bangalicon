"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicApiBase } from "@/app/lib/runtime";

type ReleaseType = "add" | "fix" | "update";

type ReleaseEntry = {
  type: ReleaseType;
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  previewItems?: Array<{
    label: string;
    imageUrl?: string;
  }>;
};

type ReleaseVersion = {
  id?: string;
  version: string;
  monthLabel: string;
  entries: ReleaseEntry[];
};

const fallbackNotes: ReleaseVersion[] = [
  {
    version: "3.1.0",
    monthLabel: "August 2026",
    entries: [
      {
        type: "add",
        title: "Added couch",
        description: "Added 1 icon to the library.",
        tags: ["couch"],
      },
      {
        type: "fix",
        title: "Premium collection lock",
        description: "Free users can no longer add premium icons into group selection.",
        tags: ["premium"],
      },
      {
        type: "update",
        title: "Login popup download flow",
        description: "Guest downloads now open a login popup and continue after sign in.",
        tags: ["download", "login"],
      },
    ],
  },
];

const typeStyles: Record<
  ReleaseType,
  {
    label: string;
    textClass: string;
    badgeClass: string;
    icon: ReactNode;
  }
> = {
  add: {
    label: "ADD",
    textClass: "text-[#23385D]",
    badgeClass: "bg-[#EEF8F1] text-[#15A34A]",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  fix: {
    label: "FIX",
    textClass: "text-[#23385D]",
    badgeClass: "bg-[#FFF1EE] text-[#F05A32]",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 1.75L9.75 4V8L6 10.25L2.25 8V4L6 1.75Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  update: {
    label: "UPDATE",
    textClass: "text-[#23385D]",
    badgeClass: "bg-[#EEF4FF] text-[#3972F6]",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9.5V2.5M6 2.5L3.5 5M6 2.5L8.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

const getImageName = (entry: ReleaseEntry) => {
  if (entry.previewItems?.[0]?.label) {
    return entry.previewItems[0].label;
  }

  if (entry.imageUrl) {
    const fileName = entry.imageUrl.split("/").pop() || "";
    return fileName.replace(/\.[a-z0-9]+$/i, "");
  }

  return entry.title.replace(/^Added\s+/i, "").trim();
};

const formatEntryDescription = (entry: ReleaseEntry) => {
  if (entry.type !== "add" || !entry.tags?.length) {
    return entry.description;
  }

  const match = entry.description.match(/Added\s+(\d+)\s+icons?/i);
  if (match) {
    return `Added ${match[1]} icons:`;
  }

  return entry.description;
};

const normalizeReleaseText = (value: string) =>
  String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const areReleaseTextsEquivalent = (first: string, second: string) => {
  const normalizedFirst = normalizeReleaseText(first);
  const normalizedSecond = normalizeReleaseText(second);

  if (!normalizedFirst || !normalizedSecond) {
    return normalizedFirst === normalizedSecond;
  }

  return (
    normalizedFirst === normalizedSecond ||
    normalizedFirst.startsWith(normalizedSecond) ||
    normalizedSecond.startsWith(normalizedFirst)
  );
};

const stripStatusSuffix = (value: string) =>
  normalizeReleaseText(value)
    .replace(/\b(issue|bug|problem|glitch|error|fix|fixed|resolved|resolution|patch)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const shouldHideReleaseDescription = ({
  type,
  title,
  headline,
  description,
  hasTags,
}: {
  type: ReleaseType;
  title: string;
  headline: string;
  description: string;
  hasTags: boolean;
}) => {
  if (hasTags && type === "add") {
    return false;
  }

  if (areReleaseTextsEquivalent(description, headline)) {
    return true;
  }

  const normalizedHeadline = stripStatusSuffix(headline);
  const normalizedTitle = stripStatusSuffix(title);
  const normalizedDescription = stripStatusSuffix(description);

  if (!normalizedDescription) {
    return true;
  }

  return (
    normalizedDescription === normalizedHeadline ||
    normalizedDescription === normalizedTitle ||
    normalizedDescription.startsWith(normalizedHeadline) ||
    normalizedHeadline.startsWith(normalizedDescription) ||
    normalizedDescription.startsWith(normalizedTitle) ||
    normalizedTitle.startsWith(normalizedDescription)
  );
};

export default function ReleaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);
  const [notes, setNotes] = useState<ReleaseVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleEntryCount, setVisibleEntryCount] = useState(8);
  const [activePreviewKey, setActivePreviewKey] = useState<string | null>(null);

  const totalEntryCount = useMemo(
    () => notes.reduce((sum, version) => sum + version.entries.length, 0),
    [notes],
  );
  const hasMoreEntries = visibleEntryCount < totalEntryCount;

  const visibleNotes = useMemo(() => {
    let remaining = visibleEntryCount;

    return notes.reduce<ReleaseVersion[]>((result, version) => {
      if (remaining <= 0) {
        return result;
      }

      const visibleEntries = version.entries.slice(0, remaining);
      remaining -= visibleEntries.length;

      if (visibleEntries.length > 0) {
        result.push({
          ...version,
          entries: visibleEntries,
        });
      }

      return result;
    }, []);
  }, [notes, visibleEntryCount]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        activePreviewKey &&
        previewRef.current &&
        !previewRef.current.contains(e.target as Node)
      ) {
        setActivePreviewKey(null);
      }

      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose, activePreviewKey]);

  useEffect(() => {
    if (!open) return;

    setVisibleEntryCount(8);
    setActivePreviewKey(null);

    const fetchNotes = async () => {
      setIsLoading(true);

      try {
        const api = getPublicApiBase();
        const response = await fetch(`${api}/releases`, { cache: "no-store" });
        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
          setNotes(data);
          setIsLoading(false);
          return;
        }

        setNotes(fallbackNotes);
      } catch (error) {
        console.error(error);
        setNotes(fallbackNotes);
      } finally {
        setIsLoading(false);
      }
    };

    setNotes([]);
    void fetchNotes();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const node = scrollRef.current;
    if (!node) {
      return;
    }

    const handleScroll = () => {
      if (!hasMoreEntries || isLoading) {
        return;
      }

      const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
      if (distanceFromBottom < 180) {
        setVisibleEntryCount((current) =>
          Math.min(current + 8, totalEntryCount),
        );
      }

      setActivePreviewKey(null);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [open, hasMoreEntries, isLoading, totalEntryCount]);

  const jumpToTag = (tag: string) => {
    onClose();
    router.push(`/icons?search=${encodeURIComponent(tag)}`);
  };

  const togglePreview = (previewKey: string) => {
    setActivePreviewKey((current) => (current === previewKey ? null : previewKey));
  };

  const getTagItems = (entry: ReleaseEntry) => {
    if (entry.previewItems?.length) {
      return entry.previewItems.map((item) => ({
        label: item.label,
        imageUrl: item.imageUrl || "",
      }));
    }

    return (entry.tags || []).map((tag) => ({
      label: tag,
      imageUrl: entry.imageUrl || "",
    }));
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[640px] overflow-hidden rounded-[2rem] border border-[rgba(220,228,241,0.9)] bg-white shadow-[0_28px_90px_rgba(17,17,17,0.16)]"
            >
              <div className="flex items-center justify-between mt-5 px-8 py-1.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[1.02rem] font-semibold leading-none text-[#23385D]">Release Note</h2>
                  </div>
                </div>
                {/* <button
                  onClick={onClose}
                  className="rounded-full p-1 text-[#A9B4C7] transition hover:bg-[#F5F7FB] hover:text-[#23385D]"
                  aria-label="Close release notes"
                >
                  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button> */}
              </div>

              <div
                ref={scrollRef}
                className="max-h-[72vh] overflow-y-auto px-8 py-2 [scrollbar-color:#9BA3AF_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9BA3AF] [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {isLoading ? (
                  <div className="flex min-h-[220px] items-center justify-center">
                    <div className="rounded-full border border-[#E9EEF4] bg-[#F5F7FB] px-4 py-2 text-[13px] font-medium text-[#8A97AD]">
                      Loading release notes...
                    </div>
                  </div>
                ) : (
                <div className="space-y-9">
                  {visibleNotes.map((version, versionIndex) => (
                    <section key={`${version.version}-${versionIndex}`}>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="rounded-full bg-[#ca1016] px-3 py-1 text-[0.74rem] font-semibold text-white">
                          v{version.version}
                        </span>
                        <span className="text-[0.80rem] font-medium text-[#A9B4C7]">{version.monthLabel}</span>
                      </div>

                      <div className="space-y-6">
                        {version.entries.map((entry, index) => {
                          const style = typeStyles[entry.type];
                          const imageName = getImageName(entry);
                          const description = formatEntryDescription(entry);
                          const tagItems = getTagItems(entry);
                          const headline =
                            entry.type === "add" && tagItems.length
                              ? description
                              : entry.title || entry.description;
                          const showDescription = !shouldHideReleaseDescription({
                            type: entry.type,
                            title: entry.title || "",
                            headline,
                            description,
                            hasTags: tagItems.length > 0,
                          });

                          return (
                            <article key={`${version.version}-${entry.title}-${index}`} className="relative">
                              <div className="mb-2 flex items-center gap-2.5">
                                <span
                                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${style.badgeClass}`}
                                >
                                  {style.icon}
                                </span>
                                <span className={`text-[0.82rem] font-bold tracking-tight ${style.textClass}`}>
                                  {style.label}
                                </span>
                              </div>

                              <div className="space-y-2 pl-1.5 text-[#23385D]">
                                <h3 className="text-[0.82rem] font-medium leading-6 text-[#23385D]">
                                  {headline}
                                </h3>

                                {tagItems.length ? (
                                  <div className="flex flex-wrap gap-1">
                                    {tagItems.map((tag) => (
                                      <span
                                        key={`${entry.title}-${tag.label}`}
                                        className="relative"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => togglePreview(`${entry.title}-${tag.label}`)}
                                          className="rounded-full cursor-pointer border border-[#DCE4F1] bg-[#F5F7FB] px-2 py-0.5 text-[0.74rem] text-[#5D6F8A] transition hover:bg-[#ECF1F8] hover:text-[#23385D]"
                                        >
                                          {tag.label}
                                        </button>

                                        {tag.imageUrl && activePreviewKey === `${entry.title}-${tag.label}` ? (
                                          <button
                                            ref={previewRef}
                                            type="button"
                                            onClick={() => jumpToTag(tag.label)}
                                            className="absolute left-1/2 top-full z-20 mt-5 flex w-[84px] -translate-x-1/2 flex-col rounded-[1.1rem] border border-[#DCE4F1] bg-white px-5 py-6 shadow-[0_18px_44px_rgba(17,17,17,0.12)] transition duration-150 hover:bg-[#FBFCFE]"
                                          >
                                            <img
                                              src={tag.imageUrl}
                                              alt={tag.label || imageName}
                                              className="mx-auto h-8 w-8 object-contain"
                                            />
                                            <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-[#DCE4F1] bg-white" />
                                          </button>
                                        ) : null}
                                      </span>
                                    ))}
                                    {entry.type === "add" ? (
                                      <span className="self-center text-[0.84rem] text-[#5D6F8A]">;</span>
                                    ) : null}
                                  </div>
                                ) : null}

                                {showDescription ? (
                                  <p className="text-[0.92rem] leading-6 text-[#5D6F8A]">
                                    {description}
                                  </p>
                                ) : null}

                                {entry.imageUrl && !entry.tags?.length ? (
                                  <div className="pt-1">
                                    <div className="overflow-hidden rounded-[1.1rem] border border-[#E5EBF4] bg-[#F7F9FD]">
                                      <img
                                        src={entry.imageUrl}
                                        alt={imageName}
                                        className="h-[88px] w-full object-cover"
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </article>
                          );
                        })}
                      </div>

                      {versionIndex < visibleNotes.length - 1 ? <div className="mt-7 h-px bg-[#E9EEF4]" /> : null}
                    </section>
                  ))}

                  {hasMoreEntries ? (
                    <div className="flex justify-center pt-2">
                      <div className="rounded-full border border-[#E9EEF4] bg-[#F5F7FB] px-4 py-2 text-[12px] font-medium text-[#8A97AD]">
                        Scroll to load more
                      </div>
                    </div>
                  ) : null}
                </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
