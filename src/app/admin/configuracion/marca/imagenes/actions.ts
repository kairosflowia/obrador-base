"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { SLOT_KEYS, type BrandImageSlot } from "./slots";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
} as const;

export async function uploadBrandImageAction(formData: FormData) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");

  const slot = String(formData.get("slot")) as BrandImageSlot;
  const settingKey = SLOT_KEYS[slot];
  if (!settingKey) throw new Error("invalid_slot");

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0 || file.size > 8388608) throw new Error("invalid_file");

  const ext = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES];
  if (!ext) throw new Error("invalid_type");

  const db = createAdminClient();
  const path = `brand/${slot}-${Date.now()}.${ext}`;
  const up = await db.storage.from("brand-assets").upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) throw new Error(up.error.message);

  const { data: pub } = db.storage.from("brand-assets").getPublicUrl(path);
  await db
    .from("app_settings")
    .update({ value: JSON.stringify(pub.publicUrl), is_public: true, updated_by: identity.user.id })
    .eq("key", settingKey);

  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/imagenes");
}
