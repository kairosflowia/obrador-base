"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { featureKeys, resolveFeatureFlags, type FeatureFlags } from "@/config/feature-config";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { FEATURE_SETTING_KEY } from "@/lib/brand/feature-settings";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const PROCESSING_ORDER_STATUSES = ["draft", "pending_payment", "payment_processing", "confirmed", "ready"] as const;
const LIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due", "cancel_pending", "paused"] as const;

async function assertSafeToDisable(feature: keyof FeatureFlags, db: ReturnType<typeof createAdminClient>) {
  const anyDb = db as any;
  if (feature === "onlineOrders" || feature === "payments") {
    const { count } = await anyDb
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", PROCESSING_ORDER_STATUSES);
    if (count && count > 0) {
      throw new Error(
        `No se puede desactivar: hay ${count} pedido${count === 1 ? "" : "s"} en proceso (sin recoger/cancelar/reembolsar todavía).`,
      );
    }
  }
  if (feature === "subscriptions") {
    const { count } = await anyDb
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .in("status", LIVE_SUBSCRIPTION_STATUSES);
    if (count && count > 0) {
      throw new Error(
        `No se puede desactivar: hay ${count} suscripción${count === 1 ? "" : "es"} activa${count === 1 ? "" : "s"} o en pausa.`,
      );
    }
  }
}

export async function setFeatureFlagAction(feature: keyof FeatureFlags, enabled: boolean) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  if (!featureKeys.includes(feature)) throw new Error("invalid_feature");

  const db = createAdminClient();

  if (!enabled) await assertSafeToDisable(feature, db);

  const current = await getBrandSettings();
  const requested: FeatureFlags = { ...current.features, [feature]: enabled };
  const resolved = resolveFeatureFlags(requested);

  // resolveFeatureFlags() puede apagar OTRAS flags como efecto de la
  // dependencia (p.ej. desactivar payments también apaga onlineOrders y
  // subscriptions): se persiste el resultado completo, no solo la flag
  // tocada, para que la DB nunca quede en un estado que la UI no explica.
  for (const key of featureKeys) {
    await db
      .from("app_settings")
      .upsert({ key: FEATURE_SETTING_KEY[key], value: resolved[key], is_public: true, updated_by: identity.user.id }, { onConflict: "key" });
  }

  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");

  return resolved;
}
