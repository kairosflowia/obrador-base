import { siteConfig } from "@/config/site-config";

/** @deprecated Usa siteConfig. Mantido temporariamente para compatibilidade. */
export const site = {
  name: siteConfig.brand.name,
  description: siteConfig.seo.description,
  locale: "es_ES",
  contactEmail: siteConfig.business.email,
  phone: siteConfig.business.phone,
} as const;
