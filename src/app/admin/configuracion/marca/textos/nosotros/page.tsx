import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const scalarFields = [
  ["marca.content_nosotros_intro_title", "Título"],
  ["marca.content_nosotros_intro_description", "Descripción"],
  ["marca.content_nosotros_values_title", "Título de valores"],
  ["marca.content_nosotros_values_description", "Descripción de valores"],
  ["marca.content_nosotros_cta_title", "Título de cierre"],
  ["marca.content_nosotros_cta_description", "Descripción de cierre"],
] as const;

const VALUES_KEY = "marca.content_nosotros_values_items";
const TONES = ["terracotta", "yellow", "green", "blue", "plain"] as const;

type ValueItem = { title: string; description: string; tone: string };
const DEFAULT_VALUES: ValueItem[] = [
  { title: "Tradición útil", description: "Conservamos las técnicas que aportan calidad y sentido al proceso.", tone: "terracotta" },
  { title: "Ingredientes honestos", description: "Cada ingrediente tiene una función y un origen que podemos explicar.", tone: "yellow" },
  { title: "Tiempo necesario", description: "Respetamos el ritmo de la masa sin buscar atajos.", tone: "green" },
  { title: "Comunidad cercana", description: "Un obrador existe gracias a quienes trabajan, colaboran y vuelven.", tone: "blue" },
];

async function save(form: FormData) {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient() as any;
  for (const [key] of scalarFields) {
    const value = String(form.get(key) ?? "").trim();
    await db.from("app_settings").update({ value: JSON.stringify(value), is_public: true, updated_by: identity.user.id }).eq("key", key);
  }
  const items = DEFAULT_VALUES.map((_, i) => ({
    title: String(form.get(`value_title_${i}`) ?? "").trim(),
    description: String(form.get(`value_description_${i}`) ?? "").trim(),
    tone: String(form.get(`value_tone_${i}`) ?? "plain"),
  })).filter((item) => item.title);
  if (items.length) {
    await db.from("app_settings").update({ value: JSON.stringify(items), is_public: true, updated_by: identity.user.id }).eq("key", VALUES_KEY);
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/textos/nosotros");
}

export default async function MarcaTextosNosotros() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", [...scalarFields.map(([key]) => key), VALUES_KEY]);
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };
  const valuesRaw = data?.find((row: any) => row.key === VALUES_KEY)?.value;
  const values: ValueItem[] = Array.isArray(valuesRaw) && valuesRaw.length ? valuesRaw : DEFAULT_VALUES;

  return (
    <>
      <AdminPageHeader title="Textos — Nosotros / Valores" description="Presentación del equipo y los valores del obrador." />
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

          <h3>Valores</h3>
          {DEFAULT_VALUES.map((_, i) => {
            const item = values[i] ?? DEFAULT_VALUES[i];
            return (
              <fieldset key={i} className="admin-form__fieldset">
                <legend>Valor {i + 1}</legend>
                <Input id={`value_title_${i}`} name={`value_title_${i}`} label="Título" defaultValue={item.title} />
                <Textarea id={`value_description_${i}`} name={`value_description_${i}`} label="Descripción" defaultValue={item.description} rows={2} />
                <Select id={`value_tone_${i}`} name={`value_tone_${i}`} label="Tono" defaultValue={item.tone}>
                  {TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </Select>
              </fieldset>
            );
          })}

          <Button type="submit">Guardar nosotros</Button>
        </form>
      </Card>
    </>
  );
}
