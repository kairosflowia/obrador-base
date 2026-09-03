import type { Metadata } from "next";
import Link from "next/link";

import { EditorialGrid, ValueCard } from "@/components/public/editorial";
import { BrandImage } from "@/components/media/brand-image";
import { siteConfig } from "@/config/site-config";
import { PageIntro } from "@/components/public/page-intro";
import { Container, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.content.nosotros.seo.title,
  description: siteConfig.content.nosotros.seo.description,
  path: "/nosotros",
  ogTitle: siteConfig.content.nosotros.seo.ogTitle,
  ogDescription: siteConfig.content.nosotros.seo.ogDescription,
});

export default function NosotrosPage() {
  const content = siteConfig.content.nosotros;
  return (
    <main id="main-content">
      <Section><Container size="wide">
        <PageIntro {...content.intro} />
        <div className="people-section people-section--intro">
          <div><h2>{content.team.title}</h2>{content.team.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <BrandImage src={siteConfig.content.images.team} fallbackSrc="/brand/team/team-placeholder.svg" alt={content.team.imageAlt} width={1200} height={800} priority sizes="(max-width: 767px) 100vw, 42vw" />
        </div>
      </Container></Section>
      <Section tone="sunken"><Container size="wide" className="split-section">
        <div><p className="eyebrow">{content.place.eyebrow}</p><h2>{content.place.title}</h2></div>
        <div>{content.place.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </Container></Section>
      <Section><Container size="wide">
        <h2 className="section-title">{content.values.title}</h2>
        <p className="section-lead">{content.values.description}</p>
        <EditorialGrid columns={4}>
          {content.values.items.map((item) => <ValueCard key={item.title} title={item.title} tone={item.tone}>{item.description}</ValueCard>)}
        </EditorialGrid>
      </Container></Section>
      <Section tone="inverse"><Container size="wide" className="cta-band"><div><p className="eyebrow">{content.cta.eyebrow}</p><h2>{content.cta.title}</h2><p>{content.cta.description}</p></div><div className="hero-actions">{siteConfig.features.onlineOrders ? <Link className="button button--primary" href="/reserva-y-recoge">{content.cta.primaryAction}</Link> : null}{siteConfig.features.pickupPoints ? <Link className="button button--secondary button--inverse" href="/donde-estamos">{content.cta.secondaryAction}</Link> : null}</div></Container></Section>
    </main>
  );
}
