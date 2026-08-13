"use client";

export type ReleaseItem = {
  version?: string;
  updatedAt?: string;
  createdAt?: string;
};

export const FALLBACK_RELEASE_VERSION = "1.0.0";

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

function compareVersions(a?: string, b?: string) {
  const aParts = parseVersionParts(a);
  const bParts = parseVersionParts(b);

  if (!aParts || !bParts) {
    return 0;
  }

  const maxLength = Math.max(aParts.length, bParts.length);
  for (let index = 0; index < maxLength; index += 1) {
    const left = aParts[index] ?? 0;
    const right = bParts[index] ?? 0;
    if (left !== right) {
      return left - right;
    }
  }

  return 0;
}

function getReleaseTimestamp(release?: ReleaseItem) {
  const value = release?.updatedAt || release?.createdAt;
  const timestamp = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getLatestRelease(releases: unknown): ReleaseItem | null {
  if (!Array.isArray(releases) || releases.length === 0) {
    return null;
  }

  const safeReleases = releases.filter(
    (item): item is ReleaseItem => Boolean(item && typeof item === "object"),
  );

  if (safeReleases.length === 0) {
    return null;
  }

  return [...safeReleases].sort((left, right) => {
    const versionDiff = compareVersions(right.version, left.version);
    if (versionDiff !== 0) {
      return versionDiff;
    }

    return getReleaseTimestamp(right) - getReleaseTimestamp(left);
  })[0] ?? null;
}

export function getReleaseVersion(release?: ReleaseItem | null) {
  return release?.version || FALLBACK_RELEASE_VERSION;
}

export function getReleaseKey(release?: ReleaseItem | null) {
  return (
    release?.updatedAt ||
    release?.createdAt ||
    release?.version ||
    FALLBACK_RELEASE_VERSION
  );
}
