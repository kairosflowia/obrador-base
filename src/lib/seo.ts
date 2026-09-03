import type { Metadata } from "next";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}

export async function createPageMetadata({
  title,
  description,
  path,
  ogTitle = title,
  ogDescription = description,
}: PageSeo): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
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
