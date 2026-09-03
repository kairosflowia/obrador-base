"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/configuracion/marca/textos/hero", label: "Hero" },
  { href: "/admin/configuracion/marca/textos/nosotros", label: "Nosotros" },
  { href: "/admin/configuracion/marca/textos/obrador", label: "Obrador / Proceso" },
  { href: "/admin/configuracion/marca/textos/reserva", label: "Reserva y recoge" },
  { href: "/admin/configuracion/marca/textos/plan-de-pan", label: "Plan de Pan" },
  { href: "/admin/configuracion/marca/textos/newsletter", label: "Newsletter" },
  { href: "/admin/configuracion/marca/textos/footer", label: "Footer" },
] as const;

export function TextosTabs() {
  const pathname = usePathname();
  return (
    <nav className="admin-tabs admin-tabs--secondary" aria-label="Secciones de texto">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
