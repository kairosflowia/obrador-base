import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260903140000_demo_data.sql"),
  "utf8",
);

describe("neutral demo data seed", () => {
  it("contains the complete generic catalogue and operational examples", () => {
    for (const product of [
      "Hogaza de masa madre",
      "Pan integral",
      "Pan de semillas",
      "Focaccia",
      "Cookies artesanales",
      "Bollería",
    ]) {
      expect(migration).toContain(product);
    }
    for (const table of ["product_families", "product_variants", "production_dates", "orders", "demo_customers", "subscriptions", "subscription_items"]) {
      expect(migration).toContain(`public.${table}`);
    }
  });

  it("marks seeded records and never introduces the original client identity", () => {
    expect(migration).toContain("is_demo boolean not null default false");
    expect(migration).toContain("is_demo = true");
    expect(migration).toContain("DEMO-0001");
    expect(migration).not.toMatch(/FUERZA|fuerzaobrador|Avilés|Asturias/);
  });
});
