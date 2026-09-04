import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const fields = [
  ["marca.content_newsletter_title", "Título"],
  ["marca.content_newsletter_description", "Descripción"],
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
  redirect("/admin/configuracion/marca/textos/newsletter");
}

export default async function MarcaTextosNewsletter() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader title="Textos — Newsletter" description="Título y descripción del bloque de suscripción a novedades." />
      <TextosTabs />
      <Card>
        <form action={save} className="admin-form">
          <Input id="marca.content_newsletter_title" name="marca.content_newsletter_title" label="Título" defaultValue={get("marca.content_newsletter_title")} />
          <Textarea
            id="marca.content_newsletter_description"
            name="marca.content_newsletter_description"
            label="Descripción"
            defaultValue={get("marca.content_newsletter_description")}
            rows={2}
          />
          <Button type="submit">Guardar newsletter</Button>
        </form>
      </Card>
    </>
  );
}
