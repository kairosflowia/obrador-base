import type { Metadata } from "next";
import Link from "next/link";

import { EditorialProductPreview, TextLink } from "@/components/public/editorial";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { WeeklySpecialBanner } from "@/components/public/weekly-special-banner";
import { ArchOvenIcon, CheckIcon, ClockIcon, JarIcon, WheatIcon } from "@/components/ui/icons";
import { BrandImage } from "@/components/media/brand-image";
import { Container, Section } from "@/components/ui";
import { formatPrice } from "@/lib/catalog-domain";
import { getPublicCatalog } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { SUBSCRIPTION_DISCOUNT_PERCENT, SUBSCRIPTION_DISCOUNT_THRESHOLD_UNITS } from "@/lib/subscriptions-domain";
import { getCurrentWeeklySpecial } from "@/lib/weekly-special";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return createPageMetadata({
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    path: "/",
    ogTitle: `${siteConfig.brand.name} — ${siteConfig.seo.title}`,
    ogDescription: siteConfig.content.home.seo.ogDescription,
  });
}

const CRAFT_ICONS: Record<string, typeof JarIcon> = { starter: JarIcon, time: ClockIcon, grain: WheatIcon, craft: ArchOvenIcon };

export default async function Home() {
  const siteConfig = await getBrandSettings();
  const content = siteConfig.content.home;
  const [catalog, weeklySpecial] = await Promise.all([
    siteConfig.features.catalog ? getPublicCatalog() : Promise.resolve([]),
    siteConfig.features.onlineOrders ? getCurrentWeeklySpecial() : Promise.resolve(null),
  ]);
  const dailyBreads = catalog.filter((p) => p.family?.slug === "panes-diarios").slice(0, 4);
  const dailyBreadPrices = dailyBreads
    .flatMap((product) => product.variants.filter((v) => v.status === "active" && v.price_cents !== null))
    .map((v) => v.price_cents!);
  const cheapestDailyPriceCents = dailyBreadPrices.length ? Math.min(...dailyBreadPrices) : null;
  const weeklyFromCents = cheapestDailyPriceCents !== null
    ? Math.round(cheapestDailyPriceCents * SUBSCRIPTION_DISCOUNT_THRESHOLD_UNITS * (1 - SUBSCRIPTION_DISCOUNT_PERCENT / 100))
    : null;

  return (
    <main id="main-content" className="home-theme">
      <HeroCarousel />

      {weeklySpecial ? (
        <Section>
          <Container size="wide" className="container--home">
            <WeeklySpecialBanner special={weeklySpecial} />
          </Container>
        </Section>
      ) : null}

      {siteConfig.features.catalog ? <Section className="home-section">
        <Container size="wide" className="container--home">
          <div className="section-heading-row">
            <h2>{content.catalog.title}</h2>
            <TextLink href="/reserva-y-recoge">{content.catalog.actionLabel}</TextLink>
          </div>
          <div className="editorial-grid editorial-grid--4 hoy-grid">
            {dailyBreads.map((product) => {
              const image = product.images.find((i) => i.is_primary) ?? product.images[0];
              const prices = product.variants.flatMap((v) => (v.price_cents === null ? [] : [v.price_cents]));
              return (
                <EditorialProductPreview
                  key={product.id}
                  href={`/reserva-y-recoge/${product.family?.slug}/${product.slug}`}
                  name={product.name}
                  description={product.short_description}
                  imagePath={image?.storage_path ?? null}
                  imageAlt={image?.alt_text ?? ""}
                  priceCents={prices.length ? Math.min(...prices) : null}
                />
              );
            })}
          </div>
        </Container>
      </Section> : null}

      <Section tone="sunken" className="home-section">
        <Container size="wide" className="container--home">
          <div className="craft-section">
            <div className="craft-section__left">
              <h2>{content.craft.title}</h2>
              <p className="craft-section__lead">{content.craft.description}</p>
              <div className="craft-features">
                {content.craft.features.map(({ icon, title, description }) => {
                  const Icon = CRAFT_ICONS[icon] ?? JarIcon;
                  return (
                  <div key={title} className="craft-feature">
                    <span className="craft-feature__icon" aria-hidden="true">
                      <Icon width={65} height={65} />
                    </span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  );
                })}
              </div>
            </div>
            <div className="craft-section__media">
              <BrandImage
                src={siteConfig.content.images.institutional}
                fallbackSrc="/brand/institutional/institutional-placeholder.svg"
                alt={content.craft.imageAlt}
                width={800}
                height={1000}
              />
            </div>
          </div>
        </Container>
      </Section>

      {siteConfig.features.subscriptions ? <Section className="habitual-section home-section">
        <Container size="wide" className="container--home">
          <div className="habitual-banner">
            <div className="habitual-banner__media">
              <BrandImage
                src={siteConfig.content.images.subscriptions}
                fallbackSrc="/brand/institutional/institutional-placeholder.svg"
                alt={content.subscriptions.imageAlt}
                width={1254}
                height={1254}
              />
            </div>
            <div className="habitual-banner__body">
              <p className="eyebrow">{siteConfig.content.subscriptions.name}</p>
              <h3>{content.subscriptions.title}</h3>
              <p>{content.subscriptions.description}</p>
              <ul className="habitual-banner__checklist">
                {content.subscriptions.benefits.map((benefit) => <li key={benefit}><CheckIcon width={16} height={16} aria-hidden="true" /> {benefit}</li>)}
              </ul>
            </div>
            <div className="habitual-banner__price">
              <p className="habitual-banner__price-label">{content.subscriptions.pricePrefix}</p>
              {weeklyFromCents !== null ? (
                <p className="habitual-banner__price-value">{formatPrice(weeklyFromCents)}<span>{content.subscriptions.priceSuffix}</span></p>
              ) : null}
              <p className="habitual-banner__price-note">{content.subscriptions.priceNote}</p>
              <Link className="button button--primary button--full" href="/plan-de-pan/membresias">{content.subscriptions.primaryAction}</Link>
              <Link className="text-link" href="/plan-de-pan">{content.subscriptions.secondaryAction}</Link>
            </div>
          </div>
        </Container>
      </Section> : null}
    </main>
  );
}
