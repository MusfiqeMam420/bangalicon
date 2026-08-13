const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/$/, "");

const isBangaliconPublicHost = (hostname = "") => {
  const normalized = String(hostname || "").trim().toLowerCase();
  return normalized === "bangalicon.com" || normalized.endsWith(".bangalicon.com");
};

const isProduction = () => process.env.NODE_ENV === "production";

const normalizePublicUrl = (value) => {
  const normalized = normalizeBaseUrl(value);

  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);

    if (isProduction() && parsed.protocol === "http:" && isBangaliconPublicHost(parsed.hostname)) {
      parsed.protocol = "https:";

      if (parsed.port === "80") {
        parsed.port = "";
      }

      return parsed.toString().replace(/\/$/, "");
    }

    return normalized;
  } catch (error) {
    return normalized;
  }
};

const getBackendBaseUrl = () =>
  normalizePublicUrl(
    process.env.BACKEND_URL ||
      process.env.API_URL ||
      (isProduction() ? "https://api.bangalicon.com" : `http://localhost:${process.env.PORT || 5000}`)
  );

const getFrontendBaseUrl = () =>
  normalizePublicUrl(
    process.env.FRONTEND_URL || process.env.SITE_URL || (isProduction() ? "https://bangalicon.com" : "http://localhost:3000")
  );

const getAdminBaseUrl = () =>
  normalizePublicUrl(process.env.ADMIN_URL || (isProduction() ? "https://ctrl.bangalicon.com" : "http://localhost:3001"));

const getCdnBundleBaseUrl = (bundleKey = "free") => {
  if (bundleKey === "pro") {
    return normalizePublicUrl(process.env.CDN_PRO_PUBLIC_URL || `${getBackendBaseUrl()}/cdn/pro`);
  }

  return normalizePublicUrl(process.env.CDN_PUBLIC_URL || `${getBackendBaseUrl()}/cdn/free`);
};

module.exports = {
  normalizeBaseUrl,
  normalizePublicUrl,
  getBackendBaseUrl,
  getFrontendBaseUrl,
  getAdminBaseUrl,
  getCdnBundleBaseUrl,
};
