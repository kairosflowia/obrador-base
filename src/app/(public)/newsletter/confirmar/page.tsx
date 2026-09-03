import type { Metadata } from "next";

import { NewsletterConfirmForm } from "@/components/public/newsletter-confirm-form";
import { PageIntro } from "@/components/public/page-intro";
import { Alert, Container, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Confirmar suscripción", description: siteConfig.content.newsletter.confirmation.seoDescription, path: "/newsletter/confirmar" });

export default async function ConfirmNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const content = siteConfig.content.newsletter.confirmation;

  return (
    <main id="main-content">
      <PageIntro eyebrow={content.eyebrow} title={content.title} description={content.description} />
      <Section>
        <Container className="auth-layout">
          {token ? (
            <NewsletterConfirmForm token={token} />
          ) : (
            <Alert variant="error" title="Enlace no válido">Falta el código de confirmación. Revisa el enlace que recibiste por correo.</Alert>
          )}
        </Container>
      </Section>
    </main>
  );
}
