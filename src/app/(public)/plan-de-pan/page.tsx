import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/public/editorial";
import { BrandImage } from "@/components/media/brand-image";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { PageIntro } from "@/components/public/page-intro";
import { CalendarIcon, PackageIcon, WheatIcon } from "@/components/ui/icons";
import { Container, Section } from "@/components/ui";
import { FREQUENCY_DESCRIPTIONS_ES, FREQUENCY_LABELS_ES, type SubscriptionFrequency } from "@/lib/subscriptions-domain";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return createPageMetadata({
    title: siteConfig.content.subscriptions.seo.title,
    description: siteConfig.content.subscriptions.seo.description,
    path: "/plan-de-pan",
  });
}

const STEP_ICONS: Record<string, typeof WheatIcon> = { grain: WheatIcon, calendar: CalendarIcon, package: PackageIcon };

const FREQUENCIES: SubscriptionFrequency[] = ["weekly", "biweekly", "every_3_weeks", "monthly"];
const FEATURED_FREQUENCY: SubscriptionFrequency = "biweekly";

export default async function PlanDePanLanding() {
  const siteConfig = await getBrandSettings();
  const content = siteConfig.content.subscriptions;
  return (
    <main id="main-content">
      <Section>
        <Container size="wide">
          <div className="plan-hero">
            <div className="plan-hero__copy">
              <PageIntro
                eyebrow={content.intro.eyebrow}
                title={content.intro.title}
                description={content.intro.description}
              />
              <Link className="button button--primary plan-hero__cta" href="/plan-de-pan/membresias">{content.intro.action}</Link>
            </div>
            <div className="plan-hero__media">
              <BrandImage
                src={siteConfig.content.images.subscriptions}
                fallbackSrc="/brand/institutional/institutional-placeholder.svg"
                alt={content.intro.imageAlt}
                width={1280}
                height={960}
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container size="wide">
          <SectionHeading {...content.processHeading} />
          <div className="plan-steps">
            {content.steps.map(({ icon, title, description }) => {
              const Icon = STEP_ICONS[icon] ?? WheatIcon;
              return (
              <article key={title} className="plan-step">
                <span className="plan-step__icon" aria-hidden="true"><Icon /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
              );
            })}
          </div>
          <p>
            <Link href="/donde-estamos">{content.pickupAction}</Link>
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <SectionHeading {...content.frequencyHeading} />
          <div className="plan-frequency-grid">
            {FREQUENCIES.map((frequency) => {
              const featured = frequency === FEATURED_FREQUENCY;
              return (
                <Link
                  key={frequency}
                  href={`/plan-de-pan/membresias?frecuencia=${frequency}`}
                  className={`plan-frequency-card${featured ? " plan-frequency-card--featured" : ""}${frequency === "monthly" ? " plan-frequency-card--wide" : ""}`}
                >
                  {featured ? <span className="plan-frequency-card__popular">Popular</span> : null}
                  <span className="plan-frequency-card__content">
                    <span className="plan-frequency-card__number" aria-hidden="true">{String(FREQUENCIES.indexOf(frequency) + 1).padStart(2, "0")}</span>
                    <span className="plan-frequency-card__title">{FREQUENCY_LABELS_ES[frequency]}</span>
                    <span className="plan-frequency-card__description">{FREQUENCY_DESCRIPTIONS_ES[frequency]}</span>
                  </span>
                  <span className="plan-frequency-card__action">Seleccionar</span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container size="wide">
          <SectionHeading {...content.catalogHeading} />
          <Link className="button button--primary" href="/plan-de-pan/membresias">{content.catalogAction}</Link>
        </Container>
      </Section>
    </main>
  );
}
