import { describe, expect, it } from "vitest";

import { defaultFeatureFlags, productPreset, productPresets, resolveFeatureFlags } from "@/config/feature-config";

describe("white-label feature dependencies", () => {
  it("keeps every capability enabled for the complete base", () => {
    expect(resolveFeatureFlags(defaultFeatureFlags)).toEqual(defaultFeatureFlags);
  });

  it("defines BASIC, COMMERCE and FULL as initial flag sets", () => {
    expect(resolveFeatureFlags(productPresets.BASIC)).toMatchObject({
      catalog: true,
      onlineOrders: false,
      customerAccounts: false,
      pickupPoints: true,
      newsletter: true,
    });
    expect(resolveFeatureFlags(productPresets.COMMERCE)).toMatchObject({
      catalog: true,
      onlineOrders: true,
      customerAccounts: true,
      payments: true,
      inventory: false,
      availability: false,
      production: false,
      subscriptions: false,
    });
    expect(resolveFeatureFlags(productPresets.FULL)).toEqual(defaultFeatureFlags);
  });

  it("normalizes preset names and falls back safely to FULL", () => {
    expect(productPreset(" basic ")).toBe("BASIC");
    expect(productPreset("commerce")).toBe("COMMERCE");
    expect(productPreset("unknown")).toBe("FULL");
    expect(productPreset(undefined)).toBe("FULL");
  });

  it("closes checkout and orders when payments are disabled", () => {
    const features = resolveFeatureFlags({ ...defaultFeatureFlags, payments: false });
    expect(features.payments).toBe(false);
    expect(features.onlineOrders).toBe(false);
    expect(features.subscriptions).toBe(false);
  });

  it("propagates catalog and account dependencies without changing requested data", () => {
    const withoutCatalog = resolveFeatureFlags({ ...defaultFeatureFlags, catalog: false });
    expect(withoutCatalog.inventory).toBe(false);
    expect(withoutCatalog.availability).toBe(false);
    expect(withoutCatalog.production).toBe(false);
    expect(withoutCatalog.onlineOrders).toBe(false);
    expect(withoutCatalog.subscriptions).toBe(false);

    const withoutAccounts = resolveFeatureFlags({ ...defaultFeatureFlags, customerAccounts: false });
    expect(withoutAccounts.notifications).toBe(false);
    expect(withoutAccounts.subscriptions).toBe(false);
    expect(withoutAccounts.catalog).toBe(true);
  });
});
