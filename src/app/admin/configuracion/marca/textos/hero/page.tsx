import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const fields = [
  ["marca.content_hero_title", "Hero title"],
  ["marca.content_hero_description", "Hero subtitle"],
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
  redirect("/admin/configuracion/marca/textos/hero");
}

export default async function MarcaTextosHero() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", fields.map(([key]) => key));
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader title="Textos — Hero" description="Título y subtítulo mostrados en la portada." />
      <TextosTabs />
      <Card>
        <form action={save} className="admin-form">
          <Input id="marca.content_hero_title" name="marca.content_hero_title" label="Hero title" defaultValue={get("marca.content_hero_title")} />
          <Textarea
            id="marca.content_hero_description"
            name="marca.content_hero_description"
            label="Hero subtitle"
            defaultValue={get("marca.content_hero_description")}
            rows={3}
          />
          <Button type="submit">Guardar hero</Button>
        </form>
      </Card>
    </>
  );
}
