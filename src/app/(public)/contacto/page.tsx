import type { Metadata } from "next";

import { Container, Section } from "@/components/ui/layout";
import { ContactForm } from "@/components/public/contact-form";
import { PageIntro } from "@/components/public/page-intro";
import { createPageMetadata } from "@/lib/seo";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return createPageMetadata({
    title: siteConfig.content.contact.seo.title,
    description: siteConfig.content.contact.seo.description,
    path: "/contacto",
  });
}

export default async function ContactoPage() {
  const siteConfig = await getBrandSettings();
  const content = siteConfig.content.contact;
  return (
    <main id="main-content">
      <PageIntro
        {...content.intro}
      />
      <Section>
        <Container className="institutional-grid">
          <div className="prose-block">
            <h2>{content.body.title}</h2>
            <p>
              {content.body.description}
              {siteConfig.business.email ? <> {content.body.emailPrefix}{" "}<a href={`mailto:${siteConfig.business.email}`}>{siteConfig.business.email}</a>.</> : null}
            </p>
          </div>
          <ContactForm />
        </Container>
      </Section>
    </main>
  );
}
