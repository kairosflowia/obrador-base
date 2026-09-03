"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { getVisiblePublicNavigation } from "@/lib/navigation";
import { useBrand } from "@/components/brand/brand-provider";
import { BrandImage } from "@/components/media/brand-image";

import { Button } from "../ui/button";
import { Drawer } from "../ui/dialog";
import { MenuIcon, UserIcon } from "../ui/icons";
import { CartLink } from "../cart/cart-link";
import { MiniCart } from "../cart/mini-cart";

export function PublicHeader() {
  const siteConfig = useBrand();
  const visiblePublicNavigation = getVisiblePublicNavigation(siteConfig);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="public-header">
      <div className="container container--home public-header__inner">
        <Link className="site-logo" href="/" aria-label={`${siteConfig.brand.name}, inicio`}>
          <BrandImage src={siteConfig.brand.logo} fallbackSrc="/brand/logo/logo.svg" alt="" width={160} height={45} priority />
        </Link>

        <nav className="public-nav" aria-label="Navegación principal">
          {visiblePublicNavigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="public-header__actions">
          {siteConfig.features.customerAccounts ? <Link href="/cuenta/acceder" className="header-icon-link" aria-label="Mi cuenta"><UserIcon /></Link> : null}
          {siteConfig.features.onlineOrders ? <div className="cart-widget"><CartLink /><MiniCart /></div> : null}
          <Button
            ref={triggerRef}
            variant="icon"
            className="mobile-menu-trigger"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Menú"
        returnFocusRef={triggerRef}
        className="mobile-navigation"
      >
        <nav id="public-mobile-menu" aria-label="Navegación móvil">
          {visiblePublicNavigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
