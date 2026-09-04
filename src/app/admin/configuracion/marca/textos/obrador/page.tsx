import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const scalarFields = [
  ["marca.content_obrador_intro_title", "Título"],
  ["marca.content_obrador_intro_description", "Descripción"],
  ["marca.content_obrador_cta_title", "Título de cierre"],
] as const;

const PROCESS_KEY = "marca.content_obrador_process";
const ICONS = ["starter", "time", "oven", "grain"] as const;

type ProcessStep = { number: string; icon: string; title: string; description: string };
const DEFAULT_PROCESS: ProcessStep[] = [
  { number: "01", icon: "starter", title: "La masa madre", description: "Harina y agua que fermentan y alimentamos cada día." },
  { number: "02", icon: "time", title: "La fermentación", description: "Después de amasar, esperamos y dejamos que la masa marque el ritmo." },
  { number: "03", icon: "oven", title: "El horno", description: "Formamos cada pieza y la horneamos hasta conseguir su corteza y su miga." },
  { number: "04", icon: "grain", title: "La rutina", description: "Amasar, reposar, formar, hornear y volver a empezar." },
];

async function save(form: FormData) {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient() as any;
  for (const [key] of scalarFields) {
    const value = String(form.get(key) ?? "").trim();
    await db.from("app_settings").update({ value, is_public: true, updated_by: identity.user.id }).eq("key", key);
  }
  const items = DEFAULT_PROCESS.map((step, i) => ({
    number: step.number,
    icon: String(form.get(`process_icon_${i}`) ?? step.icon),
    title: String(form.get(`process_title_${i}`) ?? "").trim(),
    description: String(form.get(`process_description_${i}`) ?? "").trim(),
  })).filter((item) => item.title);
  if (items.length) {
    await db.from("app_settings").update({ value: items, is_public: true, updated_by: identity.user.id }).eq("key", PROCESS_KEY);
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/textos/obrador");
}

export default async function MarcaTextosObrador() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", [...scalarFields.map(([key]) => key), PROCESS_KEY]);
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };
  const processRaw = data?.find((row: any) => row.key === PROCESS_KEY)?.value;
  const process: ProcessStep[] = Array.isArray(processRaw) && processRaw.length ? processRaw : DEFAULT_PROCESS;

  return (
    <>
      <AdminPageHeader title="Textos — Obrador / Proceso" description="Presentación del obrador y los pasos del proceso de elaboración." />
      <TextosTabs />
      <Card>
        <form action={save} className="admin-form">
          {scalarFields.map(([key, label]) =>
            key.includes("description") ? (
              <Textarea key={key} id={key} name={key} label={label} defaultValue={get(key)} rows={2} />
            ) : (
              <Input key={key} id={key} name={key} label={label} defaultValue={get(key)} />
            ),
          )}

          <h3>Proceso</h3>
          {DEFAULT_PROCESS.map((_, i) => {
            const step = process[i] ?? DEFAULT_PROCESS[i];
            return (
              <fieldset key={i} className="admin-form__fieldset">
                <legend>Paso {step.number}</legend>
                <Input id={`process_title_${i}`} name={`process_title_${i}`} label="Título" defaultValue={step.title} />
                <Textarea id={`process_description_${i}`} name={`process_description_${i}`} label="Descripción" defaultValue={step.description} rows={2} />
                <Select id={`process_icon_${i}`} name={`process_icon_${i}`} label="Icono" defaultValue={step.icon}>
                  {ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </Select>
              </fieldset>
            );
          })}

          <Button type="submit">Guardar obrador</Button>
        </form>
      </Card>
    </>
  );
}
