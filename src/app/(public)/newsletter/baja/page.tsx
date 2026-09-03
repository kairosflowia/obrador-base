import type { Metadata } from "next";

import { NewsletterUnsubscribeForm } from "@/components/public/newsletter-unsubscribe-form";
import { PageIntro } from "@/components/public/page-intro";
import { Alert, Container, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Darse de baja", description: siteConfig.content.newsletter.unsubscribe.seoDescription, path: "/newsletter/baja" });

export default async function UnsubscribeNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const content = siteConfig.content.newsletter.unsubscribe;

  return (
    <main id="main-content">
      <PageIntro eyebrow={content.eyebrow} title={content.title} description={content.description} />
      <Section>
        <Container className="auth-layout">
          {token ? (
            <NewsletterUnsubscribeForm token={token} />
          ) : (
            <Alert variant="error" title="Enlace no válido">Falta el código de baja. Revisa el enlace que recibiste por correo.</Alert>
          )}
        </Container>
      </Section>
    </main>
  );
}
