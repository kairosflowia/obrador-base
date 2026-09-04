import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const fields = [
  ["marca.business_email", "Email"],
  ["marca.business_phone", "Teléfono"],
  ["marca.business_whatsapp", "WhatsApp"],
  ["marca.business_instagram", "Instagram"],
  ["marca.business_address", "Dirección"],
  ["marca.business_city", "Ciudad"],
  ["marca.business_province", "Provincia"],
  ["marca.business_postal_code", "Código postal"],
  ["marca.business_country", "País"],
] as const;

async function save(form: FormData) {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient() as any;
  for (const [key] of fields) {
    const value = String(form.get(key) ?? "").trim();
    await db.from("app_settings").update({ value, is_public: true, updated_by: identity.user.id }).eq("key", key);
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/contacto");
}

export default async function MarcaContacto() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader title="Contacto" description="Datos de contacto y ubicación mostrados en el portal público." />
      <Card>
        <form action={save} className="admin-form">
          {fields.map(([key, label]) => (
            <Input key={key} id={key} name={key} label={label} defaultValue={get(key)} optional />
          ))}
          <Button type="submit">Guardar contacto</Button>
        </form>
      </Card>
    </>
  );
}
