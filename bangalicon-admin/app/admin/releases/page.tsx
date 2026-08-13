"use client";

import { useEffect, useState } from "react";

type ReleaseEntry = {
  type: "add" | "fix" | "update";
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
};

type ReleaseNote = {
  id: string;
  version: string;
  monthLabel: string;
  entries: ReleaseEntry[];
};

type IconItem = {
  id: string;
  name: string;
  file: string;
  tags: string[];
  type: string;
  style: string;
};

const emptyEntry: ReleaseEntry = {
  type: "update",
  title: "",
  description: "",
  tags: [],
  imageUrl: "",
};

const FALLBACK_VERSION = "1.0.0";

function parseVersionParts(version?: string) {
  if (!version) {
    return null;
  }

  const cleaned = version.trim().replace(/^v/i, "");
  if (!/^\d+(\.\d+){0,2}$/.test(cleaned)) {
    return null;
  }

  return cleaned.split(".").map((part) => Number(part));
}

function compareVersions(left?: string, right?: string) {
  const leftParts = parseVersionParts(left);
  const rightParts = parseVersionParts(right);

  if (!leftParts && !rightParts) {
    return 0;
  }

  if (!leftParts) {
    return -1;
  }

  if (!rightParts) {
    return 1;
  }

  const maxLength = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] ?? 0;
    const rightValue = rightParts[index] ?? 0;
    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }

  return 0;
}

function getLatestVersion(releases: ReleaseNote[]) {
  return (
    [...releases]
      .map((release) => release.version)
      .filter(Boolean)
      .sort((left, right) => compareVersions(right, left))[0] || FALLBACK_VERSION
  );
}

function getNextVersion(version?: string) {
  const parts = parseVersionParts(version) ?? [1, 0, 0];
  const normalized = [parts[0] ?? 1, parts[1] ?? 0, parts[2] ?? 0];
  normalized[2] += 1;
  return normalized.join(".");
}

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function ReleasesPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const BASE_URL = API.replace(/\/api\/?$/, "");

  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [iconsLoading, setIconsLoading] = useState(false);
  const [version, setVersion] = useState("");
  const [monthLabel, setMonthLabel] = useState("");
  const [versionTouched, setVersionTouched] = useState(false);
  const [monthTouched, setMonthTouched] = useState(false);
  const [entry, setEntry] = useState<ReleaseEntry>(emptyEntry);
  const [selectedIconId, setSelectedIconId] = useState("");

  const fetchReleases = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/releases`, { cache: "no-store" });
      const data = await res.json();
      setReleases(Array.isArray(data) && res.ok ? data : []);
    } catch (error) {
      console.error(error);
      setReleases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIcons = async () => {
    setIconsLoading(true);

    try {
      const res = await fetch(`${API}/icons`, { cache: "no-store" });
      const data = await res.json();

      setIcons(
        Array.isArray(data) && res.ok
          ? data.map((icon) => ({
              id: String(icon.id || icon._id || icon.name || ""),
              name: String(icon.name || ""),
              file: String(icon.file || ""),
              tags: Array.isArray(icon.tags) ? icon.tags : [],
              type: String(icon.type || "free"),
              style: String(icon.style || "regular"),
            }))
          : []
      );
    } catch (error) {
      console.error(error);
      setIcons([]);
    } finally {
      setIconsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
    fetchIcons();
  }, []);

  useEffect(() => {
    if (!versionTouched) {
      setVersion(getNextVersion(getLatestVersion(releases)));
    }

    if (!monthTouched) {
      setMonthLabel(getCurrentMonthLabel());
    }
  }, [releases, versionTouched, monthTouched]);

  useEffect(() => {
    const handleFocus = () => {
      fetchIcons();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchIcons();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const applyIconToEntry = (iconId: string) => {
    setSelectedIconId(iconId);

    const icon = icons.find((item) => item.id === iconId);
    if (!icon) return;

    const imageUrl = `${BASE_URL}/uploads/${icon.file}`;

    setEntry((prev) => ({
      ...prev,
      title: prev.title || `Added ${icon.name}`,
      description:
        prev.description || `${icon.name} is now available in the Bangalicon library.`,
      tags: prev.tags.length ? prev.tags : icon.tags,
      imageUrl,
    }));
  };

  const addReleaseEntry = async () => {
    if (!version.trim() || !monthLabel.trim() || !entry.title.trim() || !entry.description.trim()) {
      return;
    }

    setSaving(true);

    try {
      await fetch(`${API}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version,
          monthLabel,
          type: entry.type,
          title: entry.title,
          description: entry.description,
          tags: entry.tags.join(", "),
          imageUrl: entry.imageUrl || "",
        }),
      });

      setVersionTouched(false);
      setMonthTouched(false);
      setEntry(emptyEntry);
      setSelectedIconId("");
      fetchReleases();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const removeRelease = async (id: string) => {
    if (!confirm("Delete this release note version?")) return;

    try {
      await fetch(`${API}/releases/${id}`, {
        method: "DELETE",
      });

      fetchReleases();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">Product updates</div>
          <h1 className="text-4xl font-semibold tracking-tight">Release notes</h1>
          <p>Add simple notes, tags, and images for the changelog shown on the frontend.</p>
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)]">
              <span>Version</span>
              <button
                type="button"
                onClick={() => {
                  setVersionTouched(false);
                  setVersion(getNextVersion(getLatestVersion(releases)));
                }}
                className="text-[#121212] transition hover:text-[#CA1016]"
              >
                Auto-fill next version
              </button>
            </div>
            <input
              value={version}
              onChange={(e) => {
                setVersionTouched(true);
                setVersion(e.target.value);
              }}
              placeholder="Version, for example 3.2.0"
              className="admin-input"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)]">
              <span>Month label</span>
              <button
                type="button"
                onClick={() => {
                  setMonthTouched(false);
                  setMonthLabel(getCurrentMonthLabel());
                }}
                className="text-[#121212] transition hover:text-[#CA1016]"
              >
                Use current month
              </button>
            </div>
            <input
              value={monthLabel}
              onChange={(e) => {
                setMonthTouched(true);
                setMonthLabel(e.target.value);
              }}
              placeholder="Month label, for example August 2026"
              className="admin-input"
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[180px_1fr]">
          <select
            value={entry.type}
            onChange={(e) => setEntry((prev) => ({ ...prev, type: e.target.value as ReleaseEntry["type"] }))}
            className="admin-select"
          >
            <option value="add">Add</option>
            <option value="fix">Fix</option>
            <option value="update">Update</option>
          </select>
          <input
            value={entry.title}
            onChange={(e) => setEntry((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Short note title"
            className="admin-input"
          />
        </div>

        <div className="mt-3 grid gap-3">
          <textarea
            value={entry.description}
            onChange={(e) => setEntry((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="What changed?"
            className="admin-input min-h-[120px] resize-y"
          />

          <input
            value={entry.tags.join(", ")}
            onChange={(e) =>
              setEntry((prev) => ({
                ...prev,
                tags: e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Tags separated by commas"
            className="admin-input"
          />

          <input
            value={entry.imageUrl || ""}
            onChange={(e) => setEntry((prev) => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="Optional image URL"
            className="admin-input"
          />
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-[var(--line)] bg-[#f8f9fb] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#121212]">Attach uploaded icon</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Pick any uploaded icon and it will be used as the release note image automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (icons.length) {
                  applyIconToEntry(icons[0].id);
                }
              }}
              disabled={!icons.length}
              className="admin-button admin-button-secondary"
            >
              Use latest icon
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <select
              value={selectedIconId}
              onChange={(e) => applyIconToEntry(e.target.value)}
              className="admin-select"
            >
              <option value="">{iconsLoading ? "Loading icons..." : "Select uploaded icon"}</option>
              {icons.map((icon) => (
                <option key={icon.id} value={icon.id}>
                  {icon.name} · {icon.type} · {icon.style}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchIcons}
              className="admin-button admin-button-secondary"
            >
              Refresh icons
            </button>

            {selectedIconId ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedIconId("");
                  setEntry((prev) => ({ ...prev, imageUrl: "" }));
                }}
                className="admin-button admin-button-secondary"
              >
                Clear icon
              </button>
            ) : null}
          </div>
        </div>

        {entry.imageUrl ? (
          <div className="mt-4 rounded-[1.4rem] border border-[var(--line)] bg-[#f8f9fb] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--muted)]">Image preview</p>
            <img
              src={entry.imageUrl}
              alt="Release preview"
              className="max-h-48 rounded-2xl border border-[var(--line)] object-cover"
            />
          </div>
        ) : null}

        <div className="mt-4">
          <button onClick={addReleaseEntry} disabled={saving} className="admin-button admin-button-primary">
            {saving ? "Saving..." : "Add release note"}
          </button>
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="admin-page-header border-b border-[var(--line)] p-5">
          <div>
            <h2 className="text-2xl font-semibold">Current release notes</h2>
            <p>{releases.length} version groups available on the frontend.</p>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-[var(--muted)]">Loading release notes...</p>
        ) : releases.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No release notes yet.</p>
        ) : (
          <div className="space-y-4 p-5">
            {releases.map((release) => (
              <article key={release.id} className="rounded-[1.6rem] border border-[var(--line)] bg-[#fbfbfc] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="admin-badge bg-[#2F6FED] text-white">v{release.version}</span>
                    <span className="text-sm text-[var(--muted)]">{release.monthLabel}</span>
                  </div>

                  <button onClick={() => removeRelease(release.id)} className="admin-button admin-button-danger">
                    Delete version
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {release.entries.map((item, index) => (
                    <div key={`${release.id}-${index}`} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{item.type}</p>
                      <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>

                      {item.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={`${release.id}-${index}-${tag}`}
                              className="rounded-full border border-[var(--line)] bg-[#f8f9fb] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="mt-4 max-h-56 rounded-2xl border border-[var(--line)] object-cover"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
