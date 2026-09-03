import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { BrandImage } from "@/components/media/brand-image";

export function HeroCarousel() {
  const content = siteConfig.content.hero;
  return (
    <section className="hero-carousel" aria-label={siteConfig.brand.name}>
      <BrandImage
        src={siteConfig.content.images.hero}
        fallbackSrc="/brand/hero/hero-placeholder.svg"
        alt={content.imageAlt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className="hero-carousel__overlay" aria-hidden="true" />
      <div className="hero-carousel__content">
        <div className="hero-carousel__text">
          <h1 className="hero-carousel__title">{content.title}</h1>
          <p className="hero-carousel__subtitle">{content.description}</p>
          <div className="hero-carousel__actions">
            <Link className="button button--primary" href={content.primaryAction.href}>{content.primaryAction.label}</Link>
            {siteConfig.features.onlineOrders ? <Link className="button button--secondary hero-carousel__secondary" href={content.secondaryAction.href}>{content.secondaryAction.label}</Link> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
