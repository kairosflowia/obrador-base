import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { BrandImage } from "@/components/media/brand-image";
import { siteConfig } from "@/config/site-config";
import { Container, Section } from "@/components/ui";
import { ArchOvenIcon, ClockIcon, JarIcon, WheatIcon } from "@/components/ui/icons";
import { createPageMetadata } from "@/lib/seo";

const PROCESS_ICONS = { starter: JarIcon, time: ClockIcon, oven: ArchOvenIcon, grain: WheatIcon } as const;

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.content.obrador.seo.title,
  description: siteConfig.content.obrador.seo.description,
  path: "/obrador",
  ogTitle: siteConfig.content.obrador.seo.ogTitle,
  ogDescription: siteConfig.content.obrador.seo.ogDescription,
});

export default function ObradorPage() {
  const content = siteConfig.content.obrador;
  return (
    <main id="main-content" className="home-theme obrador-page">
      {/* 1. Hero */}
      <section className="obrador-hero">
        <div className="obrador-hero__text">
          <Breadcrumbs items={[{ label: "El obrador" }]} />
          <p className="eyebrow">{content.intro.eyebrow}</p>
          <h1>{content.intro.title}</h1>
          <p>{content.intro.description}</p>
        </div>
        <div className="obrador-hero__media">
          <BrandImage
            src={siteConfig.content.images.obrador}
            fallbackSrc="/brand/obrador/obrador-placeholder.svg"
            alt={content.intro.imageAlt}
            fill
            sizes="(min-width: 64rem) 65vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
      </section>

      {/* 2. Los 4 pasos del proceso */}
      <Section tone="sunken" className="obrador-steps-section">
        <Container size="wide" className="container--home">
          <div className="obrador-steps">
            {content.process.map(({ number, title, description, icon }) => {
              const Icon = PROCESS_ICONS[icon];
              return (
              <article key={number} className="obrador-step">
                <div className="obrador-step__body">
                  <span className="obrador-step__number">{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="obrador-step__icon" aria-hidden="true"><Icon width={46} height={46} /></span>
              </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. Por qué hay una cantidad limitada */}
      <section className="obrador-editorial">
        <div className="obrador-editorial__text">
          <h2>{content.production.title}</h2>
          {content.production.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <h3>{content.production.secondaryTitle}</h3>
          {content.production.secondaryParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="obrador-editorial__media">
          <BrandImage
            src={siteConfig.content.images.obradorProcess}
            fallbackSrc="/brand/obrador/obrador-placeholder.svg"
            alt={content.production.imageAlt}
            fill
            sizes="(min-width: 64rem) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* 4. CTA oscuro */}
      <Section className="obrador-cta-section">
        <Container size="wide" className="container--home">
          <div className="obrador-cta">
            <div className="obrador-cta__text">
              <p className="eyebrow">{content.cta.eyebrow}</p>
              <h2>{content.cta.title}</h2>
              {siteConfig.features.onlineOrders ? <Link className="button button--primary" href="/reserva-y-recoge">{content.cta.action}</Link> : null}
            </div>
            <div className="obrador-cta__media">
              <BrandImage
                src={siteConfig.content.images.institutional}
                fallbackSrc="/brand/institutional/institutional-placeholder.svg"
                alt={content.cta.imageAlt}
                width={800}
                height={800}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Newsletter: el bloque del footer, justo antes del grid, ya cumple este paso — evita duplicar el formulario. */}
    </main>
  );
}
