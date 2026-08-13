const { JWT } = require("google-auth-library");
const SeoSnapshot = require("../models/seoSnapshot.model");

const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const AUTO_SOURCE_TOKEN = "google-auto";
const AUTO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

let autoSyncStarted = false;
let syncInFlight = false;

const clean = (value) => String(value || "").trim();

const normalizeKey = (value) => String(value || "").replace(/\\n/g, "\n").trim();

const buildSnapshotDate = (snapshotKey) => new Date(`${snapshotKey}T12:00:00.000Z`);

const buildAutoSnapshotKey = () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().slice(0, 10);
};

const readServiceAccount = () => {
  const rawJson = clean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      const clientEmail = clean(parsed.client_email);
      const privateKey = normalizeKey(parsed.private_key);

      if (!clientEmail || !privateKey) {
        return {
          serviceAccount: null,
          parseError: "Google service account JSON is missing client_email or private_key.",
        };
      }

      return {
        serviceAccount: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        parseError: "",
      };
    } catch (error) {
      return {
        serviceAccount: null,
        parseError: "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.",
      };
    }
  }

  const clientEmail = clean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
  );
  const privateKey = normalizeKey(
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY
  );

  if (!clientEmail && !privateKey) {
    return {
      serviceAccount: null,
      parseError: "",
    };
  }

  if (!clientEmail || !privateKey) {
    return {
      serviceAccount: null,
      parseError: "Google service account email or private key is incomplete.",
    };
  }

  return {
    serviceAccount: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    parseError: "",
  };
};

const getGoogleSeoConfig = () => {
  const { serviceAccount, parseError } = readServiceAccount();
  const searchConsoleSiteUrl = clean(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY
  );
  const analyticsPropertyId = clean(
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.GA4_PROPERTY_ID
  );

  return {
    serviceAccount,
    parseError,
    searchConsoleSiteUrl,
    analyticsPropertyId,
  };
};

const getGoogleSeoStatus = () => {
  const config = getGoogleSeoConfig();
  const missing = [];

  if (config.parseError) {
    missing.push(config.parseError);
  }

  if (!config.serviceAccount) {
    missing.push("Google service account credentials");
  }

  if (!config.searchConsoleSiteUrl) {
    missing.push("Search Console site URL");
  }

  if (!config.analyticsPropertyId) {
    missing.push("Analytics property ID");
  }

  return {
    configured: missing.length === 0,
    missing,
    serviceAccountEmail: clean(config.serviceAccount?.client_email),
    searchConsoleSiteUrl: config.searchConsoleSiteUrl,
    analyticsPropertyId: config.analyticsPropertyId,
    autoSnapshotDate: buildAutoSnapshotKey(),
    message:
      missing.length === 0
        ? "Google auto sync is ready. Search Console and Analytics can now fill your daily snapshot."
        : `Auto sync needs: ${missing.join(", ")}.`,
  };
};

const createGoogleClient = (serviceAccount) =>
  new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: [SEARCH_CONSOLE_SCOPE, ANALYTICS_SCOPE],
  });

const getAccessToken = async (serviceAccount) => {
  const client = createGoogleClient(serviceAccount);
  const tokenResult = await client.getAccessToken();
  const accessToken =
    typeof tokenResult === "string"
      ? tokenResult
      : tokenResult?.token || tokenResult?.access_token || "";

  if (!accessToken) {
    const error = new Error("Could not create a Google access token.");
    error.status = 500;
    throw error;
  }

  return accessToken;
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || data?.message || `Google request failed with ${response.status}.`
    );
    error.status = response.status >= 400 && response.status < 500 ? 400 : 500;
    error.details = data;
    throw error;
  }

  return data;
};

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mergeSources = (...sources) => {
  const unique = new Set();

  sources.forEach((source) => {
    clean(source)
      .split("+")
      .map((part) => clean(part))
      .filter(Boolean)
      .forEach((part) => unique.add(part));
  });

  return unique.size ? Array.from(unique).join("+") : AUTO_SOURCE_TOKEN;
};

const hasAutoSource = (source) =>
  clean(source)
    .split("+")
    .map((part) => clean(part))
    .includes(AUTO_SOURCE_TOKEN);

const pullSearchConsoleMetrics = async (snapshotKey, headers, siteUrl) => {
  const data = await fetchJson(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        startDate: snapshotKey,
        endDate: snapshotKey,
        aggregationType: "byProperty",
        rowLimit: 1,
      }),
    }
  );

  const row = Array.isArray(data?.rows) ? data.rows[0] : null;

  return {
    organicClicks: numberValue(row?.clicks),
    organicImpressions: numberValue(row?.impressions),
    avgPosition: Number(numberValue(row?.position).toFixed(2)),
  };
};

const pullAnalyticsMetrics = async (snapshotKey, headers, propertyId) => {
  const data = await fetchJson(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: snapshotKey, endDate: snapshotKey }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      }),
    }
  );

  const metricValues = Array.isArray(data?.rows?.[0]?.metricValues) ? data.rows[0].metricValues : [];

  return {
    users: numberValue(metricValues[0]?.value),
    sessions: numberValue(metricValues[1]?.value),
  };
};

const assertConfigured = () => {
  const status = getGoogleSeoStatus();

  if (!status.configured) {
    const error = new Error(status.message);
    error.status = 400;
    throw error;
  }

  return getGoogleSeoConfig();
};

const syncGoogleSeoSnapshot = async ({ snapshotKey = buildAutoSnapshotKey() } = {}) => {
  const config = assertConfigured();
  const accessToken = await getAccessToken(config.serviceAccount);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const [searchConsoleMetrics, analyticsMetrics, existingSnapshot] = await Promise.all([
    pullSearchConsoleMetrics(snapshotKey, headers, config.searchConsoleSiteUrl),
    pullAnalyticsMetrics(snapshotKey, headers, config.analyticsPropertyId),
    SeoSnapshot.findOne({ snapshotKey }).lean(),
  ]);

  const snapshot = await SeoSnapshot.findOneAndUpdate(
    { snapshotKey },
    {
      $set: {
        snapshotKey,
        snapshotDate: buildSnapshotDate(snapshotKey),
        source: mergeSources(existingSnapshot?.source, AUTO_SOURCE_TOKEN),
        organicClicks: searchConsoleMetrics.organicClicks,
        organicImpressions: searchConsoleMetrics.organicImpressions,
        avgPosition: searchConsoleMetrics.avgPosition,
        users: analyticsMetrics.users,
        sessions: analyticsMetrics.sessions,
        backlinks: numberValue(existingSnapshot?.backlinks),
        referringDomains: numberValue(existingSnapshot?.referringDomains),
        indexedPages: numberValue(existingSnapshot?.indexedPages),
        notes: clean(existingSnapshot?.notes),
      },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
      returnDocument: "after",
    }
  );

  return snapshot;
};

const runDailyGoogleSeoSync = async () => {
  if (syncInFlight) {
    return { skipped: true, reason: "sync-in-progress" };
  }

  const status = getGoogleSeoStatus();

  if (!status.configured) {
    return { skipped: true, reason: "not-configured" };
  }

  const snapshotKey = buildAutoSnapshotKey();
  const existing = await SeoSnapshot.findOne({ snapshotKey }).select("source").lean();

  if (existing && hasAutoSource(existing.source)) {
    return { skipped: true, reason: "already-synced" };
  }

  syncInFlight = true;

  try {
    const snapshot = await syncGoogleSeoSnapshot({ snapshotKey });
    return { skipped: false, snapshotKey: snapshot.snapshotKey, snapshot };
  } finally {
    syncInFlight = false;
  }
};

const startGoogleSeoAutoSync = () => {
  if (autoSyncStarted) {
    return;
  }

  autoSyncStarted = true;

  setTimeout(() => {
    runDailyGoogleSeoSync().catch((error) => {
      console.error("Initial Google SEO sync failed:", error.message);
    });
  }, 15_000);

  setInterval(() => {
    runDailyGoogleSeoSync().catch((error) => {
      console.error("Scheduled Google SEO sync failed:", error.message);
    });
  }, AUTO_SYNC_INTERVAL_MS);
};

module.exports = {
  AUTO_SOURCE_TOKEN,
  buildAutoSnapshotKey,
  getGoogleSeoStatus,
  hasAutoSource,
  startGoogleSeoAutoSync,
  syncGoogleSeoSnapshot,
};
