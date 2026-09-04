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
  // upsert, no update: si la imagen se había "quitado" antes (removeBrandImageAction
  // borra la fila entera), un update().eq("key", ...) no encuentra ninguna fila y no
  // hace nada — la subida parecía fallar en silencio aunque el archivo sí llegaba al
  // storage. Con upsert, tanto crear la fila de nuevo como actualizarla funcionan.
  const { error: upsertError } = await db
    .from("app_settings")
    .upsert({ key: settingKey, value: pub.publicUrl, is_public: true, updated_by: identity.user.id }, { onConflict: "key" });
  if (upsertError) throw new Error(upsertError.message);

  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/imagenes");
}

export async function removeBrandImageAction(formData: FormData) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");

  const slot = String(formData.get("slot")) as BrandImageSlot;
  const settingKey = SLOT_KEYS[slot];
  if (!settingKey) throw new Error("invalid_slot");

  const db = createAdminClient();
  const { data: current } = await db.from("app_settings").select("value").eq("key", settingKey).maybeSingle();
  const currentUrl = typeof current?.value === "string" ? current.value : null;

  // Se borra la fila en vez de vaciar el valor: getBrandSettings() cae
  // limpiamente al fallback/placeholder de siteConfig cuando la clave no
  // existe, igual que en el reset de "Restaurar configuración demo".
  await db.from("app_settings").delete().eq("key", settingKey);

  // Si la imagen actual vive en el bucket brand-assets (no un placeholder
  // local de /brand/), se elimina también el archivo del storage.
  const match = currentUrl?.match(/\/storage\/v1\/object\/public\/brand-assets\/(.+)$/);
  if (match) await db.storage.from("brand-assets").remove([decodeURIComponent(match[1])]);

  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/imagenes");
}
