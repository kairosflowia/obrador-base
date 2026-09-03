export const SLOT_KEYS = {
  logo: "marca.brand_logo",
  icon: "marca.brand_icon",
  appleIcon: "marca.brand_apple_icon",
  hero: "marca.image_hero",
  obrador: "marca.image_obrador",
  obradorProcess: "marca.image_obrador_process",
  team: "marca.image_team",
  institutional: "marca.image_institutional",
  subscriptions: "marca.image_subscriptions",
  social: "marca.image_social",
} as const;

export type BrandImageSlot = keyof typeof SLOT_KEYS;
