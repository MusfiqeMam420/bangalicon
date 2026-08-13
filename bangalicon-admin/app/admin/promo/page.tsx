"use client";

import { useEffect, useMemo, useState } from "react";

type PromoCard = {
  title: string;
  subtitle: string;
  iconUrl: string;
  buttonLabel: string;
  buttonUrl: string;
};

type PromoSettings = {
  id: string;
  key: string;
  name: string;
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
  updatedAt?: string | null;
};

type IconOption = {
  id: string;
  name: string;
  file: string;
};

const emptyCard = (): PromoCard => ({
  title: "",
  subtitle: "",
  iconUrl: "",
  buttonLabel: "",
  buttonUrl: "",
});

const createDraftPromo = (name = "New promo"): PromoSettings => ({
  id: "",
  key: "",
  name,
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
  cards: [emptyCard(), emptyCard()],
  updatedAt: null,
});

export default function PromoPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const BASE_URL = API.replace(/\/api\/?$/, "");

  const normalizeStoredAssetPath = (value: string) => {
    const raw = String(value || "").trim();

    if (!raw) {
      return "";
    }

    if (/^data:/i.test(raw)) {
      return raw;
    }

    if (/^https?:\/\//i.test(raw)) {
      try {
        const parsed = new URL(raw);
        return parsed.pathname.startsWith("/uploads/")
          ? `${parsed.pathname}${parsed.search}${parsed.hash}`
          : parsed.toString();
      } catch (error) {
        return raw;
      }
    }

    return raw.startsWith("/") ? raw : `/${raw}`;
  };

  const resolveAssetPreviewUrl = (value: string) => {
    const raw = normalizeStoredAssetPath(value);

    if (!raw || /^data:/i.test(raw) || /^https?:\/\//i.test(raw)) {
      return raw;
    }

    if (raw.startsWith("/uploads/")) {
      return `${BASE_URL}${raw}`;
    }

    return raw;
  };

  const [promos, setPromos] = useState<PromoSettings[]>([]);
  const [selectedPromoId, setSelectedPromoId] = useState("");
  const [icons, setIcons] = useState<IconOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingCardIndex, setUploadingCardIndex] = useState<number | null>(null);
  const [uploadingPopupIcon, setUploadingPopupIcon] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [promoRes, iconsRes] = await Promise.all([
          fetch(`${API}/promo/all`, { cache: "no-store" }),
          fetch(`${API}/icons`, { cache: "no-store" }),
        ]);

        const promoData = await promoRes.json();
        const iconsData = await iconsRes.json();

        const nextPromos = Array.isArray(promoData)
          ? promoData.map((promo) => ({
              ...createDraftPromo(String(promo.name || "New promo")),
              ...promo,
              cards:
                Array.isArray(promo?.cards) && promo.cards.length
                  ? promo.cards
                  : [emptyCard(), emptyCard()],
            }))
          : [];

        setPromos(nextPromos);
        setSelectedPromoId(nextPromos[0]?.id || "");

        setIcons(
          Array.isArray(iconsData)
            ? iconsData.map((icon) => ({
                id: String(icon.id || icon._id || icon.name || ""),
                name: String(icon.name || ""),
                file: String(icon.file || ""),
              }))
            : []
        );
      } catch (error) {
        console.error(error);
        setPromos([]);
        setIcons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API]);

  const selectedPromo = useMemo(
    () => promos.find((promo) => promo.id === selectedPromoId) || null,
    [promos, selectedPromoId]
  );

  const replaceSelectedPromo = (updater: (promo: PromoSettings) => PromoSettings) => {
    setPromos((prev) => prev.map((promo) => (promo.id === selectedPromoId ? updater(promo) : promo)));
  };

  const updateSelectedPromo = (patch: Partial<PromoSettings>) => {
    replaceSelectedPromo((promo) => ({ ...promo, ...patch }));
  };

  const updateCard = (index: number, patch: Partial<PromoCard>) => {
    replaceSelectedPromo((promo) => ({
      ...promo,
      cards: promo.cards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)),
    }));
  };

  const addCard = () => {
    replaceSelectedPromo((promo) => ({ ...promo, cards: [...promo.cards, emptyCard()] }));
  };

  const removeCard = (index: number) => {
    replaceSelectedPromo((promo) => ({
      ...promo,
      cards: promo.cards.filter((_, cardIndex) => cardIndex !== index),
    }));
  };

  const createPromo = async () => {
    setCreating(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/promo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createDraftPromo(`Promo ${promos.length + 1}`)),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Could not create promo");
      }

      const nextPromo = {
        ...createDraftPromo(data.name || "New promo"),
        ...data,
        cards: Array.isArray(data?.cards) && data.cards.length ? data.cards : [emptyCard(), emptyCard()],
      };

      setPromos((prev) => [nextPromo, ...prev]);
      setSelectedPromoId(nextPromo.id);
      setMessage("New promo created.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not create promo.");
    } finally {
      setCreating(false);
    }
  };

  const saveSelected = async () => {
    if (!selectedPromo?.id) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...selectedPromo,
        cards: selectedPromo.cards.filter((card) => card.title.trim()),
      };

      const res = await fetch(`${API}/promo/${selectedPromo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Could not save promo");
      }

      const updatedPromo = {
        ...createDraftPromo(data.name || "New promo"),
        ...data,
        cards: Array.isArray(data?.cards) && data.cards.length ? data.cards : [emptyCard(), emptyCard()],
      };

      setPromos((prev) =>
        prev
          .map((promo) => {
            if (promo.id === updatedPromo.id) {
              return updatedPromo;
            }

            if (updatedPromo.enabled) {
              return { ...promo, enabled: false };
            }

            return promo;
          })
          .sort((a, b) => Number(new Date(b.updatedAt || 0)) - Number(new Date(a.updatedAt || 0)))
      );

      setMessage(updatedPromo.enabled ? "Promo saved and set live." : "Promo saved.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not save promo.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedPromo?.id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${selectedPromo.name}"?`);
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/promo/${selectedPromo.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Could not delete promo");
      }

      setPromos((prev) => {
        const next = prev.filter((promo) => promo.id !== selectedPromo.id);
        setSelectedPromoId(next[0]?.id || "");
        return next;
      });
      setMessage("Promo removed.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not remove promo.");
    } finally {
      setDeleting(false);
    }
  };

  const setPromoLive = async (promoId: string) => {
    const promo = promos.find((entry) => entry.id === promoId);
    if (!promo) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/promo/${promoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...promo, enabled: true, cards: promo.cards.filter((card) => card.title.trim()) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Could not set promo live");
      }

      setPromos((prev) =>
        prev.map((entry) => {
          if (entry.id === promoId) {
            return {
              ...createDraftPromo(data.name || "New promo"),
              ...data,
              cards: Array.isArray(data?.cards) && data.cards.length ? data.cards : [emptyCard(), emptyCard()],
            };
          }

          return { ...entry, enabled: false };
        })
      );
      setSelectedPromoId(promoId);
      setMessage("Promo is now live.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not set promo live.");
    } finally {
      setSaving(false);
    }
  };

  const uploadAsset = async (file: File | null) => {
    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API}/promo/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Could not upload promo image");
    }

    if (typeof data?.file === "string" && data.file.trim()) {
      return `/uploads/${data.file.trim()}`;
    }

    return normalizeStoredAssetPath(String(data?.url || ""));
  };

  const uploadCardImage = async (index: number, file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingCardIndex(index);
    setMessage("");

    try {
      const url = await uploadAsset(file);
      if (!url) {
        throw new Error("Could not upload promo image");
      }

      updateCard(index, { iconUrl: url });
      setMessage("Promo card image uploaded.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not upload promo image.");
    } finally {
      setUploadingCardIndex(null);
    }
  };

  const uploadPopupImage = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingPopupIcon(true);
    setMessage("");

    try {
      const url = await uploadAsset(file);
      if (!url) {
        throw new Error("Could not upload promo image");
      }

      updateSelectedPromo({ popupIconUrl: url });
      setMessage("Popup product icon uploaded.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Could not upload promo image.");
    } finally {
      setUploadingPopupIcon(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">Promo library</div>
          <h1 className="text-4xl font-semibold tracking-tight">Homepage promos</h1>
          <p>Create many promos, keep drafts inactive, and switch one live whenever you want.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={createPromo}
            disabled={creating || loading}
            className="admin-button admin-button-secondary"
          >
            {creating ? "Creating..." : "New promo"}
          </button>
          <button
            type="button"
            onClick={saveSelected}
            disabled={saving || loading || !selectedPromo}
            className="admin-button admin-button-primary"
          >
            {saving ? "Saving..." : "Save promo"}
          </button>
        </div>
      </section>

      {loading ? (
        <section className="admin-card p-6">
          <p className="text-sm text-[var(--muted)]">Loading promo library...</p>
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="admin-card p-4 xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Saved promos</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Choose which promo should go live on the site.</p>
              </div>
              <span className="admin-badge">{promos.length}</span>
            </div>

            <div className="space-y-3">
              {promos.length ? (
                promos.map((promo) => {
                  const isSelected = promo.id === selectedPromoId;

                  return (
                    <button
                      key={promo.id}
                      type="button"
                      onClick={() => setSelectedPromoId(promo.id)}
                      className={`w-full rounded-[1.3rem] border p-4 text-left transition ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-white shadow-[0_18px_40px_rgba(17,17,17,0.14)]"
                          : "border-[var(--line)] bg-white hover:border-[#d9dce1] hover:bg-[#fbfbfd]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold">{promo.name || "Untitled promo"}</p>
                          <p className={`mt-1 line-clamp-2 text-sm ${isSelected ? "text-white/72" : "text-[var(--muted)]"}`}>
                            {promo.message || "No banner message yet."}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            promo.enabled
                              ? isSelected
                                ? "bg-white text-[#111111]"
                                : "bg-[#eefaf1] text-[#1f8a45]"
                              : isSelected
                                ? "bg-white/12 text-white"
                                : "bg-[#f4f5f7] text-[#7a818c]"
                          }`}
                        >
                          {promo.enabled ? "Live" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className={`truncate text-xs ${isSelected ? "text-white/66" : "text-[var(--muted)]"}`}>
                          {promo.ctaLabel || promo.popupTitle || "No CTA label"}
                        </span>
                        {!promo.enabled ? (
                          <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-[#111111]"}`}>
                            Set live
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[1.3rem] border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
                  No promos yet. Create the first one to get started.
                </div>
              )}
            </div>
          </aside>

          {selectedPromo ? (
            <div className="space-y-5">
              <section className="admin-card p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Selected promo</p>
                      <h2 className="mt-2 text-3xl font-semibold">{selectedPromo.name || "Untitled promo"}</h2>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={selectedPromo.name}
                        onChange={(e) => updateSelectedPromo({ name: e.target.value })}
                        placeholder="Promo name"
                        className="admin-input"
                      />
                      <input
                        value={selectedPromo.badgeText}
                        onChange={(e) => updateSelectedPromo({ badgeText: e.target.value })}
                        placeholder="Badge text"
                        className="admin-input"
                      />
                    </div>

                    <input
                      value={selectedPromo.message}
                      onChange={(e) => updateSelectedPromo({ message: e.target.value })}
                      placeholder="Banner message"
                      className="admin-input"
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={selectedPromo.ctaLabel}
                        onChange={(e) => updateSelectedPromo({ ctaLabel: e.target.value })}
                        placeholder="CTA label"
                        className="admin-input"
                      />
                      <input
                        value={selectedPromo.ctaUrl}
                        onChange={(e) => updateSelectedPromo({ ctaUrl: e.target.value })}
                        placeholder="Optional external URL"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="admin-card p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">Live on homepage</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">Only one promo can be live at a time.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedPromo.enabled}
                          onChange={(e) => updateSelectedPromo({ enabled: e.target.checked })}
                          className="h-5 w-5 accent-[#111111]"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {!selectedPromo.enabled ? (
                          <button
                            type="button"
                            onClick={() => void setPromoLive(selectedPromo.id)}
                            className="admin-button admin-button-primary"
                          >
                            Set live now
                          </button>
                        ) : (
                          <span className="admin-badge">Currently live</span>
                        )}

                        <button
                          type="button"
                          onClick={deleteSelected}
                          disabled={deleting}
                          className="admin-button admin-button-secondary"
                        >
                          {deleting ? "Removing..." : "Delete promo"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="admin-card p-5">
                <div className="admin-page-header px-0 pb-4 pt-0">
                  <div>
                    <h2 className="text-2xl font-semibold">Popup content</h2>
                    <p>Make the popup easy to manage with a product icon, title, badge, and promo cards.</p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    value={selectedPromo.popupTitle}
                    onChange={(e) => updateSelectedPromo({ popupTitle: e.target.value })}
                    placeholder="Popup title"
                    className="admin-input"
                  />
                  <input
                    value={selectedPromo.popupBadge}
                    onChange={(e) => updateSelectedPromo({ popupBadge: e.target.value })}
                    placeholder="Popup badge"
                    className="admin-input"
                  />
                  <input
                    value={selectedPromo.popupSubtitle}
                    onChange={(e) => updateSelectedPromo({ popupSubtitle: e.target.value })}
                    placeholder="Popup subtitle"
                    className="admin-input"
                  />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <label className="admin-input flex cursor-pointer items-center justify-between gap-3">
                    <span className="truncate text-sm text-[var(--muted)]">
                      {uploadingPopupIcon
                        ? "Uploading popup icon..."
                        : selectedPromo.popupIconUrl
                          ? "Replace popup header icon"
                          : "Upload popup header icon"}
                    </span>
                    <span className="admin-badge">Choose file</span>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        void uploadPopupImage(e.target.files?.[0] || null);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <select
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      updateSelectedPromo({ popupIconUrl: `/uploads/${e.target.value}` });
                      e.currentTarget.value = "";
                    }}
                    className="admin-select"
                  >
                    <option value="">Use uploaded icon</option>
                    {icons.map((icon) => (
                      <option key={icon.id} value={icon.file}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                  <label className="admin-card p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">Popup opens on click</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">Turn off if the banner should only link out.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedPromo.popupEnabled}
                        onChange={(e) => updateSelectedPromo({ popupEnabled: e.target.checked })}
                        className="h-5 w-5 accent-[#111111]"
                      />
                    </div>
                  </label>

                  <div className="rounded-[1.3rem] border border-[var(--line)] bg-[#fbfbfd] p-4">
                    <p className="text-sm font-semibold">Popup header preview</p>
                    <div className="mt-3 flex items-center gap-3 rounded-[1.1rem] bg-white p-3">
                      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[0.95rem] bg-[#f4f6fb]">
                        {selectedPromo.popupIconUrl ? (
                          <img
                            src={resolveAssetPreviewUrl(selectedPromo.popupIconUrl)}
                            alt={selectedPromo.popupTitle || "Popup icon"}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-[#d7dbe2]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#171717]">
                          {selectedPromo.popupTitle || "Promo title"}
                        </p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {selectedPromo.popupSubtitle || "Small subtitle appears here"}
                        </p>
                      </div>
                      {selectedPromo.popupBadge ? <span className="admin-badge ml-auto">{selectedPromo.popupBadge}</span> : null}
                    </div>
                  </div>
                </div>
              </section>

              <section className="admin-card p-5">
                <div className="admin-page-header px-0 pb-4 pt-0">
                  <div>
                    <h2 className="text-2xl font-semibold">Popup cards</h2>
                    <p>Add one or more promo cards. Each one can have its own icon, text, and button link.</p>
                  </div>
                  <button type="button" onClick={addCard} className="admin-button admin-button-secondary">
                    Add card
                  </button>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {selectedPromo.cards.map((card, index) => (
                    <article key={index} className="admin-card p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold">Card {index + 1}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCard(index, emptyCard())}
                            className="admin-button admin-button-secondary"
                          >
                            Clear
                          </button>
                          {selectedPromo.cards.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removeCard(index)}
                              className="admin-button admin-button-secondary"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <input
                          value={card.title}
                          onChange={(e) => updateCard(index, { title: e.target.value })}
                          placeholder="Card title"
                          className="admin-input"
                        />
                        <input
                          value={card.subtitle}
                          onChange={(e) => updateCard(index, { subtitle: e.target.value })}
                          placeholder="Card subtitle"
                          className="admin-input"
                        />

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                          <label className="admin-input flex cursor-pointer items-center justify-between gap-3">
                            <span className="truncate text-sm text-[var(--muted)]">
                              {uploadingCardIndex === index
                                ? "Uploading card icon..."
                                : card.iconUrl
                                  ? "Replace card icon"
                                  : "Upload card icon"}
                            </span>
                            <span className="admin-badge">Choose file</span>
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                              className="hidden"
                              onChange={(e) => {
                                void uploadCardImage(index, e.target.files?.[0] || null);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>

                          <select
                            value=""
                            onChange={(e) => {
                              if (!e.target.value) return;
                              updateCard(index, { iconUrl: `/uploads/${e.target.value}` });
                              e.currentTarget.value = "";
                            }}
                            className="admin-select"
                          >
                            <option value="">Use uploaded icon</option>
                            {icons.map((icon) => (
                              <option key={icon.id} value={icon.file}>
                                {icon.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            value={card.buttonLabel}
                            onChange={(e) => updateCard(index, { buttonLabel: e.target.value })}
                            placeholder="Button label"
                            className="admin-input"
                          />
                          <input
                            value={card.buttonUrl}
                            onChange={(e) => updateCard(index, { buttonUrl: e.target.value })}
                            placeholder="Button URL"
                            className="admin-input"
                          />
                        </div>

                        <div className="rounded-[1.2rem] border border-[var(--line)] bg-[#f8f9fb] p-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-[0.95rem] bg-white">
                              {card.iconUrl ? (
                                <img
                                  src={resolveAssetPreviewUrl(card.iconUrl)}
                                  alt={card.title || "Promo icon"}
                                  className="h-9 w-9 object-contain"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full bg-[#d7dbe2]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#171717]">
                                {card.title || `Card ${index + 1}`}
                              </p>
                              <p className="truncate text-xs text-[var(--muted)]">
                                {card.subtitle || "Small line for version or platform"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {message ? (
                <section className="admin-card p-4">
                  <p className="text-sm font-medium text-[#111111]">{message}</p>
                </section>
              ) : null}
            </div>
          ) : (
            <section className="admin-card p-8">
              <p className="text-sm text-[var(--muted)]">Choose a promo from the left or create a new one.</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
