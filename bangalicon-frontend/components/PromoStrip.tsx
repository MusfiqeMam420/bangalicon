"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getPublicApiBase } from "@/app/lib/runtime";

type PromoCard = {
  title: string;
  subtitle: string;
  iconUrl: string;
  buttonLabel: string;
  buttonUrl: string;
};

type PromoSettings = {
  enabled: boolean;
  badgeText: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  popupEnabled: boolean;
  popupTitle: string;
  popupIconUrl: string;
  popupBadge: string;
  popupSubtitle: string;
  cards: PromoCard[];
};

const defaultPromo: PromoSettings = {
  enabled: false,
  badgeText: "Ad",
  message: "",
  ctaLabel: "",
  ctaUrl: "",
  popupEnabled: true,
  popupTitle: "",
  popupIconUrl: "",
  popupBadge: "",
  popupSubtitle: "",
  cards: [],
};

const normalizePromoHref = (value: string) => {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : raw.startsWith("//") ? `https:${raw}` : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    return /^https?:$/i.test(parsed.protocol) ? parsed.toString() : "";
  } catch (error) {
    return "";
  }
};

const normalizePromoAssetSrc = (value: string, apiBase: string) => {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (/^data:/i.test(raw)) {
    return raw;
  }

  const assetBase = apiBase.replace(/\/api\/?$/i, "");

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);

      if (parsed.pathname.startsWith("/uploads/")) {
        return `${assetBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      return parsed.toString();
    } catch (error) {
      return raw;
    }
  }

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;

  if (normalizedPath.startsWith("/uploads/")) {
    return `${assetBase}${normalizedPath}`;
  }

  return raw;
};

const getPromoLinkProps = (value: string) => {
  const href = normalizePromoHref(value);

  if (!href) {
    return null;
  }

  if (href.startsWith("/")) {
    return { href };
  }

  return {
    href,
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  };
};

function PromoImage({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src: string;
  alt: string;
  className: string;
  fallbackClassName: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={fallbackClassName} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

export default function PromoStrip() {
  const API = getPublicApiBase();
  const [promo, setPromo] = useState<PromoSettings>(defaultPromo);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPromo = async () => {
      try {
        const res = await fetch(`${API}/promo`, { cache: "no-store" });
        const data = await res.json();

        if (active && res.ok) {
          setPromo({ ...defaultPromo, ...data, cards: Array.isArray(data?.cards) ? data.cards : [] });
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchPromo();
    return () => {
      active = false;
    };
  }, [API]);

  const visibleCards = useMemo(() => promo.cards.filter((card) => card.title.trim()), [promo.cards]);
  const safeCtaUrl = useMemo(() => normalizePromoHref(promo.ctaUrl), [promo.ctaUrl]);
  const safePopupIconUrl = useMemo(() => normalizePromoAssetSrc(promo.popupIconUrl, API), [API, promo.popupIconUrl]);
  const ctaLinkProps = useMemo(() => getPromoLinkProps(safeCtaUrl), [safeCtaUrl]);
  const popupCards = useMemo(
    () =>
      visibleCards.map((card) => ({
        ...card,
        safeIconUrl: normalizePromoAssetSrc(card.iconUrl, API),
        safeUrl: normalizePromoHref(card.buttonUrl || promo.ctaUrl),
      })),
    [API, promo.ctaUrl, visibleCards]
  );
  const hasPopup = promo.popupEnabled && visibleCards.length > 0;

  if (!promo.enabled || !promo.message.trim()) {
    return null;
  }

  const triggerPromo = () => {
    if (hasPopup) {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="relative flex h-[40px] w-full items-center justify-center gap-3 overflow-hidden rounded-none bg-[#0b0b0c] px-3 text-center text-[12px] font-medium text-white">
        <span className="absolute left-3 inline-flex min-w-[26px] items-center justify-center rounded-full bg-white px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-[0.08em] text-black">
          {promo.badgeText || "Ad"}
        </span>
        <span className="truncate">{promo.message}</span>
        {promo.ctaLabel && hasPopup ? (
          <button
            type="button"
            onClick={triggerPromo}
            className="cursor-pointer font-semibold text-white transition hover:text-white"
          >
            {promo.ctaLabel}
          </button>
        ) : null}
        {promo.ctaLabel && !hasPopup && ctaLinkProps ? (
          <a {...ctaLinkProps} className="font-semibold text-white transition hover:text-white">
            {promo.ctaLabel}
          </a>
        ) : null}
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-[rgba(17,17,17,0.18)] backdrop-blur-[7px]"
              onClick={() => setOpen(false)}
            />

            <div
              className="fixed inset-0 z-[71] flex items-center justify-center px-4"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, y: 10, filter: "blur(8px)" }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[412px] rounded-[1.7rem] border border-white/75 bg-white/98 p-5 shadow-[0_30px_80px_rgba(17,17,17,0.18)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[0.95rem] ">
                      <PromoImage
                        src={safePopupIconUrl}
                        alt={promo.popupTitle || promo.ctaLabel || "Product icon"}
                        className="h-7 w-7 object-contain"
                        fallbackClassName="h-6 w-6 rounded-full bg-[#d7dbe2]"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold leading-5 text-[#171717]">
                        {promo.popupTitle || promo.ctaLabel || "Featured"}
                      </h3>
                      {promo.popupSubtitle ? (
                        <p className="mt-0 text-[11px] leading-4 text-[#7e8590]">{promo.popupSubtitle}</p>
                      ) : null}
                    </div>
                  </div>

                  {promo.popupBadge ? (
                    <span className="shrink-0 rounded-full border border-[#e5e7eb] bg-[#f7f8fa] px-3 py-1 text-[10px] font-semibold text-[#5f6670]">
                      {promo.popupBadge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {popupCards.map((card, index) => {
                    const linkProps = getPromoLinkProps(card.safeUrl);
                    const cardContent = (
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[0.75rem]  ">
                          <PromoImage
                            src={card.safeIconUrl}
                            alt={card.title}
                            className="h-8 w-8 object-contain"
                            fallbackClassName="h-6 w-6 rounded-full bg-[#d7dbe2]"
                          />
                        </div>
                        <div className="min-w-0">
                          {card.subtitle ? (
                            <p className="truncate text-[9px] font-medium uppercase tracking-[0.04em] text-[#646b74]">
                              {card.subtitle}
                            </p>
                          ) : null}
                          <p className="truncate text-[13px] font-semibold leading-4 text-[#171717]">{card.title}</p>
                          {card.buttonLabel ? (
                            <p className="mt-0.5 text-[10px] leading-4 text-[#171717]">{card.buttonLabel}</p>
                          ) : null}
                        </div>
                      </div>
                    );

                    if (!linkProps) {
                      return (
                        <div
                          key={`${card.title}-${index}`}
                          className="rounded-[1rem] border border-[#EAE8E8] bg-[#ffffff] px-3 py-2.5 opacity-80"
                        >
                          {cardContent}
                        </div>
                      );
                    }

                    return (
                      <a
                        key={`${card.title}-${index}`}
                        {...linkProps}
                        onClick={() => setOpen(false)}
                        className="rounded-[1rem] border border-white bg-[#ffffff] px-3 py-2.5 text-left transition hover:-translate-y-[1px] hover:border-[#EAE8E8] hover:bg-[#F5F6F8]"
                      >
                        {cardContent}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
