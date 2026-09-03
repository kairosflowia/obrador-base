import { contentConfig, type SiteContent } from "./content-config";
import { productPreset, productPresets, resolveFeatureFlags, type FeatureFlags } from "./feature-config";

const env = (value: string | undefined, fallback = "") => value?.trim() || fallback;
const envFlag = (value: string | undefined, fallback: boolean) => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return fallback;
};

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    logo: string;
    icon: string;
    appleIcon: string;
    colors: {
      background: string;
      foreground: string;
      primary: string;
      primaryHover: string;
      accent: string;
      secondary: string;
      surface: string;
      surfaceSunken: string;
      textMuted: string;
      success: string;
      successSurface: string;
      warning: string;
      warningSurface: string;
      error: string;
      errorSurface: string;
      information: string;
      informationSurface: string;
      border: string;
      borderStrong: string;
    };
    fonts: { display: string; body: string };
    radius: { small: string; medium: string; large: string; pill: string };
  };
  business: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    timezone: string;
  };
  content: Omit<SiteContent, "hero" | "footer"> & {
    hero: Omit<SiteContent["hero"], "title" | "description"> & { title: string; description: string };
    footer: Omit<SiteContent["footer"], "description" | "legalName"> & { description: string; legalName: string };
    images: {
      hero: string;
      obrador: string;
      obradorProcess: string;
      team: string;
      institutional: string;
      subscriptions: string;
      productFallback: string;
    };
  };
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    socialImage: string;
  };
  features: FeatureFlags;
  demoMode: boolean;
}

export const selectedProductPreset = productPreset(process.env.NEXT_PUBLIC_PRODUCT_PRESET);
const presetFeatures = productPresets[selectedProductPreset];

const requestedFeatures: FeatureFlags = {
  catalog: envFlag(process.env.NEXT_PUBLIC_FEATURE_CATALOG, presetFeatures.catalog),
  onlineOrders: envFlag(process.env.NEXT_PUBLIC_FEATURE_ONLINE_ORDERS, presetFeatures.onlineOrders),
  customerAccounts: envFlag(process.env.NEXT_PUBLIC_FEATURE_CUSTOMER_ACCOUNTS, presetFeatures.customerAccounts),
  payments: envFlag(process.env.NEXT_PUBLIC_FEATURE_PAYMENTS, presetFeatures.payments),
  inventory: envFlag(process.env.NEXT_PUBLIC_FEATURE_INVENTORY, presetFeatures.inventory),
  availability: envFlag(process.env.NEXT_PUBLIC_FEATURE_AVAILABILITY, presetFeatures.availability),
  production: envFlag(process.env.NEXT_PUBLIC_FEATURE_PRODUCTION, presetFeatures.production),
  pickupPoints: envFlag(process.env.NEXT_PUBLIC_FEATURE_PICKUP_POINTS, presetFeatures.pickupPoints),
  subscriptions: envFlag(process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS, presetFeatures.subscriptions),
  newsletter: envFlag(process.env.NEXT_PUBLIC_FEATURE_NEWSLETTER, presetFeatures.newsletter),
  analytics: envFlag(process.env.NEXT_PUBLIC_FEATURE_ANALYTICS, presetFeatures.analytics),
  notifications: envFlag(process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS, presetFeatures.notifications),
};

export const siteConfig: SiteConfig = {
  brand: {
    name: env(process.env.NEXT_PUBLIC_BRAND_NAME, "OBRADOR BASE"),
    shortName: env(process.env.NEXT_PUBLIC_BRAND_SHORT_NAME, "OBRADOR"),
    tagline: env(process.env.NEXT_PUBLIC_BRAND_TAGLINE, "Pan artesanal, hecho con tiempo"),
    logo: env(process.env.NEXT_PUBLIC_BRAND_LOGO, "/brand/logo/logo.svg"),
    icon: env(process.env.NEXT_PUBLIC_BRAND_ICON, "/icon"),
    appleIcon: env(process.env.NEXT_PUBLIC_BRAND_APPLE_ICON, "/apple-icon"),
    colors: {
      background: env(process.env.NEXT_PUBLIC_COLOR_BACKGROUND, "#f5f1e8"),
      foreground: env(process.env.NEXT_PUBLIC_COLOR_FOREGROUND, "#241d17"),
      primary: env(process.env.NEXT_PUBLIC_COLOR_PRIMARY, "#b97844"),
      primaryHover: env(process.env.NEXT_PUBLIC_COLOR_PRIMARY_HOVER, "#c28a52"),
      accent: env(process.env.NEXT_PUBLIC_COLOR_ACCENT, "#6f7b52"),
      secondary: env(process.env.NEXT_PUBLIC_COLOR_SECONDARY, "#ede8dc"),
      surface: env(process.env.NEXT_PUBLIC_COLOR_SURFACE, "#fffaf2"),
      surfaceSunken: env(process.env.NEXT_PUBLIC_COLOR_SURFACE_SUNKEN, "#ede8dc"),
      textMuted: env(process.env.NEXT_PUBLIC_COLOR_TEXT_MUTED, "#6f665d"),
      success: env(process.env.NEXT_PUBLIC_COLOR_SUCCESS, "#276a57"),
      successSurface: env(process.env.NEXT_PUBLIC_COLOR_SUCCESS_SURFACE, "#e3ede9"),
      warning: env(process.env.NEXT_PUBLIC_COLOR_WARNING, "#85600f"),
      warningSurface: env(process.env.NEXT_PUBLIC_COLOR_WARNING_SURFACE, "#fbefd2"),
      error: env(process.env.NEXT_PUBLIC_COLOR_ERROR, "#a32e17"),
      errorSurface: env(process.env.NEXT_PUBLIC_COLOR_ERROR_SURFACE, "#f6e2dc"),
      information: env(process.env.NEXT_PUBLIC_COLOR_INFORMATION, "#3c6086"),
      informationSurface: env(process.env.NEXT_PUBLIC_COLOR_INFORMATION_SURFACE, "#e4eaf1"),
      border: env(process.env.NEXT_PUBLIC_COLOR_BORDER, "rgba(72, 52, 35, 0.14)"),
      borderStrong: env(process.env.NEXT_PUBLIC_COLOR_BORDER_STRONG, "rgba(72, 52, 35, 0.24)"),
    },
    fonts: {
      display: env(process.env.NEXT_PUBLIC_FONT_DISPLAY, "var(--font-fraunces), Georgia, serif"),
      body: env(process.env.NEXT_PUBLIC_FONT_BODY, "var(--font-inter), Arial, sans-serif"),
    },
    radius: {
      small: env(process.env.NEXT_PUBLIC_RADIUS_SMALL, "0.25rem"),
      medium: env(process.env.NEXT_PUBLIC_RADIUS_MEDIUM, "0.5rem"),
      large: env(process.env.NEXT_PUBLIC_RADIUS_LARGE, "0.75rem"),
      pill: env(process.env.NEXT_PUBLIC_RADIUS_PILL, "999px"),
    },
  },
  business: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP),
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM),
    address: env(process.env.NEXT_PUBLIC_ADDRESS),
    city: env(process.env.NEXT_PUBLIC_CITY),
    province: env(process.env.NEXT_PUBLIC_PROVINCE),
    postalCode: env(process.env.NEXT_PUBLIC_POSTAL_CODE),
    country: env(process.env.NEXT_PUBLIC_COUNTRY, "España"),
    timezone: env(process.env.NEXT_PUBLIC_TIMEZONE, "Europe/Madrid"),
  },
  content: {
    ...contentConfig,
    hero: {
      ...contentConfig.hero,
      title: env(process.env.NEXT_PUBLIC_HERO_TITLE, contentConfig.hero.title),
      description: env(process.env.NEXT_PUBLIC_HERO_DESCRIPTION, contentConfig.hero.description),
    },
    footer: {
      ...contentConfig.footer,
      description: env(process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION, contentConfig.footer.description),
      legalName: env(process.env.NEXT_PUBLIC_LEGAL_NAME, contentConfig.footer.legalName),
    },
    images: {
      hero: env(process.env.NEXT_PUBLIC_IMAGE_HERO, "/brand/hero/hero-placeholder.svg"),
      obrador: env(process.env.NEXT_PUBLIC_IMAGE_OBRADOR, "/brand/obrador/obrador-placeholder.svg"),
      obradorProcess: env(process.env.NEXT_PUBLIC_IMAGE_OBRADOR_PROCESS, "/brand/obrador/obrador-placeholder.svg"),
      team: env(process.env.NEXT_PUBLIC_IMAGE_TEAM, "/brand/team/team-placeholder.svg"),
      institutional: env(process.env.NEXT_PUBLIC_IMAGE_INSTITUTIONAL, "/brand/institutional/institutional-placeholder.svg"),
      subscriptions: env(process.env.NEXT_PUBLIC_IMAGE_SUBSCRIPTIONS, "/brand/institutional/institutional-placeholder.svg"),
      productFallback: env(process.env.NEXT_PUBLIC_IMAGE_PRODUCT_FALLBACK, "/brand/products/product-placeholder.svg"),
    },
  },
  seo: {
    siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
    title: env(process.env.NEXT_PUBLIC_SEO_TITLE, "Obrador artesanal"),
    description: env(process.env.NEXT_PUBLIC_SEO_DESCRIPTION, "Pan artesanal elaborado en pequeñas tandas."),
    socialImage: env(process.env.NEXT_PUBLIC_SOCIAL_IMAGE, "/brand/social/social-placeholder.svg"),
  },
  features: resolveFeatureFlags(requestedFeatures),
  demoMode: envFlag(process.env.NEXT_PUBLIC_DEMO_MODE, false),
};
