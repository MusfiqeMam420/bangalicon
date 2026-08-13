import { getPublicApiBase } from "./runtime";

export const iconCssVersion =
  process.env.NEXT_PUBLIC_ICON_CSS_VERSION || "2026-08-11-live-font-refresh-2";

export const getFreeIconCssHref = () =>
  `${getPublicApiBase().replace(/\/api\/?$/, "")}/cdn/free/bangalicon-free.css?v=${iconCssVersion}`;
