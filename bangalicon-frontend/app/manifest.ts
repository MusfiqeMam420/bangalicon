import type { MetadataRoute } from "next";

import { defaultDescription, logoImage, siteName } from "./lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6f8",
    theme_color: "#db161b",
    icons: [
      {
        src: logoImage,
        type: "image/png",
      },
    ],
  };
}
