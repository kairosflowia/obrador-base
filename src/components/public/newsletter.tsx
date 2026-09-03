"use client";

import { useActionState } from "react";

import { subscribeToNewsletterAction, type NewsletterActionState } from "@/app/(public)/newsletter/actions";
import { Alert, Button, Checkbox, Input } from "@/components/ui";
import { siteConfig } from "@/config/site-config";

const initialState: NewsletterActionState = { status: "idle" };

export function Newsletter() {
  const content = siteConfig.content.newsletter;
  const [state, formAction, pending] = useActionState(subscribeToNewsletterAction, initialState);

  return (
    <div className="newsletter" aria-labelledby="newsletter-title">
      <div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="newsletter-title">{content.title}</h2>
        <p>{content.description}</p>
      </div>
      {state.status === "success" ? (
        <Alert variant="success" title="¡Listo!">{state.message}</Alert>
      ) : (
        <form action={formAction} className="newsletter__form">
          <Input id="newsletter-email" name="email" label="Tu correo" type="email" required autoComplete="email" />
          <Checkbox id="newsletter-consent" name="consent" label={content.consentLabel} description={content.consentDescription} required />
          <Button type="submit" loading={pending} loadingLabel="Enviando…">Suscribirme</Button>
          {state.status === "error" ? <Alert variant="error" title="No se ha podido completar">{state.message}</Alert> : null}
        </form>
      )}
    </div>
  );
}
