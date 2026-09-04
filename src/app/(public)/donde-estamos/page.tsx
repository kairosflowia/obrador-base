import Link from "next/link";

import { Card, EmptyState } from "@/components/ui";
import { Container, Section } from "@/components/ui/layout";
import { PageIntro } from "@/components/public/page-intro";
import { LocationMap } from "@/components/public/location-map";
import {
  PICKUP_EXCEPTION_TYPE_LABELS_ES,
  PICKUP_POINT_STATUS_LABELS_ES,
  WEEKDAY_LABELS_ES,
  directionsUrl,
  getPublicPickupPoints,
  mainBakery,
} from "@/lib/pickup-points";
import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return createPageMetadata({
    title: siteConfig.content.location.seo.title,
    description: siteConfig.content.location.seo.description,
    path: "/donde-estamos",
  });
}

function timeRange(start: string | null, end: string | null) {
  if (!start || !end) return null;
  return `${start.slice(0, 5)}–${end.slice(0, 5)}`;
}

export default async function DondeEstamosPage() {
  const siteConfig = await getBrandSettings();
  const content = siteConfig.content.location;
  const { points } = await getPublicPickupPoints();
  const bakery = mainBakery(points);
  const ordered = [...points].sort((a, b) => {
    if (a.is_main_bakery !== b.is_main_bakery) return a.is_main_bakery ? -1 : 1;
    return a.display_order - b.display_order;
  });

  return (
    <main id="main-content">
      <PageIntro
        eyebrow={content.intro.eyebrow}
        title={content.intro.title}
        description={
          bakery
            ? content.intro.withPoints
            : content.intro.withoutPoints
        }
      />

      {ordered.length ? (
        <Section>
          <Container>
            <div className="editorial-grid editorial-grid--two">
              {ordered.map((point) => {
                const link = directionsUrl(point);
                const address = [point.address_line_1, point.address_line_2].filter(Boolean).join(", ");
                const windowsByDay = WEEKDAY_LABELS_ES.map((label, i) => {
                  const weekday = i + 1;
                  const dayWindows = point.collectionWindows.filter((w) => w.weekday === weekday);
                  return { label, ranges: dayWindows.map((w) => timeRange(w.starts_at, w.ends_at)).filter(Boolean) };
                }).filter((day) => day.ranges.length);
                const generalHours = WEEKDAY_LABELS_ES.map((label, i) => {
                  const weekday = i + 1;
                  const row = point.openingHours.find((h) => h.weekday === weekday);
                  if (!row) return null;
                  return { label, text: row.is_closed ? "Cerrado" : timeRange(row.opens_at, row.closes_at) };
                }).filter(Boolean);

                return (
                  <Card key={point.id} className={point.is_main_bakery ? "editorial-card editorial-card--ink" : "editorial-card"}>
                    <p className="eyebrow">{point.type === "bakery" ? "Obrador principal" : "Punto de recogida"}</p>
                    <h2>{point.name}</h2>
                    {point.status === "coming_soon" ? <p><strong>{PICKUP_POINT_STATUS_LABELS_ES.coming_soon}</strong></p> : null}
                    {address ? <p>{address}{point.city ? `, ${point.city}` : ""}</p> : point.city ? <p>{point.city}</p> : null}

                    <div className="location-schedule">
                      <div className="location-schedule__hours">
                        {generalHours.length ? (
                          <div>
                            <p><strong>Horario del establecimiento</strong></p>
                            <ul>{generalHours.map((h) => h && <li key={h.label}>{h.label}: {h.text}</li>)}</ul>
                          </div>
                        ) : null}

                        {windowsByDay.length ? (
                          <div>
                            <p><strong>Días y franjas de recogida</strong></p>
                            <ul>{windowsByDay.map((day) => <li key={day.label}>{day.label}: {day.ranges.join(", ")}</li>)}</ul>
                          </div>
                        ) : (
                          <p>Todavía no hay franjas de recogida publicadas para este punto.</p>
                        )}
                      </div>
                      {address ? <LocationMap address={`${address}${point.city ? `, ${point.city}` : ""}`} /> : null}
                    </div>

                    {point.public_instructions ? <p>{point.public_instructions}</p> : null}

                    {point.upcomingException ? (
                      <p>
                        <strong>{PICKUP_EXCEPTION_TYPE_LABELS_ES[point.upcomingException.type]}</strong> el {point.upcomingException.exception_date}
                        {point.upcomingException.public_message ? `: ${point.upcomingException.public_message}` : ""}
                      </p>
                    ) : null}

                    {link ? <Link className="text-link" href={link} target="_blank" rel="noopener noreferrer">Cómo llegar</Link> : null}
                  </Card>
                );
              })}
            </div>
          </Container>
        </Section>
      ) : (
        <Section>
          <Container>
            <EmptyState
              title="Todavía no hemos publicado ningún punto"
              description="Estamos confirmando la dirección y los horarios del obrador. En cuanto estén listos, los verás aquí."
            />
          </Container>
        </Section>
      )}

      <Section tone="sunken">
        <Container className="split-callout">
          <div>
            <p className="eyebrow">{content.callout.eyebrow}</p>
            <h2>{content.callout.title}</h2>
          </div>
          <div className="prose-block">
            <p>
              {content.callout.description}
            </p>
            {siteConfig.features.onlineOrders ? <Link className="text-link" href="/reserva-y-recoge">{content.callout.action}</Link> : null}
          </div>
        </Container>
      </Section>
    </main>
  );
}
