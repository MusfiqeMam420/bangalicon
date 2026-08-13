const LOCAL_SITE_URL = "http://localhost:3000";
const PROD_SITE_URL = "https://bangalicon.com";
const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_API_URL = "https://api.bangalicon.com/api";

const normalizeUrl = (value: string) =>
  value.startsWith("http") ? value : `https://${value}`;

const isLocalHostname = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "0.0.0.0" ||
  hostname.endsWith(".local");

const isLocalUrl = (value: string) => {
  try {
    return isLocalHostname(new URL(normalizeUrl(value)).hostname);
  } catch {
    return false;
  }
};

const resolvePublicUrl = (envValue: string | undefined, localValue: string, prodValue: string) => {
  if (envValue) {
    const normalized = normalizeUrl(envValue);

    if (!(process.env.NODE_ENV === "production" && isLocalUrl(normalized))) {
      return normalized;
    }
  }

  if (typeof window !== "undefined") {
    return isLocalHostname(window.location.hostname) ? localValue : prodValue;
  }

  return process.env.NODE_ENV === "development" ? localValue : prodValue;
};

export const getPublicSiteUrl = () => {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  return resolvePublicUrl(envSiteUrl, LOCAL_SITE_URL, PROD_SITE_URL);
};

export const getPublicApiBase = () => {
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  return resolvePublicUrl(envApiUrl, LOCAL_API_URL, PROD_API_URL);
};

export const getPublicCdnBase = () => getPublicApiBase().replace(/\/api\/?$/, "");
