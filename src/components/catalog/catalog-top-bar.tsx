"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { CartIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site-config";
import { BrandImage } from "@/components/media/brand-image";
import { formatPrice } from "@/lib/catalog-domain";

import { usePickupPoint } from "./pickup-point-provider";

export function CatalogTopBar() {
  const { points, selectedId, select, date, minDate, setDate } = usePickupPoint();
  const cart = useCart();

  return (
    <header className="catalog-topbar">
      <Link href="/" className="catalog-topbar__logo" aria-label={`${siteConfig.brand.name}, volver al inicio`}>
        <BrandImage src={siteConfig.brand.logo} fallbackSrc="/brand/logo/logo.svg" alt={siteConfig.brand.name} width={640} height={180} priority />
      </Link>

      {siteConfig.features.onlineOrders && points.length ? (
        <div className="catalog-topbar__pickup">
          <label>
            <span className="sr-only">Punto de recogida</span>
            <select value={selectedId} onChange={(event) => select(event.target.value)}>
              {points.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Día de recogida</span>
            <input type="date" value={date} min={minDate} onChange={(event) => event.target.value && setDate(event.target.value)} />
          </label>
        </div>
      ) : null}

      {siteConfig.features.onlineOrders ? <Link href="/carrito" className="catalog-topbar__cart" aria-label={`Cesta, ${cart.count} artículos, ${formatPrice(cart.total)}`}>
        <CartIcon />
        <span className="catalog-topbar__cart-total">{formatPrice(cart.total)}</span>
        {cart.count > 0 ? <span className="catalog-topbar__cart-count" aria-hidden="true">{cart.count}</span> : null}
      </Link> : null}
    </header>
  );
}
