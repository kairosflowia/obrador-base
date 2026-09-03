"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { SiteConfig } from "@/config/site-config";

const BrandContext = createContext<SiteConfig | null>(null);

export function BrandProvider({ value, children }: { value: SiteConfig; children: ReactNode }) {
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): SiteConfig {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand debe usarse dentro de BrandProvider");
  return ctx;
}
