import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const fields = [
  ["marca.brand_name", "Nombre del obrador"],
  ["marca.brand_short_name", "Nombre corto"],
  ["marca.brand_tagline", "Tagline"],
] as const;

async function save(form: FormData) {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient() as any;
  for (const [key] of fields) {
    const value = String(form.get(key) ?? "").trim();
    await db.from("app_settings").upsert({ key, value, is_public: true, updated_by: identity.user.id }, { onConflict: "key" });
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/identidad");
}

export default async function MarcaIdentidad() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader
        title="Identidad"
        description="Nombre y tagline del obrador. Se usan en el encabezado, el pie de página, el título del sitio y las notificaciones."
      />
      <Card>
        <form action={save} className="admin-form">
          {fields.map(([key, label]) => (
            <Input key={key} id={key} name={key} label={label} defaultValue={get(key)} />
          ))}
          <Button type="submit">Guardar identidad</Button>
        </form>
      </Card>
    </>
  );
}
