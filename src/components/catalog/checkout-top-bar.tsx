"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "@/components/ui/icons";
import { useBrand } from "@/components/brand/brand-provider";
import { BrandImage } from "@/components/media/brand-image";

export function CheckoutTopBar() {
  const siteConfig = useBrand();
  const router = useRouter();

  return (
    <header className="catalog-topbar">
      <button type="button" className="catalog-topbar__back" aria-label="Volver a la pantalla anterior" onClick={() => router.back()}>
        <ArrowLeftIcon />
      </button>
      <Link href="/" className="catalog-topbar__logo" aria-label={`${siteConfig.brand.name}, volver al inicio`}>
        <BrandImage src={siteConfig.brand.logo} fallbackSrc="/brand/logo/logo.svg" alt={siteConfig.brand.name} width={640} height={180} priority />
      </Link>
      <span className="catalog-topbar__spacer" aria-hidden="true" />
    </header>
  );
}
