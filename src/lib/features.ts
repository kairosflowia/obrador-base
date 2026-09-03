import { siteConfig } from "@/config/site-config";
import type { FeatureKey } from "@/config/feature-config";

export function isFeatureEnabled(feature: FeatureKey) {
  return siteConfig.features[feature];
}

const adminFeatureBySection: Readonly<Record<string, FeatureKey | undefined>> = {
  produccion: "production",
  disponibilidad: "availability",
  pedidos: "onlineOrders",
  "puntos-de-recogida": "pickupPoints",
  inventario: "inventory",
  productos: "catalog",
  clientes: "customerAccounts",
  analitica: "analytics",
  pagos: "payments",
  suscripciones: "subscriptions",
  comunicaciones: "notifications",
};

export function isAdminSectionEnabled(slug: string) {
  const feature = adminFeatureBySection[slug];
  return feature ? isFeatureEnabled(feature) : true;
}

export function featureForPath(pathname: string): FeatureKey | undefined {
  if (pathname.startsWith("/api/admin/inventario")) return "inventory";
  if (pathname.startsWith("/api/admin/analitica")) return "analytics";
  if (pathname.startsWith("/api/availability")) return "availability";
  if (pathname.startsWith("/admin/clientes/suscritos")) return "newsletter";
  if (pathname.startsWith("/admin/")) return adminFeatureBySection[pathname.split("/")[2] ?? ""];
  if (pathname.startsWith("/api/checkout") || pathname.startsWith("/checkout")) return "payments";
  if (pathname.startsWith("/api/subscriptions") || pathname.startsWith("/plan-de-pan")) return "subscriptions";
  if (pathname.startsWith("/api/push")) return "notifications";
  if (pathname.startsWith("/newsletter")) return "newsletter";
  if (pathname.startsWith("/cuenta") || pathname.startsWith("/auth")) return "customerAccounts";
  if (pathname.startsWith("/carrito") || pathname.startsWith("/pedido")) return "onlineOrders";
  if (pathname.startsWith("/reserva-y-recoge") || pathname === "/pan" || pathname.startsWith("/pan/")) return "catalog";
  if (pathname.startsWith("/donde-estamos")) return "pickupPoints";
  if (pathname.startsWith("/modo-produccion")) return "production";
  return undefined;
}

export function isPathEnabled(pathname: string) {
  if (pathname.startsWith("/api/availability")) {
    return isFeatureEnabled("availability") || isFeatureEnabled("onlineOrders");
  }
  const feature = featureForPath(pathname);
  return feature ? isFeatureEnabled(feature) : true;
}
