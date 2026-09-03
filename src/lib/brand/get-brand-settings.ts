import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { fontCssVar } from "@/config/font-options";
import { siteConfig, type SiteConfig } from "@/config/site-config";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicEnvironment, isSupabaseConfigured } from "@/lib/supabase/env";

function publicClient() {
  const { url, anonKey } = getSupabasePublicEnvironment();
  return createSupabaseClient<Database>(url, anonKey, { auth: { persistSession: false } });
}

type ProcessStep = SiteConfig["content"]["obrador"]["process"][number];
type ValueItem = SiteConfig["content"]["nosotros"]["values"]["items"][number];
type CraftFeature = SiteConfig["content"]["home"]["craft"]["features"][number];
type SubscriptionStep = SiteConfig["content"]["subscriptions"]["steps"][number];

function str(raw: unknown, fallback: string): string {
  return typeof raw === "string" && raw.trim() !== "" ? raw : fallback;
}

function array<T>(raw: unknown, fallback: readonly T[]): T[] {
  return Array.isArray(raw) && raw.length > 0 ? (raw as T[]) : [...fallback];
}

async function loadBrandSettings(): Promise<SiteConfig> {
  if (!isSupabaseConfigured()) return siteConfig;

  const db = publicClient();
  const { data } = await db.from("app_settings").select("key,value").like("key", "marca.%");
  const raw = new Map((data ?? []).map((row) => [row.key, row.value]));
  const get = (key: string, fallback: string) => str(raw.get(key), fallback);

  const base = siteConfig;

  return {
    ...base,
    brand: {
      ...base.brand,
      name: get("marca.brand_name", base.brand.name),
      shortName: get("marca.brand_short_name", base.brand.shortName),
      tagline: get("marca.brand_tagline", base.brand.tagline),
      logo: get("marca.brand_logo", base.brand.logo),
      icon: get("marca.brand_icon", base.brand.icon),
      appleIcon: get("marca.brand_apple_icon", base.brand.appleIcon),
      colors: {
        ...base.brand.colors,
        primary: get("marca.color_primary", base.brand.colors.primary),
        secondary: get("marca.color_secondary", base.brand.colors.secondary),
        background: get("marca.color_background", base.brand.colors.background),
        accent: get("marca.color_accent", base.brand.colors.accent),
      },
      fonts: {
        display: fontCssVar(raw.get("marca.font_display") as string | undefined, base.brand.fonts.display),
        body: fontCssVar(raw.get("marca.font_body") as string | undefined, base.brand.fonts.body),
      },
    },
    business: {
      ...base.business,
      email: get("marca.business_email", base.business.email),
      phone: get("marca.business_phone", base.business.phone),
      whatsapp: get("marca.business_whatsapp", base.business.whatsapp),
      instagram: get("marca.business_instagram", base.business.instagram),
      address: get("marca.business_address", base.business.address),
      city: get("marca.business_city", base.business.city),
      province: get("marca.business_province", base.business.province),
      postalCode: get("marca.business_postal_code", base.business.postalCode),
      country: get("marca.business_country", base.business.country),
    },
    content: {
      ...base.content,
      hero: {
        ...base.content.hero,
        title: get("marca.content_hero_title", base.content.hero.title),
        description: get("marca.content_hero_description", base.content.hero.description),
      },
      home: {
        ...base.content.home,
        craft: {
          ...base.content.home.craft,
          features: array<CraftFeature>(raw.get("marca.content_home_craft_features"), base.content.home.craft.features),
        },
      },
      obrador: {
        ...base.content.obrador,
        intro: {
          ...base.content.obrador.intro,
          title: get("marca.content_obrador_intro_title", base.content.obrador.intro.title),
          description: get("marca.content_obrador_intro_description", base.content.obrador.intro.description),
        },
        process: array<ProcessStep>(raw.get("marca.content_obrador_process"), base.content.obrador.process),
        cta: {
          ...base.content.obrador.cta,
          title: get("marca.content_obrador_cta_title", base.content.obrador.cta.title),
        },
      },
      nosotros: {
        ...base.content.nosotros,
        intro: {
          ...base.content.nosotros.intro,
          title: get("marca.content_nosotros_intro_title", base.content.nosotros.intro.title),
          description: get("marca.content_nosotros_intro_description", base.content.nosotros.intro.description),
        },
        values: {
          ...base.content.nosotros.values,
          title: get("marca.content_nosotros_values_title", base.content.nosotros.values.title),
          description: get("marca.content_nosotros_values_description", base.content.nosotros.values.description),
          items: array<ValueItem>(raw.get("marca.content_nosotros_values_items"), base.content.nosotros.values.items),
        },
        cta: {
          ...base.content.nosotros.cta,
          title: get("marca.content_nosotros_cta_title", base.content.nosotros.cta.title),
          description: get("marca.content_nosotros_cta_description", base.content.nosotros.cta.description),
        },
      },
      reservation: {
        ...base.content.reservation,
        seo: {
          ...base.content.reservation.seo,
          title: get("marca.content_reservation_seo_title", base.content.reservation.seo.title),
          description: get("marca.content_reservation_seo_description", base.content.reservation.seo.description),
        },
      },
      subscriptions: {
        ...base.content.subscriptions,
        name: get("marca.content_subscriptions_name", base.content.subscriptions.name),
        intro: {
          ...base.content.subscriptions.intro,
          title: get("marca.content_subscriptions_intro_title", base.content.subscriptions.intro.title),
          description: get("marca.content_subscriptions_intro_description", base.content.subscriptions.intro.description),
        },
        steps: array<SubscriptionStep>(raw.get("marca.content_subscriptions_steps"), base.content.subscriptions.steps),
      },
      newsletter: {
        ...base.content.newsletter,
        title: get("marca.content_newsletter_title", base.content.newsletter.title),
        description: get("marca.content_newsletter_description", base.content.newsletter.description),
      },
      footer: {
        ...base.content.footer,
        description: get("marca.content_footer_description", base.content.footer.description),
        legalName: get("marca.content_footer_legal_name", base.content.footer.legalName),
      },
      images: {
        ...base.content.images,
        hero: get("marca.image_hero", base.content.images.hero),
        obrador: get("marca.image_obrador", base.content.images.obrador),
        obradorProcess: get("marca.image_obrador_process", base.content.images.obradorProcess),
        team: get("marca.image_team", base.content.images.team),
        institutional: get("marca.image_institutional", base.content.images.institutional),
        subscriptions: get("marca.image_subscriptions", base.content.images.subscriptions),
      },
    },
    seo: {
      ...base.seo,
      title: get("marca.seo_title", base.seo.title),
      description: get("marca.seo_description", base.seo.description),
      socialImage: get("marca.image_social", base.seo.socialImage),
    },
  };
}

// unstable_cache exige el runtime completo de Next (incremental cache), que
// no existe fuera de una app Next real: en Vitest se llama la función sin
// envolver para que los tests que importan manifest.ts/seo.ts/etc. no
// revienten con "incrementalCache missing".
export const getBrandSettings = process.env.VITEST
  ? loadBrandSettings
  : unstable_cache(loadBrandSettings, ["brand-settings"], {
      revalidate: 300,
      tags: ["brand-settings"],
    });
