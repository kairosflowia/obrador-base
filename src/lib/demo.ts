import { siteConfig } from "@/config/site-config";

export function isDemoMode() {
  return siteConfig.demoMode;
}

export function assertNotDemoDestructive() {
  if (isDemoMode()) throw new Error("Operación no disponible en modo demo.");
}
