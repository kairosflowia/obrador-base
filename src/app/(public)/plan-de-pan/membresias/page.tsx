import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BasketConfigurator } from "@/components/subscriptions/basket-configurator";
import { PageIntro } from "@/components/public/page-intro";
import { Container, Section } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionFrequency } from "@/lib/subscriptions-domain";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getBrandSettings();
  return createPageMetadata({
    title: siteConfig.content.subscriptions.memberships.title,
    description: siteConfig.content.subscriptions.memberships.description,
    path: "/plan-de-pan/membresias",
  });
}

const VALID_FREQUENCIES: SubscriptionFrequency[] = ["weekly", "biweekly", "every_3_weeks", "monthly"];

export default async function MembresiasPage({ searchParams }: { searchParams: Promise<{ frecuencia?: string }> }) {
  const siteConfig = await getBrandSettings();
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/cuenta/acceder?next=/plan-de-pan/membresias");
  const { frecuencia } = await searchParams;
  const initialFrequency = VALID_FREQUENCIES.find((f) => f === frecuencia);

  const db: any = await createClient();
  const [{ data: variants }, { data: products }, { data: images }, { data: points }] = await Promise.all([
    db.from("product_variants").select("id,name,price_cents,product_id").eq("status", "active").eq("subscribable", true).not("price_cents", "is", null).order("name"),
    db.from("products").select("id,name").eq("status", "active"),
    db.from("product_images").select("product_id,storage_path,is_primary").order("display_order"),
    db.from("pickup_points_public").select("id,name").eq("status", "active"),
  ]);
  const productName = (id: string) => products?.find((p: any) => p.id === id)?.name ?? "Producto";
  const productImage = (id: string) => {
    const forProduct = (images ?? []).filter((i: any) => i.product_id === id);
    return forProduct.find((i: any) => i.is_primary)?.storage_path ?? forProduct[0]?.storage_path ?? null;
  };
  const options = (variants ?? [])
    .map((v: any) => ({
      id: v.id,
      name: v.name === "Única" ? productName(v.product_id) : `${productName(v.product_id)} — ${v.name}`,
      priceCents: v.price_cents as number,
      imagePath: productImage(v.product_id),
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <main id="main-content">
      <PageIntro {...siteConfig.content.subscriptions.memberships} />
      <Section>
        <Container size="wide">
          <BasketConfigurator variants={options} pickupPoints={points ?? []} initialFrequency={initialFrequency} />
        </Container>
      </Section>
    </main>
  );
}
