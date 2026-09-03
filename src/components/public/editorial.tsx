import type { ReactNode } from "react";

import Link from "next/link";

import { BrandImage } from "@/components/media/brand-image";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { formatPrice } from "@/lib/catalog-domain";

import { cn } from "@/lib/cn";

export function EditorialGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  return <div className={cn("editorial-grid", `editorial-grid--${columns}`)}>{children}</div>;
}

export type PillarIcon = "tradicion" | "ingredientes" | "tiempo" | "comunidad";

export async function ValueCard({ number, icon, image, title, children, tone = "plain" }: { number?: string; icon?: PillarIcon; image?: string; title: string; children: ReactNode; tone?: "plain" | "yellow" | "green" | "blue" | "terracotta" }) {
  const siteConfig = await getBrandSettings();
  return (
    <article className={cn("value-card", `value-card--${tone}`, image && "value-card--image")} tabIndex={image ? 0 : undefined}>
      {image ? (
        <>
          <span className="value-card__illustration">
            <BrandImage src={image} fallbackSrc={siteConfig.content.images.institutional} alt={title} width={320} height={320} />
          </span>
          <h3 className="sr-only">{title}</h3>
        </>
      ) : (
        <>
          {number ? <span className="value-card__number" aria-hidden="true">{number}</span> : null}
          {icon ? <span className={cn("value-card__icon", `value-card__icon--${icon}`)} aria-hidden="true" /> : null}
          <h3>{title}</h3>
        </>
      )}
      <p>{children}</p>
    </article>
  );
}

export async function EditorialProductPreview({ href, name, description, imagePath, imageAlt, priceCents }: { href: string; name: string; description: string | null; imagePath: string | null; imageAlt: string; priceCents: number | null }) {
  const siteConfig = await getBrandSettings();
  return (
    <Link href={href} className="editorial-product">
      <span className="editorial-product__image">
        <BrandImage src={imagePath ? `/api/product-images/${imagePath}` : null} fallbackSrc={siteConfig.content.images.productFallback} alt={imageAlt || name} width={480} height={360} />
      </span>
      <h3>{name}</h3>
      {description ? <p>{description}</p> : null}
      {priceCents !== null ? <span className="editorial-product__price">Desde {formatPrice(priceCents)}</span> : null}
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="text-link" href={href}>{children}</Link>;
}
