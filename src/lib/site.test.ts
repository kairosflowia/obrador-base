import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { site } from "./site";
import { siteConfig } from "@/config/site-config";

describe("site metadata", () => {
  it("uses neutral white-label defaults when no client identity is configured", () => {
    expect(site).toEqual({
      name: "OBRADOR BASE",
      description: "Pan artesanal elaborado en pequeñas tandas.",
      locale: "es_ES",
      contactEmail: "",
      phone: "",
    });
  });

  it("defines every white-label configuration group", () => {
    expect(Object.keys(siteConfig)).toEqual(["brand", "business", "content", "seo", "features", "demoMode"]);
    expect(Object.keys(siteConfig.features)).toEqual([
      "catalog", "onlineOrders", "customerAccounts", "payments", "inventory", "availability",
      "production", "pickupPoints", "subscriptions", "newsletter", "analytics", "notifications",
    ]);
    expect(siteConfig.brand.name).not.toMatch(/fuerza/i);
  });

  it("ships local fallbacks for every primary brand image", () => {
    const paths = [
      siteConfig.brand.logo,
      siteConfig.seo.socialImage,
      ...Object.values(siteConfig.content.images),
    ];
    for (const path of paths) {
      expect(path.startsWith("/brand/")).toBe(true);
      expect(existsSync(resolve(process.cwd(), "public", path.slice(1)))).toBe(true);
    }
  });

  it("does not reference legacy FUERZA media from runtime source", () => {
    const files = [
      "src/app/(public)/page.tsx",
      "src/app/(public)/nosotros/page.tsx",
      "src/app/(public)/obrador/page.tsx",
      "src/components/public/hero-carousel.tsx",
      "public/sw.js",
    ];
    for (const file of files) {
      expect(readFileSync(resolve(process.cwd(), file), "utf8")).not.toMatch(/fuerza[^\s"')]*\.(?:png|jpe?g|webp|svg)/i);
    }
  });
});
