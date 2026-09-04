import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const fields = [
  ["marca.content_reservation_seo_title", "Título"],
  ["marca.content_reservation_seo_description", "Descripción"],
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
  redirect("/admin/configuracion/marca/textos/reserva");
}

export default async function MarcaTextosReserva() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader title="Textos — Reserva y recoge" description="Título y descripción de la sección de reserva." />
      <TextosTabs />
      <Card>
        <form action={save} className="admin-form">
          <Input id="marca.content_reservation_seo_title" name="marca.content_reservation_seo_title" label="Título" defaultValue={get("marca.content_reservation_seo_title")} />
          <Textarea
            id="marca.content_reservation_seo_description"
            name="marca.content_reservation_seo_description"
            label="Descripción"
            defaultValue={get("marca.content_reservation_seo_description")}
            rows={2}
          />
          <Button type="submit">Guardar reserva y recoge</Button>
        </form>
      </Card>
    </>
  );
}
