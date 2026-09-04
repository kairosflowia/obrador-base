import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandColorsForm } from "@/components/admin/brand-colors-form";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const fields = [
  ["marca.color_primary", "#b97844"],
  ["marca.color_secondary", "#ede8dc"],
  ["marca.color_background", "#f5f1e8"],
  ["marca.color_accent", "#6f7b52"],
  ["marca.font_display", "fraunces"],
  ["marca.font_body", "inter"],
  ["marca.content_hero_title", "Pan artesanal, cada día"],
  ["marca.content_hero_description", ""],
  ["marca.brand_logo", "/brand/logo/logo.svg"],
] as const;

async function save(form: FormData) {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient() as any;
  const keys = ["marca.color_primary", "marca.color_secondary", "marca.color_background", "marca.color_accent", "marca.font_display", "marca.font_body"] as const;
  for (const key of keys) {
    const value = String(form.get(key) ?? "").trim();
    await db.from("app_settings").upsert({ key, value, is_public: true, updated_by: identity.user.id }, { onConflict: "key" });
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/colores");
}

export default async function MarcaColores() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string, fallback: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" && raw !== "" ? raw : fallback;
  };

  return (
    <>
      <AdminPageHeader
        title="Colores y tipografía"
        description="Paleta principal y tipografías del portal. Los cambios se aplican a todo el sitio al guardar."
      />
      <BrandColorsForm
        action={save}
        initial={{
          colorPrimary: get("marca.color_primary", "#b97844"),
          colorSecondary: get("marca.color_secondary", "#ede8dc"),
          colorBackground: get("marca.color_background", "#f5f1e8"),
          colorAccent: get("marca.color_accent", "#6f7b52"),
          fontDisplay: get("marca.font_display", "fraunces"),
          fontBody: get("marca.font_body", "inter"),
        }}
        heroTitle={get("marca.content_hero_title", "Pan artesanal, cada día")}
        heroDescription={get("marca.content_hero_description", "Elaboramos pan en pequeñas tandas.")}
        logo={get("marca.brand_logo", "/brand/logo/logo.svg")}
      />
    </>
  );
}
