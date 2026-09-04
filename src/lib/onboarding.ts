import "server-only";

import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { createAdminClient } from "@/lib/supabase/admin";

export type StepStatus = "ready" | "pending" | "recommended" | "blocked";

export type WizardStep = {
  slug: string;
  title: string;
  status: StepStatus;
  detail: string;
  href: string;
  actionLabel: string;
};

const DEFAULT_BRAND_NAME = "OBRADOR BASE";
const DEFAULT_HERO_TITLE = "Pan artesanal, cada día";

async function countRows(
  db: ReturnType<typeof createAdminClient>,
  table: string,
  filters: (query: any) => any,
): Promise<number> {
  const query = filters((db as any).from(table).select("id", { count: "exact", head: true }));
  const { count } = await query;
  return count ?? 0;
}

export async function getWizardSteps(): Promise<WizardStep[]> {
  const db = createAdminClient();
  const siteConfig = await getBrandSettings();

  const [productsCount, productionDatesCount, pickupPointsCount] = await Promise.all([
    countRows(db, "products", (q) => q.in("status", ["active", "seasonal"])),
    countRows(db, "production_dates", (q) => q.eq("status", "open").gte("production_date", new Date().toISOString().slice(0, 10))),
    countRows(db, "pickup_points", (q) => q.eq("is_public", true).in("status", ["active", "coming_soon"])),
  ]);

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
  const emailConfigured = process.env.EMAIL_PROVIDER === "resend" && Boolean(process.env.RESEND_API_KEY);

  const nameCustomized = siteConfig.brand.name.trim() !== DEFAULT_BRAND_NAME;
  const colorsCustomized = Boolean(siteConfig.brand.logo && !siteConfig.brand.logo.startsWith("/brand/"));
  const contactCustomized = Boolean(siteConfig.business.email || siteConfig.business.phone);
  const locationCustomized = Boolean(siteConfig.business.address || siteConfig.business.city);
  const heroCustomized = siteConfig.content.hero.title.trim() !== DEFAULT_HERO_TITLE;
  const heroImageCustomized = Boolean(siteConfig.content.images.hero && !siteConfig.content.images.hero.startsWith("/brand/"));

  const steps: WizardStep[] = [
    {
      slug: "nombre",
      title: "Nombre y marca",
      status: nameCustomized ? "ready" : "pending",
      detail: nameCustomized
        ? `El obrador se llama "${siteConfig.brand.name}".`
        : "El nombre sigue siendo el genérico de la plantilla (OBRADOR BASE).",
      href: "/admin/configuracion/marca/identidad",
      actionLabel: "Editar identidad",
    },
    {
      slug: "logo-colores",
      title: "Logo y colores",
      status: colorsCustomized ? "ready" : "recommended",
      detail: colorsCustomized ? "Hay un logo propio subido." : "Se está usando el logo de marcador de posición.",
      href: "/admin/configuracion/marca/colores",
      actionLabel: "Editar colores y tipografía",
    },
    {
      slug: "contactos",
      title: "Contactos",
      status: contactCustomized ? "ready" : "pending",
      detail: contactCustomized ? "Hay email o teléfono de contacto configurados." : "Falta email o teléfono de contacto.",
      href: "/admin/configuracion/marca/contacto",
      actionLabel: "Editar contacto",
    },
    {
      slug: "localizacion",
      title: "Localización",
      status: locationCustomized ? "ready" : "pending",
      detail: locationCustomized ? "Hay dirección o ciudad configuradas." : "Falta la dirección del obrador.",
      href: "/admin/configuracion/marca/contacto",
      actionLabel: "Editar localización",
    },
    {
      slug: "textos",
      title: "Textos",
      status: heroCustomized ? "ready" : "recommended",
      detail: heroCustomized ? "El texto del hero ya es propio." : "Se están usando los textos genéricos de la plantilla.",
      href: "/admin/configuracion/marca/textos/hero",
      actionLabel: "Editar textos",
    },
    {
      slug: "imagenes",
      title: "Imágenes",
      status: heroImageCustomized ? "ready" : "recommended",
      detail: heroImageCustomized ? "La imagen del hero ya es propia." : "Se está usando la imagen de marcador de posición del hero.",
      href: "/admin/configuracion/marca/imagenes",
      actionLabel: "Subir imágenes",
    },
    {
      slug: "funcionalidades",
      title: "Funcionalidades",
      status: "recommended",
      detail: "Revisa qué módulos necesita este cliente antes de continuar con los pasos siguientes.",
      href: "/admin/configuracion/funcionalidades",
      actionLabel: "Revisar funcionalidades",
    },
    {
      slug: "productos",
      title: "Productos",
      status: !siteConfig.features.catalog
        ? "blocked"
        : productsCount > 0
          ? "ready"
          : "pending",
      detail: !siteConfig.features.catalog
        ? "No aplicable — el catálogo está desactivado en Funcionalidades."
        : productsCount > 0
          ? `${productsCount} producto${productsCount === 1 ? "" : "s"} publicado${productsCount === 1 ? "" : "s"}.`
          : "Todavía no hay productos publicados.",
      href: "/admin/productos",
      actionLabel: "Gestionar productos",
    },
    {
      slug: "horarios",
      title: "Horarios",
      status: !siteConfig.features.catalog
        ? "blocked"
        : productionDatesCount > 0
          ? "ready"
          : "pending",
      detail: !siteConfig.features.catalog
        ? "No aplicable — el catálogo está desactivado en Funcionalidades."
        : productionDatesCount > 0
          ? `${productionDatesCount} fecha${productionDatesCount === 1 ? "" : "s"} de producción abierta${productionDatesCount === 1 ? "" : "s"}.`
          : "Todavía no hay fechas de producción abiertas.",
      href: "/admin/disponibilidad",
      actionLabel: "Configurar disponibilidad",
    },
    {
      slug: "punto-recogida",
      title: "Punto de recogida",
      status: !siteConfig.features.pickupPoints
        ? "blocked"
        : pickupPointsCount > 0
          ? "ready"
          : "pending",
      detail: !siteConfig.features.pickupPoints
        ? "No aplicable — los puntos de recogida están desactivados en Funcionalidades."
        : pickupPointsCount > 0
          ? `${pickupPointsCount} punto${pickupPointsCount === 1 ? "" : "s"} público${pickupPointsCount === 1 ? "" : "s"} activo${pickupPointsCount === 1 ? "" : "s"}.`
          : "Todavía no hay ningún punto de recogida público.",
      href: "/admin/puntos-de-recogida",
      actionLabel: "Gestionar puntos de recogida",
    },
    {
      slug: "pagos",
      title: "Pagos",
      status: !siteConfig.features.payments
        ? "blocked"
        : stripeConfigured
          ? "ready"
          : "pending",
      detail: !siteConfig.features.payments
        ? "No aplicable — los pagos están desactivados en Funcionalidades."
        : stripeConfigured
          ? "Stripe está configurado en el servidor."
          : "Falta configurar las claves de Stripe en las variables de entorno.",
      href: "/admin/configuracion/sistema",
      actionLabel: "Ver estado del sistema",
    },
    {
      slug: "emails",
      title: "Emails",
      status: emailConfigured ? "ready" : "recommended",
      detail: emailConfigured
        ? "El proveedor de email transaccional está configurado."
        : "Sin proveedor de email configurado: las notificaciones no se enviarán, pero el resto del portal funciona igual.",
      href: "/admin/contenido/emails",
      actionLabel: "Ver plantillas de email",
    },
  ];

  return steps;
}

export function summarizeWizardSteps(steps: WizardStep[]) {
  const relevant = steps.filter((step) => step.status !== "blocked");
  const ready = steps.filter((step) => step.status === "ready").length;
  return {
    ready,
    total: steps.length,
    relevantTotal: relevant.length,
    pending: steps.filter((step) => step.status === "pending").length,
    recommended: steps.filter((step) => step.status === "recommended").length,
    blocked: steps.filter((step) => step.status === "blocked").length,
  };
}
