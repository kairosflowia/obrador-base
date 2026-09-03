export const featureKeys = [
  "catalog",
  "onlineOrders",
  "customerAccounts",
  "payments",
  "inventory",
  "availability",
  "production",
  "pickupPoints",
  "subscriptions",
  "newsletter",
  "analytics",
  "notifications",
] as const;

export type FeatureKey = (typeof featureKeys)[number];
export type FeatureFlags = Record<FeatureKey, boolean>;
export const productPresetNames = ["BASIC", "COMMERCE", "FULL"] as const;
export type ProductPresetName = (typeof productPresetNames)[number];

export const productPresets: Record<ProductPresetName, FeatureFlags> = {
  BASIC: {
    catalog: true,
    onlineOrders: false,
    customerAccounts: false,
    payments: false,
    inventory: false,
    availability: false,
    production: false,
    pickupPoints: true,
    subscriptions: false,
    newsletter: true,
    analytics: false,
    notifications: false,
  },
  COMMERCE: {
    catalog: true,
    onlineOrders: true,
    customerAccounts: true,
    payments: true,
    inventory: false,
    availability: false,
    production: false,
    pickupPoints: true,
    subscriptions: false,
    newsletter: true,
    analytics: false,
    notifications: false,
  },
  FULL: {
    catalog: true,
    onlineOrders: true,
    customerAccounts: true,
    payments: true,
    inventory: true,
    availability: true,
    production: true,
    pickupPoints: true,
    subscriptions: true,
    newsletter: true,
    analytics: true,
    notifications: true,
  },
};

export const defaultProductPreset: ProductPresetName = "FULL";
export const defaultFeatureFlags: FeatureFlags = productPresets[defaultProductPreset];

export function productPreset(value: string | undefined): ProductPresetName {
  const normalized = value?.trim().toUpperCase();
  return productPresetNames.find((name) => name === normalized) ?? defaultProductPreset;
}

/**
 * Converts requested flags into capabilities that the application can safely
 * expose. This never mutates data or disables webhook processing for existing
 * records; it only controls entry points and interactive UI.
 */
export function resolveFeatureFlags(requested: FeatureFlags): FeatureFlags {
  const catalog = requested.catalog;
  const pickupPoints = requested.pickupPoints;
  const availability = requested.availability && catalog;
  // The current order flow confirms every reservation through Stripe. Until
  // another payment method exists, disabling payments must also close orders.
  const onlineOrders = requested.onlineOrders && requested.payments && catalog && pickupPoints;
  const payments = requested.payments && onlineOrders;
  const customerAccounts = requested.customerAccounts;

  return {
    catalog,
    onlineOrders,
    customerAccounts,
    payments,
    inventory: requested.inventory && catalog,
    availability,
    production: requested.production && catalog && availability,
    pickupPoints,
    subscriptions: requested.subscriptions && catalog && onlineOrders && payments && customerAccounts && pickupPoints,
    newsletter: requested.newsletter,
    analytics: requested.analytics,
    notifications: requested.notifications && customerAccounts,
  };
}
