export const FONT_OPTIONS = [
  { id: "fraunces", label: "Fraunces (serif editorial)", cssVar: "var(--font-fraunces), Georgia, serif" },
  { id: "playfair-display", label: "Playfair Display (serif elegante)", cssVar: "var(--font-playfair-display), Georgia, serif" },
  { id: "lora", label: "Lora (serif suave)", cssVar: "var(--font-lora), Georgia, serif" },
  { id: "inter", label: "Inter (sans neutra)", cssVar: "var(--font-inter), Arial, sans-serif" },
  { id: "dm-sans", label: "DM Sans (sans geométrica)", cssVar: "var(--font-dm-sans), Arial, sans-serif" },
  { id: "manrope", label: "Manrope (sans moderna)", cssVar: "var(--font-manrope), Arial, sans-serif" },
  { id: "space-grotesk", label: "Space Grotesk (sans técnica)", cssVar: "var(--font-space-grotesk), Arial, sans-serif" },
  { id: "work-sans", label: "Work Sans (sans versátil)", cssVar: "var(--font-work-sans), Arial, sans-serif" },
] as const;

export type FontOptionId = (typeof FONT_OPTIONS)[number]["id"];

export function fontCssVar(id: string | undefined, fallback: string): string {
  return FONT_OPTIONS.find((option) => option.id === id)?.cssVar ?? fallback;
}
