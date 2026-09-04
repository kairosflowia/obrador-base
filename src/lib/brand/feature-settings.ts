import type { FeatureKey } from "@/config/feature-config";

// app_settings.key exige minúsculas ('^[a-z][a-z0-9_.-]{1,79}$'), así que
// las claves camelCase de FeatureKey se guardan en snake_case bajo el
// namespace "features.". Compartido entre get-brand-settings.ts (lectura)
// y la acción de /admin/configuracion/funcionalidades (escritura).
export const FEATURE_SETTING_KEY: Record<FeatureKey, string> = {
  catalog: "features.catalog",
  onlineOrders: "features.online_orders",
  customerAccounts: "features.customer_accounts",
  payments: "features.payments",
  inventory: "features.inventory",
  availability: "features.availability",
  production: "features.production",
  pickupPoints: "features.pickup_points",
  subscriptions: "features.subscriptions",
  newsletter: "features.newsletter",
  analytics: "features.analytics",
  notifications: "features.notifications",
};
