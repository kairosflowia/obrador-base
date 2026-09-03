import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";

interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  ogTitle = title,
  ogDescription = description,
}: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: path,
      type: "website",
      locale: "es_ES",
      siteName: siteConfig.brand.name,
      images: [
        {
          url: siteConfig.seo.socialImage,
          alt: siteConfig.brand.name,
        },
      ],
    },
  };
}
