"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: string[];
  active: string;
  setActive: (v: string) => void;
  suggestions: string[];
  onSuggestionClick: (tag: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
};

export default function IconToolbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  active,
  setActive,
  suggestions,
  onSuggestionClick,
  savedCount,
  onOpenSaved,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(false);

  const catRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!filterOpen) setCatOpen(false);
  }, [filterOpen]);

  const typeOptions = [
    { label: "Regular", icon: "/icons/t-1.svg" },
    { label: "Solid", icon: "/icons/t-2.svg" },
    { label: "Brands", icon: "/icons/t-3.svg" },
  ];

  return (
    <div className="mx-auto mb-6 max-w-2xl">
      <div className="rounded-[24px]  px-3 py-2 ">
        <div className="flex items-center gap-1 bg-white  rounded-[17px] px-3 py-3 shadow-[1px_3px_17px_-19px_#ededed] ">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full text-sm ${
            filterOpen ? "bg-black text-white " : "bg-gray-200 text-gray-500 font-semibold "
          }`}
        >
          <Image
            src="/icons/filter.svg"
            alt="Filter"
            width={14}
            height={14}
            className={`h-[14px] w-[14px] ${filterOpen ? "invert brightness-0 saturate-0" : ""}`}
          />
          Filter
        </motion.button>

        <div className="h-8 w-[1.2px] bg-[#E4E4E4] ml-2"></div>

        <div className="flex-1 flex items-center px-2">
          <span className="mr-2 text-gray-400 ">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.08333 14.1667C5.80556 14.1667 4.61806 13.8542 3.52083 13.2292C2.4375 12.5903 1.57639 11.7292 0.9375 10.6458C0.3125 9.54858 0 8.36108 0 7.08333C0 5.80556 0.3125 4.625 0.9375 3.54167C1.57639 2.44444 2.4375 1.58333 3.52083 0.958333C4.61806 0.319442 5.80556 0 7.08333 0C8.36108 0 9.54167 0.319442 10.625 0.958333C11.7222 1.58333 12.5833 2.44444 13.2083 3.54167C13.8472 4.625 14.1667 5.80556 14.1667 7.08333C14.1667 8.36108 13.8472 9.54858 13.2083 10.6458C12.5833 11.7292 11.7222 12.5903 10.625 13.2292C9.54167 13.8542 8.36108 14.1667 7.08333 14.1667ZM7.08333 12.5C8.11108 12.5 9.03475 12.2708 9.85417 11.8125C10.6875 11.3402 11.3333 10.6944 11.7917 9.875C12.2639 9.04167 12.5 8.11108 12.5 7.08333C12.5 6.05556 12.2639 5.13194 11.7917 4.3125C11.3333 3.47917 10.6875 2.83333 9.85417 2.375C9.03475 1.90277 8.11108 1.66667 7.08333 1.66667C6.05556 1.66667 5.125 1.90277 4.29167 2.375C3.47222 2.83333 2.82639 3.47917 2.35417 4.3125C1.89583 5.13194 1.66667 6.05556 1.66667 7.08333C1.66667 8.11108 1.89583 9.04167 2.35417 9.875C2.82639 10.6944 3.47222 11.3402 4.29167 11.8125C5.125 12.2708 6.05556 12.5 7.08333 12.5ZM10.4792 11.6667L11.6667 10.4792L15.1667 14C15.4028 14.2361 15.4722 14.5 15.375 14.7917C15.2778 15.0833 15.0833 15.2847 14.7917 15.3958C14.5139 15.4931 14.25 15.4167 14 15.1667L10.4792 11.6667Z" fill="#BEBEBE" />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Icons..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <button
          onClick={onOpenSaved}
          className="relative p-2 rounded-[11px] border cursor-pointer border-[#E6E6E6] bg-[#F5F6F8] hover:bg-gray-100 transition"
        >
          <span className="text-lg">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.025 8C11.4583 8 10.975 7.8083 10.575 7.425C10.1917 7.025 10 6.54167 10 5.975V2.025C10 1.45833 10.1917 0.98333 10.575 0.6C10.975 0.2 11.4583 0 12.025 0H15.975C16.5417 0 17.0167 0.2 17.4 0.6C17.8 0.98333 18 1.45833 18 2.025V5.975C18 6.54167 17.8 7.025 17.4 7.425C17.0167 7.8083 16.5417 8 15.975 8H12.025ZM2.025 18C1.45833 18 0.975 17.8083 0.575 17.425C0.19167 17.025 0 16.5417 0 15.975V12.025C0 11.4583 0.19167 10.9833 0.575 10.6C0.975 10.2 1.45833 10 2.025 10H5.975C6.54167 10 7.0167 10.2 7.4 10.6C7.8 10.9833 8 11.4583 8 12.025V15.975C8 16.5417 7.8 17.025 7.4 17.425C7.0167 17.8083 6.54167 18 5.975 18H2.025ZM5.975 16C6.05833 16 6.09167 16.0167 6.075 16.05C6.075 16.0667 6.05833 16.075 6.025 16.075C6.00833 16.075 6 16.0417 6 15.975V12.025C6 11.9417 6.00833 11.9083 6.025 11.925C6.05833 11.925 6.075 11.9417 6.075 11.975C6.09167 11.9917 6.05833 12 5.975 12H2.025C1.95833 12 1.925 11.9917 1.925 11.975C1.925 11.9417 1.93333 11.925 1.95 11.925C1.98333 11.9083 2 11.9417 2 12.025V15.975C2 16.0417 1.98333 16.075 1.95 16.075C1.93333 16.075 1.925 16.0667 1.925 16.05C1.925 16.0167 1.95833 16 2.025 16H5.975ZM2.025 8C1.45833 8 0.975 7.8083 0.575 7.425C0.19167 7.025 0 6.54167 0 5.975V2.025C0 1.45833 0.19167 0.98333 0.575 0.6C0.975 0.2 1.45833 0 2.025 0H5.975C6.54167 0 7.0167 0.2 7.4 0.6C7.8 0.98333 8 1.45833 8 2.025V5.975C8 6.54167 7.8 7.025 7.4 7.425C7.0167 7.8083 6.54167 8 5.975 8H2.025ZM5.975 6C6.05833 6 6.09167 6.01667 6.075 6.05C6.075 6.06667 6.05833 6.075 6.025 6.075C6.00833 6.075 6 6.04167 6 5.975V2.025C6 1.94167 6.00833 1.90833 6.025 1.925C6.05833 1.925 6.075 1.94167 6.075 1.975C6.09167 1.99167 6.05833 2 5.975 2H2.025C1.95833 2 1.925 1.99167 1.925 1.975C1.925 1.94167 1.93333 1.925 1.95 1.925C1.98333 1.90833 2 1.94167 2 2.025V5.975C2 6.04167 1.98333 6.075 1.95 6.075C1.93333 6.075 1.925 6.06667 1.925 6.05C1.925 6.01667 1.95833 6 2.025 6H5.975ZM12.025 18C11.4583 18 10.975 17.8083 10.575 17.425C10.1917 17.025 10 16.5417 10 15.975V12.025C10 11.4583 10.1917 10.9833 10.575 10.6C10.975 10.2 11.4583 10 12.025 10H15.975C16.5417 10 17.0167 10.2 17.4 10.6C17.8 10.9833 18 11.4583 18 12.025V15.975C18 16.5417 17.8 17.025 17.4 17.425C17.0167 17.8083 16.5417 18 15.975 18H12.025ZM15.975 16C16.0583 16 16.0917 16.0167 16.075 16.05C16.075 16.0667 16.0583 16.075 16.025 16.075C16.0083 16.075 16 16.0417 16 15.975V12.025C16 11.9417 16.0083 11.9083 16.025 11.925C16.0583 11.925 16.075 11.9417 16.075 11.975C16.0917 11.9917 16.0583 12 15.975 12H12.025C11.9583 12 11.925 11.9917 11.925 11.975C11.925 11.9417 11.9333 11.925 11.95 11.925C11.9833 11.9083 12 11.9417 12 12.025V15.975C12 16.0417 11.9833 16.075 11.95 16.075C11.93333 16.075 11.925 16.0667 11.925 16.05C11.925 16.0167 11.9583 16 12.025 16H15.975ZM15.975 6C16.0583 6 16.0917 6.01667 16.075 6.05C16.075 6.06667 16.0583 6.075 16.025 6.075C16.0083 6.075 16 6.04167 16 5.975V2.025C16 1.94167 16.0083 1.90833 16.025 1.925C16.0583 1.925 16.075 1.94167 16.075 1.975C16.0917 1.99167 16.0583 2 15.975 2H12.025C11.9583 2 11.925 1.99167 11.925 1.975C11.925 1.94167 11.9333 1.925 11.95 1.925C11.9833 1.90833 12 1.94167 12 2.025V5.975C12 6.04167 11.9833 6.075 11.95 6.075C11.9333 6.075 11.925 6.06667 11.925 6.05C11.925 6.01667 11.9583 6 12.025 6H15.975Z" fill="#8A8A8A" />
            </svg>
          </span>

          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#C9151B] text-white">
              {savedCount}
            </span>
          )}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {search.trim() && suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-1 px-3 flex flex-wrap gap-2"
          >
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSuggestionClick(tag)}
                className="rounded-full border border-[#f1f1f1] bg-[#ffffff] px-3 py-1.5 text-[12px] font-medium text-[#575b63]  transition hover:-translate-y-[1px] hover:bg-[#e8ebf0] hover:text-[#111111]"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-2 px-3 flex items-center justify-between gap-3 flex-wrap md:flex-nowrap "
          >
            <div ref={catRef} className="relative w-full md:w-[160px]">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="w-full px-4 py-3 sm:py-2 text-[#312F2F] cursor-pointer bg-white border border-[#E6E6E6] rounded-xl text-sm flex font-medium justify-between items-center"
              >
                {category === "All" ? "All Categories" : category}

                <motion.span animate={{ rotate: catOpen ? 180 : 0 }}>
                  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.53403 0.216001C9.73403 0.0160013 9.94516 -0.0451124 10.1674 0.0326676C10.4007 0.110448 10.5562 0.271554 10.634 0.516001C10.7118 0.749334 10.6562 0.960448 10.4674 1.14933L5.80069 5.83267C5.65623 5.97713 5.5007 6.04933 5.33403 6.04933C5.17849 6.04933 5.0229 5.97713 4.86736 5.83267L0.200695 1.14933C0.0118084 0.960448 -0.0437516 0.749334 0.0340284 0.516001C0.111808 0.282668 0.261808 0.127115 0.484028 0.0493346C0.717362 -0.0395521 0.934028 0.0160013 1.13403 0.216001L5.33403 4.39933L9.53403 0.216001Z" fill="#828282" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="promo-category-scroll absolute left-0 mt-2 max-h-[320px] w-full overflow-y-auto rounded-xl bg-white p-2 shadow-md z-50"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setCatOpen(false);
                        }}
                        className={`w-full text-left cursor-pointer text-sm text-[#4d4d4d] px-3 py-2 font-medium  rounded-xl ${
                          category === cat ? "bg-gray-100" : "hover:bg-gray-100 rounded-xl"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 text-sm flex-wrap md:flex-nowrap">
              {typeOptions.map((item) => {
                const isActive = active === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => setActive(item.label)}
                    className={`flex items-center gap-2 px-3 py-2 font-medium rounded-xl border transition border-[#E6E6E6] cursor-pointer ${
                      isActive ? "bg-white text-[#312F2F] font-medium" : "bg-transparent text-[#6E6E6E]"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={14}
                      height={14}
                      className={`h-[14px] w-[14px] ${isActive ? "brightness-0 saturate-100" : "opacity-60"}`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
