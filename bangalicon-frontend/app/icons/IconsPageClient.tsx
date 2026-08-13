"use client";

import Image from "next/image";
import IconToolbar from "@/components/IconToolbar";
import IconPreviewModal from "@/components/IconPreviewModal";
import CollectionModal from "@/components/CollectionModal";
import { useToast } from "@/components/ui/ToastProvider";
import { getStoredUser, onAuthChange, type AuthUser } from "@/app/lib/auth";
import { getPublicApiBase } from "@/app/lib/runtime";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCollections } from "@/app/lib/useCollections";

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

type IconsPageClientProps = {
  initialIcons?: ApiIcon[];
};

const API = getPublicApiBase();
const BASE_URL = API.replace(/\/api\/?$/, "");
const ICON_BATCH_SIZE = 84;
const searchGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.022,
      delayChildren: 0.02,
    },
  },
} satisfies Variants;

const searchIconVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.92,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 28,
      mass: 0.7,
    },
  },
} satisfies Variants;

const mapApiIcons = (items: ApiIcon[]): IconItem[] =>
  items.map((item: ApiIcon) => ({
    id: String(item.id || item._id || item.name || ""),
    name: String(item.name || ""),
    slug: String(item.slug || item.name || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-"),
    category: item.category_name || "Uncategorized",
    filterType:
      item.style === "solid" ? "Solid" : item.style === "brand" ? "Brands" : "Regular",
    access: String(item.type || "free"),
    style: String(item.style || "regular"),
    tags: Array.isArray(item.tags) ? item.tags : [],
    file: String(item.file || ""),
  }));

const isBrandCategory = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return normalized === "brand" || normalized === "brands";
};

export default function IconsPageClient({ initialIcons = [] }: IconsPageClientProps) {
  const [active, setActive] = useState("Regular");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [icons, setIcons] = useState<IconItem[]>(() => mapApiIcons(initialIcons));
  const [loading, setLoading] = useState(initialIcons.length === 0);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [colOpen, setColOpen] = useState(false);
  const [collectionIcons, setCollectionIcons] = useState<IconItem[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [viewer, setViewer] = useState<AuthUser | null>(null);
  const [visibleCount, setVisibleCount] = useState(ICON_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { saved, toggleSave, replaceSaved, clearAll } = useCollections();
  const { showToast } = useToast();

  const applyCategorySelection = useCallback((nextCategory: string) => {
    setCategory(nextCategory);

    if (isBrandCategory(nextCategory)) {
      setActive("Brands");
    }
  }, []);

  useEffect(() => {
    const syncViewer = () => {
      setViewer(getStoredUser());
    };

    syncViewer();
    return onAuthChange(syncViewer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    applyCategorySelection(params.get("category") || "All");

    if (params.get("openCollection") === "1") {
      setColOpen(true);
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.delete("openCollection");
      const nextSearch = nextParams.toString();
      const nextUrl = nextSearch ? `/?${nextSearch}` : "/";
      window.history.replaceState({}, "", nextUrl);
    }
  }, [applyCategorySelection]);

  useEffect(() => {
    const fetchIcons = async () => {
      if (initialIcons.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API}/icons`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to load icons");
        }

        const data = await res.json();
        const safeIcons = Array.isArray(data) ? data : [];
        setIcons(mapApiIcons(safeIcons));
      } catch (fetchError) {
        console.error(fetchError);
        setIcons([]);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load icons");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, [initialIcons]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(icons.map((icon) => icon.category).filter(Boolean))).sort()],
    [icons]
  );

  const filteredIcons = useMemo(
    () =>
      icons.filter((icon) => {
        const query = search.toLowerCase();
        const matchSearch =
          icon.name.toLowerCase().includes(query) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchCategory = category === "All" || icon.category === category;
        const matchType = active === "All" || icon.filterType === active;

        return matchSearch && matchCategory && matchType;
      }),
    [active, category, icons, search]
  );

  const tagSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const matches = new Map<string, number>();

    icons.forEach((icon) => {
      icon.tags.forEach((tag) => {
        const normalized = tag.trim().toLowerCase();

        if (!normalized || normalized === query || !normalized.includes(query)) {
          return;
        }

        matches.set(normalized, (matches.get(normalized) || 0) + 1);
      });
    });

    return [...matches.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [icons, search]);

  const visibleIcons = useMemo(
    () => filteredIcons.slice(0, visibleCount),
    [filteredIcons, visibleCount]
  );

  const totalUniqueIcons = useMemo(
    () => new Set(icons.map((icon) => icon.id || `${icon.slug}-${icon.style}-${icon.file}`)).size,
    [icons]
  );

  const savedIcons = useMemo(() => {
    const byName = new Map<string, IconItem>();

    icons.forEach((icon) => {
      if (!saved.includes(icon.name) || byName.has(icon.name)) {
        return;
      }

      byName.set(icon.name, icon);
    });

    return [...byName.values()];
  }, [icons, saved]);

  const validSavedNames = useMemo(() => savedIcons.map((icon) => icon.name), [savedIcons]);
  const validSavedKey = useMemo(() => validSavedNames.join("||"), [validSavedNames]);
  const savedKey = useMemo(() => saved.join("||"), [saved]);
  const savedCount = useMemo(() => {
    if (loading && !icons.length) {
      return saved.length;
    }

    return validSavedNames.length;
  }, [icons.length, loading, saved.length, validSavedNames.length]);

  useEffect(() => {
    if (!icons.length || !saved.length) {
      return;
    }

    if (validSavedKey !== savedKey) {
      replaceSaved(validSavedNames);
    }
  }, [icons.length, replaceSaved, saved.length, savedKey, validSavedKey, validSavedNames]);

  useEffect(() => {
    setVisibleCount(ICON_BATCH_SIZE);
  }, [active, category, search]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || visibleCount >= filteredIcons.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + ICON_BATCH_SIZE, filteredIcons.length));
        }
      },
      {
        rootMargin: "240px 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredIcons.length, visibleCount]);

  useEffect(() => {
    const hydrateCollectionIcons = async () => {
      if (!colOpen) return;
      if (!savedIcons.length) {
        setCollectionIcons([]);
        return;
      }

      setCollectionLoading(true);

      try {
        const hydrated = await Promise.all(
          savedIcons.map(async (icon) => {
            if (icon.svg) return icon;

            try {
              const res = await fetch(`${BASE_URL}/uploads/${icon.file}`, { cache: "no-store" });
              const svg = res.ok ? await res.text() : "";
              return { ...icon, svg };
            } catch (error) {
              console.error(error);
              return icon;
            }
          })
        );

        setCollectionIcons(hydrated);
      } finally {
        setCollectionLoading(false);
      }
    };

    hydrateCollectionIcons();
  }, [colOpen, savedIcons]);

  const openIcon = async (icon: IconItem) => {
    if (icon.svg) {
      setSelectedIcon(icon);
      setModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/uploads/${icon.file}`, { cache: "no-store" });
      const svg = res.ok ? await res.text() : "";
      setSelectedIcon({ ...icon, svg });
    } catch (loadError) {
      console.error(loadError);
      setSelectedIcon(icon);
    } finally {
      setModalOpen(true);
    }
  };

  const applyTagSearch = (tag: string) => {
    setSearch(tag);
    setCategory("All");
    setModalOpen(false);

    const nextUrl = `/?search=${encodeURIComponent(tag)}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const applyCategoryFilter = (nextCategory: string) => {
    applyCategorySelection(nextCategory);
    setSearch("");
    setModalOpen(false);
    window.history.replaceState({}, "", "/");
  };

  const handleToggleSave = (name: string) => {
    const alreadySaved = saved.includes(name);
    toggleSave(name);
    showToast({
      message: alreadySaved ? "Removed from saved icons" : "Added to saved icons",
      tone: "success",
    });
  };

  return (
    <div className="relative pt-5 pb-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] opacity-[0.26]"
        style={{
          backgroundImage: "url('/hero/hero-icons-bg.png')",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center 18px",
          backgroundSize: "760px auto",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.68) 58%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.68) 58%, transparent 100%)",
        }}
      />

      <section className="relative mx-auto max-w-[1180px] overflow-hidden px-4 pt-4">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-full -translate-x-1/2 opacity-[0.9]"
          style={{
            backgroundImage: "url('/hero/hero-icons-bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            backgroundSize: "min(820px,100%) auto",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.38 }}
          className="relative mx-auto max-w-[700px] pt-0 text-center"
        >
          <h1 className="text-[44px]   font-extrabold tracking-[-0.05em] text-[#111111] sm:text-[48px]">
            Welcome
          </h1>
          <p className="mt-0 text-[16px] font-medium text-[#666b73] sm:text-[16px]">
            to the world of most creative icons.
          </p>

          <div className="mt-2 flex justify-center">
            <div className="flex max-w-full flex-nowrap items-center justify-center gap-1 overflow-hidden rounded-[17px] border border-[#e7e8ed] bg-[#f6f8fc] p-1 sm:gap-1">
              <span className="inline-flex min-h-[35px] max-w-[86px] items-center justify-center whitespace-nowrap  bg-[#dde2e6] px-3 py-1.5 text-[13px] font-medium leading-none text-[#686868] sm:min-h-[35px] sm:max-w-none rounded-[14px]  sm:text-[14px]">
                <span className="truncate mb-0.5 font-semibold">{totalUniqueIcons || 0} icons</span>
              </span>

              <a
                href="https://www.figma.com/community/plugin/1509149406843135161/bangalicon"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[35px] min-w-0 max-w-[128px] items-center justify-center gap-2 whitespace-nowrap rounded-[14px] border border-[#E8E8E8] bg-white px-3 py-1.5 text-[13px] font-medium text-[#5a5a5a] transition hover:-translate-y-[1px] hover:border-[#d8dce2] hover:text-[#111111] sm:min-h-[35px] sm:max-w-none  sm:px-3.5 sm:text-[14px]"
              >
                <Image src="/hero/figma-icon.png" alt="Figma" width={16} height={16} className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate text-[#686868]">Figma Plugin</span>
              </a>

              <span className="inline-flex shrink-0 items-center gap-2 rounded-full px-1">
                <Image src="/hero/react-icon.webp" alt="React" width={18} height={18} className="h-[18px] w-[18px]" />
                <Image src="/hero/svelte-icon.webp" alt="Svelte" width={18} height={18} className="h-[18px] w-[18px]" />
                <Image src="/hero/vue-icon.png" alt="Vue" width={18} height={18} className="h-[18px] w-[18px]" />
              </span>
            </div>
          </div>

          <p className="mx-auto mt-3 mb-2 max-w-[480px] text-[15px] leading-4 text-[#6d7178] sm:text-[13px]">
            a curated collection of sleek icons, optimized for CDN delivery, perfect for developers
            and designers seeking enhanced web aesthetics.
          </p>
        </motion.div>
      </section>

      <div className="sticky top-[95px] z-30 mx-auto max-w-2xl px-2">
        <div className="rounded-[30px] bg-[#F5F6F8]">
          <IconToolbar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={applyCategorySelection}
            categories={categories}
            active={active}
            setActive={setActive}
            suggestions={tagSuggestions}
            onSuggestionClick={applyTagSearch}
            savedCount={savedCount}
            onOpenSaved={() => setColOpen(true)}
          />

          <div className="mx-auto -mt-2 max-w-2xl px-2">
            <div className="h-[1.4px] bg-[#E7E7E9]" />
          </div>

          <div className="mx-auto mt-3 flex max-w-2xl items-center gap-2 px-4">
            <h2 className="text-lg font-semibold text-[#121212]">{category === "All" ? "All Icons" : category}</h2>

            <span className="mt-1 rounded-full bg-[#D9D9D9] px-2 py-0.5 text-xs font-semibold text-[#585858]">
              {filteredIcons.length}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3" />

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center text-sm text-gray-400"
            >
              Loading icons...
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <h3 className="mb-1 text-lg font-medium text-gray-700">Could not load icons</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </motion.div>
          ) : filteredIcons.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl mb-3 mt-15"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C10.2 22 8.53333 21.55 7 20.65C5.46667 19.75 4.25 18.5333 3.35 17C2.45 15.4667 2 13.8 2 12C2 10.2 2.45 8.53333 3.35 7C4.25 5.45 5.46667 4.23333 7 3.35C8.53333 2.45 10.2 2 12 2C13.8 2 15.4667 2.45 17 3.35C18.55 4.23333 19.7667 5.45 20.65 7C21.55 8.53333 22 10.2 22 12C22 13.8 21.55 15.4667 20.65 17C19.7667 18.5333 18.55 19.75 17 20.65C15.4667 21.55 13.8 22 12 22ZM13.5 16.5C13.5 16.0833 13.35 15.7333 13.05 15.45C12.7667 15.15 12.4167 15 12 15C11.5833 15 11.225 15.15 10.925 15.45C10.6417 15.75 10.5 16.1 10.5 16.5C10.5 16.9167 10.6417 17.275 10.925 17.575C11.225 17.8583 11.5833 18 12 18C12.4167 18 12.7667 17.85 13.05 17.55C13.35 17.25 13.5 16.9 13.5 16.5ZM11 13C11 13.4167 11.1667 13.7083 11.5 13.875C11.8333 14.025 12.1667 14.025 12.5 13.875C12.8333 13.7083 13 13.4167 13 13V7C13 6.58333 12.8333 6.3 12.5 6.15C12.1667 5.98333 11.8333 5.98333 11.5 6.15C11.1667 6.3 11 6.58333 11 7V13Z" fill="#C9151B" />
                </svg>
              </motion.div>

              <h3 className="text-lg font-medium text-gray-700 mb-1">No icons found</h3>
              <p className="text-sm text-gray-400">Try a different keyword or category</p>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${search}-${category}-${active}`}
              variants={searchGridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.16 } }}
              className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-7"
            >
              {visibleIcons.map((icon) => {
                const isSaved = saved.includes(icon.name);
                const isPremium = icon.access === "premium";
                const canSaveIcon = !isPremium || viewer?.plan === "premium";

                return (
                  <motion.div
                    key={icon.id}
                    layout
                    variants={searchIconVariants}
                    transition={{ layout: { type: "spring", stiffness: 360, damping: 30, mass: 0.7 } }}
                    className="group relative flex h-22 cursor-pointer items-center justify-center rounded-xl transition hover:bg-white hover:shadow-sm will-change-transform"
                    onClick={() => openIcon(icon)}
                  >
                    {isPremium ? <span className="absolute bottom-2 left-2 h-3 w-3 rounded-full bg-[#C9151B]" /> : null}

                    <span className="flex h-10 w-10 items-center justify-center text-lg text-gray-700">
                      <img
                        src={`${BASE_URL}/uploads/${icon.file}`}
                        alt={icon.name}
                        className="h-8 w-8 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>

                    {canSaveIcon ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(icon.name);
                        }}
                        title={isSaved ? "Remove from saved" : "Save icon"}
                        className={`absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-xs transition ${
                          isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isSaved ? (
                          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.00008 12.8333C5.95008 12.8333 4.97786 12.5708 4.08341 12.0458C3.18897 11.5208 2.47925 10.8111 1.95425 9.91667C1.42925 9.02225 1.16675 8.05001 1.16675 7.00001C1.16675 5.95001 1.42925 4.97778 1.95425 4.08334C2.47925 3.17917 3.18897 2.46945 4.08341 1.95417C4.97786 1.42917 5.95008 1.16667 7.00008 1.16667C8.05008 1.16667 9.02232 1.42917 9.91675 1.95417C10.8209 2.46945 11.5307 3.17917 12.0459 4.08334C12.5709 4.97778 12.8334 5.95001 12.8334 7.00001C12.8334 8.05001 12.5709 9.02225 12.0459 9.91667C11.5307 10.8111 10.8209 11.5208 9.91675 12.0458C9.02232 12.5708 8.05008 12.8333 7.00008 12.8333ZM5.71675 9.15834C5.84316 9.28475 5.98409 9.34792 6.13966 9.34792C6.29524 9.34792 6.43617 9.28475 6.56258 9.15834L10.048 5.65834C10.2133 5.49306 10.257 5.30834 10.1792 5.10417C10.1112 4.89028 9.97508 4.74931 9.77092 4.68126C9.57649 4.6132 9.38691 4.66667 9.20217 4.84167L6.13966 7.93334L4.78341 6.59167C4.61814 6.42641 4.42856 6.37776 4.21466 6.44584C4.0105 6.51391 3.87439 6.65001 3.80633 6.85417C3.73827 7.0486 3.79175 7.23334 3.96675 7.40834L5.71675 9.15834Z" fill="#C9151B" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.00008 12.8333C5.95008 12.8333 4.97786 12.5708 4.08341 12.0458C3.18897 11.5208 2.47925 10.8111 1.95425 9.91666C1.42925 9.02223 1.16675 8.04999 1.16675 6.99999C1.16675 5.94999 1.42925 4.97777 1.95425 4.08332C2.47925 3.17916 3.18897 2.46943 4.08341 1.95416C4.97786 1.42916 5.95008 1.16666 7.00008 1.16666C8.05008 1.16666 9.02232 1.42916 9.91675 1.95416C10.8209 2.46943 11.5307 3.17916 12.0459 4.08332C12.5709 4.97777 12.8334 5.94999 12.8334 6.99999C12.8334 8.04999 12.5709 9.02223 12.0459 9.91666C11.5307 10.8111 10.8209 11.5208 9.91675 12.0458C9.02232 12.5708 8.05008 12.8333 7.00008 12.8333ZM6.41675 7.58332V9.33332C6.41675 9.5764 6.51399 9.7465 6.70842 9.84374C6.90284 9.93124 7.09732 9.93124 7.29175 9.84374C7.48617 9.7465 7.58342 9.5764 7.58342 9.33332V7.58332H9.33342C9.57649 7.58332 9.74175 7.48608 9.82925 7.29166C9.92649 7.09723 9.92649 6.90275 9.82925 6.70832C9.74175 6.5139 9.57649 6.41666 9.33342 6.41666H7.58342V4.66666C7.58342 4.4236 7.48617 4.25832 7.29175 4.17082C7.09732 4.0736 6.90284 4.0736 6.70842 4.17082C6.51399 4.25832 6.41675 4.4236 6.41675 4.66666V6.41666H4.66675C4.42369 6.41666 4.25356 6.5139 4.15633 6.70832C4.06883 6.90275 4.06883 7.09723 4.15633 7.29166C4.25356 7.48608 4.42369 7.58332 4.66675 7.58332H6.41675Z" fill="#838383" />
                          </svg>
                        )}
                      </button>
                    ) : null}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && !error && visibleCount < filteredIcons.length ? (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="rounded-full bg-[#f3f5f8] px-4 py-2 text-xs font-semibold text-[#7c838d]">
              Loading more icons...
            </div>
          </div>
        ) : null}
      </div>

      <IconPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={selectedIcon}
        onTagClick={applyTagSearch}
        onCategoryClick={applyCategoryFilter}
        saved={saved}
        toggleSave={handleToggleSave}
      />

      <CollectionModal
        open={colOpen}
        onClose={() => setColOpen(false)}
        icons={collectionIcons}
        loading={collectionLoading}
        clearAll={clearAll}
        toggleSave={handleToggleSave}
      />
    </div>
  );
}
