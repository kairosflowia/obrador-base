import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { TextosTabs } from "../textos-tabs";

const scalarFields = [
  ["marca.content_subscriptions_name", "Nombre del plan"],
  ["marca.content_subscriptions_intro_title", "Título"],
  ["marca.content_subscriptions_intro_description", "Descripción"],
] as const;

const STEPS_KEY = "marca.content_subscriptions_steps";
const ICONS = ["grain", "calendar", "package"] as const;

type Step = { icon: string; title: string; description: string };
const DEFAULT_STEPS: Step[] = [
  { icon: "grain", title: "Elige tu pan", description: "Monta una cesta con los panes que quieres recibir habitualmente." },
  { icon: "calendar", title: "Define tu frecuencia", description: "Escoge el ritmo que mejor encaje en tu rutina." },
  { icon: "package", title: "Recógelo sin volver a pedir", description: "Prepararemos tu cesta automáticamente para el punto de recogida elegido." },
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
  const items = DEFAULT_STEPS.map((step, i) => ({
    icon: String(form.get(`step_icon_${i}`) ?? step.icon),
    title: String(form.get(`step_title_${i}`) ?? "").trim(),
    description: String(form.get(`step_description_${i}`) ?? "").trim(),
  })).filter((item) => item.title);
  if (items.length) {
    await db.from("app_settings").update({ value: JSON.stringify(items), is_public: true, updated_by: identity.user.id }).eq("key", STEPS_KEY);
  }
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/textos/plan-de-pan");
}

export default async function MarcaTextosPlanDePan() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", [...scalarFields.map(([key]) => key), STEPS_KEY]);
  const get = (key: string) => {
    const raw = data?.find((row: any) => row.key === key)?.value;
    return typeof raw === "string" ? raw : "";
  };
  const stepsRaw = data?.find((row: any) => row.key === STEPS_KEY)?.value;
  const steps: Step[] = Array.isArray(stepsRaw) && stepsRaw.length ? stepsRaw : DEFAULT_STEPS;

  return (
    <>
      <AdminPageHeader title="Textos — Plan de Pan" description="Nombre del plan de suscripción y pasos de cómo funciona." />
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

          <h3>Cómo funciona</h3>
          {DEFAULT_STEPS.map((_, i) => {
            const step = steps[i] ?? DEFAULT_STEPS[i];
            return (
              <fieldset key={i} className="admin-form__fieldset">
                <legend>Paso {i + 1}</legend>
                <Input id={`step_title_${i}`} name={`step_title_${i}`} label="Título" defaultValue={step.title} />
                <Textarea id={`step_description_${i}`} name={`step_description_${i}`} label="Descripción" defaultValue={step.description} rows={2} />
                <Select id={`step_icon_${i}`} name={`step_icon_${i}`} label="Icono" defaultValue={step.icon}>
                  {ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </Select>
              </fieldset>
            );
          })}

          <Button type="submit">Guardar plan de pan</Button>
        </form>
      </Card>
    </>
  );
}
