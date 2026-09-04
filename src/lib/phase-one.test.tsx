import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Alert, Badge, Button, EmptyState, Input } from "@/components/ui";
import manifest from "@/app/manifest";
import { adminNavigation, publicNavigation } from "@/lib/navigation";

describe("design system foundations", () => {
  it("renders accessible controls and states", () => {
    const html = renderToStaticMarkup(
      <>
        <Button>Reserva y recoge</Button>
        <Input id="name" label="Nombre" error="Necesitamos tu nombre." />
        <Badge variant="success">Disponible</Badge>
        <Alert variant="warning" title="Atención" />
        <EmptyState title="Sin datos" description="Todavía no hay datos." />
      </>,
    );

    expect(html).toContain("Reserva y recoge");
    expect(html).toContain('for="name"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="status"');
    expect(html).toContain("Todavía no hay datos.");
  });

  it("keeps the approved theme tokens in one stylesheet", () => {
    const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
    for (const token of ["--background", "--foreground", "--primary", "--secondary", "--accent", "--success", "--warning", "--error", "--border", "--font-display", "--font-body", "--radius-3"]) {
      expect(css).toContain(token);
    }
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("prefers-reduced-motion");
  });
});

describe("navigation contracts", () => {
  it("defines the approved public navigation", () => {
    expect(publicNavigation.map(({ label }) => label)).toEqual([
      "Inicio", "Pan", "Reserva y recoge", "Plan de Pan", "Dónde estamos", "Contacto",
    ]);
  });

  it("defines every structural admin route without invented records", () => {
    expect(adminNavigation).toHaveLength(18);
    expect(adminNavigation.map(({ slug }) => slug)).toContain("produccion");
    expect(adminNavigation.map(({ slug }) => slug)).toContain("auditoria");
    expect(adminNavigation.map(({ slug }) => slug)).toContain("analitica");
    expect(adminNavigation.map(({ slug }) => slug)).toContain("marca");
    expect(adminNavigation.map(({ slug }) => slug)).toContain("funcionalidades");
  });
});

describe("PWA and metadata contracts", () => {
  it("provides an installable standalone manifest", async () => {
    const value = await manifest();
    expect(value.name).toBe("OBRADOR BASE");
    expect(value.display).toBe("standalone");
    expect(value.start_url).toBe("/");
    expect(value.icons).toHaveLength(3);
  });

  it("keeps commercial navigation network-only", () => {
    const sw = readFileSync(resolve(process.cwd(), "public/sw.js"), "utf8");
    expect(sw).toContain('request.mode === "navigate"');
    expect(sw).toContain("fetch(request).catch");
    expect(sw).not.toContain("/api/");
  });

  it("exposes essential Spanish metadata and offline guidance", () => {
    const layout = readFileSync(resolve(process.cwd(), "src/app/layout.tsx"), "utf8");
    const offline = readFileSync(resolve(process.cwd(), "src/app/(public)/offline/page.tsx"), "utf8");
    expect(layout).toContain('lang="es-ES"');
    expect(layout).toContain('manifest: "/manifest.webmanifest"');
    expect(layout).toContain("appleWebApp");
    expect(offline).toContain("Ahora mismo no tienes conexión.");
    expect(offline).toContain("Volver a intentarlo");
  });
});
