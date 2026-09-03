import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { siteConfig } from "@/config/site-config";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { BrandProvider } from "@/components/brand/brand-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { CookieConsent } from "@/components/privacy/cookie-consent";

import "./globals.css";

const fraunces = localFont({
  src: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const playfairDisplay = localFont({
  src: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-playfair-display",
  display: "swap",
  weight: "100 900",
});

const lora = localFont({
  src: "../../node_modules/@fontsource-variable/lora/files/lora-latin-wght-normal.woff2",
  variable: "--font-lora",
  display: "swap",
  weight: "100 900",
});

const dmSans = localFont({
  src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 900",
});

const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "100 900",
});

const spaceGrotesk = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
  weight: "100 900",
});

const workSans = localFont({
  src: "../../node_modules/@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2",
  variable: "--font-work-sans",
  display: "swap",
  weight: "100 900",
});

const brandFontVariables = `${fraunces.variable} ${inter.variable} ${playfairDisplay.variable} ${lora.variable} ${dmSans.variable} ${manrope.variable} ${spaceGrotesk.variable} ${workSans.variable}`;

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return {
    metadataBase: new URL(siteConfig.seo.siteUrl),
    title: { default: siteConfig.seo.title, template: `%s · ${siteConfig.brand.name}` },
    description: siteConfig.seo.description,
    applicationName: siteConfig.brand.name,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "default", title: siteConfig.brand.shortName },
    formatDetection: { telephone: false },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: siteConfig.brand.name,
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      images: [{ url: siteConfig.seo.socialImage, alt: siteConfig.brand.name }],
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const siteConfig = await getBrandSettings();
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: siteConfig.brand.colors.background,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteConfig = await getBrandSettings();
  const brandStyles = {
    "--brand-background": siteConfig.brand.colors.background,
    "--brand-foreground": siteConfig.brand.colors.foreground,
    "--brand-primary": siteConfig.brand.colors.primary,
    "--brand-primary-hover": siteConfig.brand.colors.primaryHover,
    "--brand-accent": siteConfig.brand.colors.accent,
    "--brand-secondary": siteConfig.brand.colors.secondary,
    "--brand-surface": siteConfig.brand.colors.surface,
    "--brand-surface-sunken": siteConfig.brand.colors.surfaceSunken,
    "--brand-text-muted": siteConfig.brand.colors.textMuted,
    "--brand-success": siteConfig.brand.colors.success,
    "--brand-success-surface": siteConfig.brand.colors.successSurface,
    "--brand-warning": siteConfig.brand.colors.warning,
    "--brand-warning-surface": siteConfig.brand.colors.warningSurface,
    "--brand-error": siteConfig.brand.colors.error,
    "--brand-error-surface": siteConfig.brand.colors.errorSurface,
    "--brand-information": siteConfig.brand.colors.information,
    "--brand-information-surface": siteConfig.brand.colors.informationSurface,
    "--brand-border": siteConfig.brand.colors.border,
    "--brand-border-strong": siteConfig.brand.colors.borderStrong,
    "--brand-font-display": siteConfig.brand.fonts.display,
    "--brand-font-body": siteConfig.brand.fonts.body,
    "--brand-radius-small": siteConfig.brand.radius.small,
    "--brand-radius-medium": siteConfig.brand.radius.medium,
    "--brand-radius-large": siteConfig.brand.radius.large,
    "--brand-radius-pill": siteConfig.brand.radius.pill,
  } as CSSProperties;
  return (
    <html lang="es-ES">
      <body className={brandFontVariables} style={brandStyles}>
        <BrandProvider value={siteConfig}>
          <CartProvider>{children}</CartProvider>
          <CookieConsent />
        </BrandProvider>
      </body>
    </html>
  );
}
