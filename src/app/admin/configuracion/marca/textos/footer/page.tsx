import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const fields = [
  ["marca.content_footer_description", "Descripción"],
  ["marca.content_footer_legal_name", "Nombre legal (footer)"],
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
  redirect("/admin/configuracion/marca/textos/footer");
}

export default async function MarcaTextosFooter() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader title="Textos — Footer" description="Descripción breve mostrada en el pie de página." />
      <TextosTabs />
      <Card>
        <form action={save} className="admin-form">
          {fields.map(([key, label]) => (
            <Input key={key} id={key} name={key} label={label} defaultValue={get(key)} optional />
          ))}
          <Button type="submit">Guardar footer</Button>
        </form>
      </Card>
    </>
  );
}
