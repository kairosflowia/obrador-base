import Link from "next/link";

import { BrandImage } from "@/components/media/brand-image";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/catalog-domain";
import type { WeeklySpecial } from "@/lib/weekly-special";

function formatSaturday(date: string) {
  const formatted = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T00:00:00`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export async function WeeklySpecialBanner({ special }: { special: WeeklySpecial }) {
  const siteConfig = await getBrandSettings();
  const href = special.product.familySlug ? `/reserva-y-recoge/${special.product.familySlug}/${special.product.slug}` : `/pan/${special.product.slug}`;
  const content = siteConfig.content.home.weeklySpecial;

  return (
    <Link href={href} className="weekly-special">
      <span className="weekly-special__image">
        <BrandImage src={special.product.imagePath ? `/api/product-images/${special.product.imagePath}` : null} fallbackSrc={siteConfig.content.images.productFallback} alt={special.product.imageAlt || special.product.name} width={640} height={480} priority />
      </span>
      <span className="weekly-special__body">
        <Badge variant="primary">{content.badge}</Badge>
        <span className="weekly-special__date">{content.datePrefix} {formatSaturday(special.collectionDate)}</span>
        <h3>{special.headline || special.product.name}</h3>
        {special.headline ? <p className="weekly-special__product-name">{special.product.name}</p> : null}
        {special.product.shortDescription ? <p>{special.product.shortDescription}</p> : null}
        {special.product.priceCents !== null ? <span className="weekly-special__price">{formatPrice(special.product.priceCents)}</span> : null}
        <p className="weekly-special__priority">{content.priorityPrefix} {siteConfig.content.subscriptions.name}, {content.prioritySuffix}</p>
        <span className="weekly-special__cta">{content.action}</span>
      </span>
    </Link>
  );
}
