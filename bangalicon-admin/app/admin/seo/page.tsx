"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Globe2,
  MousePointerClick,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

type SeoSnapshot = {
  id: string;
  snapshotDate: string;
  source: string;
  sessions: number;
  users: number;
  organicClicks: number;
  organicImpressions: number;
  avgPosition: number;
  createdAt: string | null;
  updatedAt: string | null;
};

type SeoStatus = {
  configured: boolean;
  missing: string[];
  serviceAccountEmail: string;
  searchConsoleSiteUrl: string;
  analyticsPropertyId: string;
  autoSnapshotDate: string | null;
  latestSnapshotDate: string | null;
  latestAutoSnapshotDate: string | null;
  message: string;
};

const defaultStatus: SeoStatus = {
  configured: false,
  missing: [],
  serviceAccountEmail: "",
  searchConsoleSiteUrl: "",
  analyticsPropertyId: "",
  autoSnapshotDate: null,
  latestSnapshotDate: null,
  latestAutoSnapshotDate: null,
  message:
    "Add Google Search Console and Analytics credentials in the backend to turn auto sync on.",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value || 0);

const formatDelta = (current: number, previous: number) => {
  const delta = current - previous;

  if (delta > 0) {
    return { tone: "up" as const, label: `+${formatCompact(delta)} vs previous` };
  }

  if (delta < 0) {
    return { tone: "down" as const, label: `${formatCompact(delta)} vs previous` };
  }

  return { tone: "flat" as const, label: "No change vs previous" };
};

const hasAutoSource = (source: string) =>
  String(source || "")
    .split("+")
    .map((part) => part.trim())
    .includes("google-auto");

export default function SeoPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [snapshots, setSnapshots] = useState<SeoSnapshot[]>([]);
  const [status, setStatus] = useState<SeoStatus>(defaultStatus);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [available, setAvailable] = useState(true);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  const loadSnapshots = async () => {
    setLoading(true);

    try {
      try {
        const statusRes = await fetch(`${API}/seo/status`, { cache: "no-store" });

        if (statusRes.ok) {
          const nextStatus = await statusRes.json();
          setStatus({ ...defaultStatus, ...nextStatus });
        } else {
          const nextStatus = await statusRes.json().catch(() => ({}));
          setStatus({
            ...defaultStatus,
            message: nextStatus?.message || defaultStatus.message,
          });
        }
      } catch (error) {
        console.error(error);
        setStatus({
          ...defaultStatus,
          message: "Could not reach the Google sync status yet.",
        });
      }

      const res = await fetch(`${API}/seo`, { cache: "no-store" });

      if (!res.ok) {
        setAvailable(false);
        setSnapshots([]);
        return;
      }

      const data = await res.json();
      setAvailable(true);
      setSnapshots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setAvailable(false);
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API]);

  const latest = snapshots[0] || null;
  const previous = snapshots[1] || null;

  const statCards = useMemo(() => {
    const current = latest || {
      organicClicks: 0,
      organicImpressions: 0,
      users: 0,
      sessions: 0,
    };
    const earlier = previous || {
      organicClicks: 0,
      organicImpressions: 0,
      users: 0,
      sessions: 0,
    };

    return [
      {
        label: "Organic clicks",
        value: current.organicClicks,
        delta: formatDelta(current.organicClicks, earlier.organicClicks),
        icon: MousePointerClick,
      },
      {
        label: "Impressions",
        value: current.organicImpressions,
        delta: formatDelta(current.organicImpressions, earlier.organicImpressions),
        icon: Search,
      },
      {
        label: "Users",
        value: current.users,
        delta: formatDelta(current.users, earlier.users),
        icon: BarChart3,
      },
      {
        label: "Sessions",
        value: current.sessions,
        delta: formatDelta(current.sessions, earlier.sessions),
        icon: Globe2,
      },
    ];
  }, [latest, previous]);

  const handleSync = async () => {
    setSyncing(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/seo/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snapshotDate: status.autoSnapshotDate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessageTone("error");
        setMessage(data?.message || "Could not sync Google data yet.");
        return;
      }

      setMessageTone("success");
      setMessage(
        data?.message || "Google SEO data synced. Your latest search and traffic numbers are ready."
      );
      await loadSnapshots();
    } catch (error) {
      console.error(error);
      setMessageTone("error");
      setMessage("Could not connect to the Google sync route right now.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">SEO tracker</div>
          <h1 className="text-4xl font-semibold tracking-tight">Google SEO auto sync</h1>
          <p>
            This page now runs in full automatic mode. Bangalicon pulls search and traffic numbers
            from Google Search Console and Google Analytics for the latest finished day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`admin-badge ${
              status.configured
                ? "bg-[rgba(15,138,68,0.08)] text-[#0f8a44]"
                : "bg-[rgba(201,21,27,0.08)] text-[var(--accent)]"
            }`}
          >
            {status.configured ? "Auto connected" : "Needs setup"}
          </span>
          <span className="admin-badge">Google only</span>
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="admin-badge mb-3">Automatic source</div>
            <h2 className="text-2xl font-semibold">Search Console + Analytics</h2>
            <p className="mt-2 max-w-3xl">
              Once connected, this section fills clicks, impressions, users, sessions, and average
              position without any manual input.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="admin-badge">
              Auto day {status.autoSnapshotDate ? formatDate(status.autoSnapshotDate) : "not ready"}
            </span>
            <button
              type="button"
              className="admin-button admin-button-primary"
              disabled={!status.configured || syncing}
              onClick={handleSync}
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Syncing..." : "Sync Google now"}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <article className="rounded-[1.15rem] border border-[var(--line)] bg-[#fbfbfc] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  Service account
                </p>
                <p className="mt-2 break-all text-sm leading-6 text-[#111111]">
                  {status.serviceAccountEmail || "Not connected yet"}
                </p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--line)] bg-white text-[#111111]">
                <ShieldCheck size={18} />
              </div>
            </div>
          </article>

          <article className="rounded-[1.15rem] border border-[var(--line)] bg-[#fbfbfc] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Search Console
            </p>
            <p className="mt-2 break-all text-sm leading-6 text-[#111111]">
              {status.searchConsoleSiteUrl || "Add GOOGLE_SEARCH_CONSOLE_SITE_URL"}
            </p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Source for clicks, impressions, and average position.
            </p>
          </article>

          <article className="rounded-[1.15rem] border border-[var(--line)] bg-[#fbfbfc] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Analytics property
            </p>
            <p className="mt-2 text-sm leading-6 text-[#111111]">
              {status.analyticsPropertyId || "Add GOOGLE_ANALYTICS_PROPERTY_ID"}
            </p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Source for sessions and active users.
            </p>
          </article>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-[1.15rem] border border-[var(--line)] bg-[#fbfbfc] p-4">
          <div className="flex flex-wrap items-center gap-2">
            {status.latestAutoSnapshotDate ? (
              <span className="admin-badge">
                Latest auto snapshot {formatDate(status.latestAutoSnapshotDate)}
              </span>
            ) : null}

            {status.latestSnapshotDate ? (
              <span className="admin-badge">Latest saved snapshot {formatDate(status.latestSnapshotDate)}</span>
            ) : null}
          </div>

          <p className="text-sm leading-6 text-[var(--muted)]">
            {status.message}
            {!status.configured && status.missing.length ? ` Missing: ${status.missing.join(", ")}.` : ""}
          </p>

          {message ? (
            <p className={`text-sm ${messageTone === "error" ? "text-[var(--accent)]" : "text-[#0f8a44]"}`}>
              {message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const toneClasses =
            card.delta.tone === "up"
              ? "text-[#0f8a44]"
              : card.delta.tone === "down"
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]";

          return (
            <article key={card.label} className="admin-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--muted)]">{card.label}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{formatCompact(card.value)}</h2>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--line)] bg-[#fafafb] text-[#111111]">
                  <Icon size={18} />
                </div>
              </div>

              <p className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${toneClasses}`}>
                {card.delta.tone === "up" ? (
                  <ArrowUpRight size={14} />
                ) : card.delta.tone === "down" ? (
                  <ArrowDownRight size={14} />
                ) : null}
                <span>{card.delta.label}</span>
              </p>
            </article>
          );
        })}
      </section>

      <section className="admin-card p-5">
        <div className="admin-page-header border-b border-[var(--line)] pb-4">
          <div>
            <h2 className="text-2xl font-semibold">Recent sync history</h2>
            <p>Latest automatic SEO entries, newest first.</p>
          </div>

          <div className="admin-badge">
            {snapshots.length} {snapshots.length === 1 ? "snapshot" : "snapshots"}
          </div>
        </div>

        {!available ? (
          <p className="pt-5 text-sm text-[var(--muted)]">
            The SEO route is not reachable right now. Once the backend is available, your tracker
            will appear here.
          </p>
        ) : loading ? (
          <p className="pt-5 text-sm text-[var(--muted)]">Loading history...</p>
        ) : snapshots.length === 0 ? (
          <p className="pt-5 text-sm text-[var(--muted)]">
            No auto snapshots yet. Connect Google and run your first sync.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {snapshots.map((snapshot) => (
              <article
                key={snapshot.id}
                className="rounded-[1.15rem] border border-[var(--line)] bg-[#fbfbfc] p-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="admin-badge">{formatDate(snapshot.snapshotDate)}</div>
                    {hasAutoSource(snapshot.source) ? (
                      <div className="admin-badge bg-[rgba(15,138,68,0.08)] text-[#0f8a44]">
                        Google auto
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2 xl:grid-cols-5">
                    <p>
                      <span className="font-semibold text-[#111111]">
                        {formatCompact(snapshot.organicClicks)}
                      </span>{" "}
                      clicks
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">
                        {formatCompact(snapshot.organicImpressions)}
                      </span>{" "}
                      impressions
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">{formatCompact(snapshot.users)}</span>{" "}
                      users
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">
                        {formatCompact(snapshot.sessions)}
                      </span>{" "}
                      sessions
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">{snapshot.avgPosition || 0}</span>{" "}
                      avg position
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
