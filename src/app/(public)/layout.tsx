import type { ReactNode } from "react";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PwaRegister } from "@/components/pwa/pwa-register";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const siteConfig = await getBrandSettings();
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    description: siteConfig.seo.description,
    inLanguage: "es-ES",
    url: siteConfig.seo.siteUrl,
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <PublicHeader />
      {children}
      <PublicFooter />
      <InstallPrompt />
      <PwaRegister />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}
