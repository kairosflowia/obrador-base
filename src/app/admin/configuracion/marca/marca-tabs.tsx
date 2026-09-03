"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/configuracion/marca/identidad", label: "Identidad" },
  { href: "/admin/configuracion/marca/colores", label: "Colores y tipografía" },
  { href: "/admin/configuracion/marca/contacto", label: "Contacto" },
  { href: "/admin/configuracion/marca/textos/hero", label: "Textos", matchPrefix: "/admin/configuracion/marca/textos" },
  { href: "/admin/configuracion/marca/imagenes", label: "Imágenes" },
  { href: "/admin/configuracion/marca/restaurar", label: "Restaurar" },
] as const;

export function MarcaTabs() {
  const pathname = usePathname();
  return (
    <nav className="admin-tabs" aria-label="Secciones de marca">
      {TABS.map((tab) => {
        const active = "matchPrefix" in tab ? pathname.startsWith(tab.matchPrefix) : pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
