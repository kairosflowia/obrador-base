import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.shortName,
    description: siteConfig.seo.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: siteConfig.brand.colors.background,
    theme_color: siteConfig.brand.colors.background,
    lang: "es-ES",
    categories: ["food", "shopping"],
    icons: [
      { src: siteConfig.brand.icon, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: siteConfig.brand.icon, sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: siteConfig.brand.appleIcon, sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
