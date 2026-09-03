"use server";

import { revalidatePath } from "next/cache";

import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function resetDemoDataAction() {
  const siteConfig = await getBrandSettings();
  if (!siteConfig.demoMode) throw new Error("demo_mode_disabled");
  const identity = await getCurrentIdentity();
  if (!identity || !identity.roles.some((role) => role === "owner" || role === "admin")) throw new Error("forbidden");
  const { error } = await (await createClient()).rpc("reset_demo_data" as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}
