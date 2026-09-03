import type { ReactNode } from "react";
import { siteConfig } from "@/config/site-config";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PwaRegister } from "@/components/pwa/pwa-register";

export default function PublicLayout({ children }: { children: ReactNode }) {
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
