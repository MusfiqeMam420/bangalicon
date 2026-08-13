"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicApiBase } from "@/app/lib/runtime";

type IconItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  access: string;
  style: string;
  tags: string[];
  file: string;
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

const API = getPublicApiBase();
const BASE_URL = API.replace(/\/api\/?$/, "");

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const pickCategoryPreviewIcon = (items: IconItem[], categoryName: string) => {
  const categoryTokens = normalizeText(categoryName).split(" ").filter(Boolean);

  const scored = [...items].sort((a, b) => {
    const score = (icon: IconItem) => {
      const name = normalizeText(icon.name);
      const tags = icon.tags.map(normalizeText).join(" ");
      const haystack = `${name} ${tags}`;
      const tokenMatches = categoryTokens.filter((token) => haystack.includes(token)).length;
      const premiumPenalty = icon.access === "premium" ? -20 : 0;
      const regularBoost = icon.style === "regular" ? 10 : icon.style === "solid" ? 6 : 2;
      const shortNameBoost = Math.max(0, 16 - icon.name.length);

      return tokenMatches * 50 + regularBoost + shortNameBoost + premiumPenalty;
    };

    return score(b) - score(a);
  });

  return scored[0] || items[0] || null;
};

export default function CategoryDirectory() {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API}/icons`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await res.json();
        const safeIcons = Array.isArray(data) ? data : [];

        setIcons(
          safeIcons.map((item: ApiIcon) => ({
            id: String(item.id || item._id || item.name || ""),
            name: String(item.name || ""),
            slug: String(item.slug || item.name || "")
              .toLowerCase()
              .replace(/&/g, "and")
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
              .replace(/-+/g, "-"),
            category: item.category_name || "Uncategorized",
            access: String(item.type || "free"),
            style: String(item.style || "regular"),
            tags: Array.isArray(item.tags) ? item.tags : [],
            file: String(item.file || ""),
          }))
        );
      } catch (fetchError) {
        setIcons([]);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    void fetchIcons();
  }, []);

  const categorySummaries = useMemo(() => {
    const grouped = new Map<string, IconItem[]>();

    for (const icon of icons) {
      const key = icon.category || "Uncategorized";
      const next = grouped.get(key) || [];
      next.push(icon);
      grouped.set(key, next);
    }

    return Array.from(grouped.entries())
      .map(([name, items]) => ({
        name,
        count: new Set(items.map((item) => item.id || `${item.slug}-${item.style}-${item.file}`)).size,
        previewIcon: pickCategoryPreviewIcon(items, name),
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      });
  }, [icons]);

  const totalUniqueIcons = useMemo(
    () => new Set(icons.map((icon) => icon.id || `${icon.slug}-${icon.style}-${icon.file}`)).size,
    [icons]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.42 }}
      className="mx-auto max-w-[900px] px-4 py-10 sm:py-14"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.04 }}
        className="mx-auto max-w-6xl"
      >
        <h1 className="text-[24px] font-bold tracking-[-0.05em] text-[#111111] sm:text-[20px]">
          Icon categories
        </h1>
        <p className="mt-0 text-[12px] leading-7 text-[#686868]">
          {totalUniqueIcons.toLocaleString()} unique icons across {categorySummaries.length} categories,
          picked from your actual Bangalicon database.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="categories-loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="py-10 text-center text-sm text-[#8a8a8a]"
          >
            Loading categories...
          </motion.div>
        ) : error ? (
          <motion.div
            key="categories-error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="py-20 text-center text-sm text-[#d31217]"
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            key="categories-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delayChildren: 0.08, staggerChildren: 0.06 }}
            className="mx-auto mt-2 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 xl:max-w-none xl:grid-cols-4"
          >
            {categorySummaries.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.34 }}
              >
                <Link
                  href={`/?category=${encodeURIComponent(item.name)}`}
                  className="flex items-center gap-4 rounded-[14px] border border-[#e9e9e9] bg-white px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-[#d6d6d6] hover:shadow-[0_10px_24px_rgba(17,17,17,0.05)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F5F6F8]">
                    {item.previewIcon ? (
                      <img
                        src={`${BASE_URL}/uploads/${item.previewIcon.file}`}
                        alt={item.name}
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <span className="text-lg text-[#b3b3b3]">•</span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold text-[#111111]">{item.name}</span>
                  </span>

                  <span className="text-[11px] font-medium text-[#7d7d7d]">{item.count}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
