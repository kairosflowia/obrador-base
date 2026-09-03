import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, Card, Input } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

import { uploadBrandImageAction } from "./actions";
import { SLOT_KEYS, type BrandImageSlot } from "./slots";

const SLOTS: { slot: BrandImageSlot; label: string; help?: string }[] = [
  { slot: "logo", label: "Logo" },
  { slot: "icon", label: "Favicon / icono" },
  { slot: "appleIcon", label: "Icono para iOS" },
  { slot: "hero", label: "Imagen del hero" },
  { slot: "obrador", label: "Imagen del obrador" },
  { slot: "obradorProcess", label: "Imagen del proceso del obrador" },
  { slot: "team", label: "Imagen del equipo" },
  { slot: "institutional", label: "Imagen institucional" },
  { slot: "subscriptions", label: "Imagen de suscripciones" },
  { slot: "social", label: "Imagen Open Graph", help: "Usada al compartir el portal en redes sociales." },
];

export default async function MarcaImagenes() {
  const db = createAdminClient() as any;
  const { data } = await db.from("app_settings").select("key,value").in("key", Object.values(SLOT_KEYS));
  const get = (slot: BrandImageSlot) => {
    const raw = data?.find((row: any) => row.key === SLOT_KEYS[slot])?.value;
    return typeof raw === "string" ? raw : "";
  };

  return (
    <>
      <AdminPageHeader
        title="Imágenes"
        description="Logo, favicon e imágenes institucionales. Cada archivo se sube al instante al guardar."
      />
      <div className="admin-image-grid">
        {SLOTS.map(({ slot, label, help }) => {
          const current = get(slot);
          return (
            <Card key={slot}>
              <h3>{label}</h3>
              {current ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current} alt={label} style={{ maxWidth: "100%", maxHeight: 120, marginBottom: "0.75rem" }} />
              ) : (
                <p className="field__help">Sin imagen personalizada.</p>
              )}
              <form action={uploadBrandImageAction} className="admin-form">
                <input type="hidden" name="slot" value={slot} />
                <Input id={`file_${slot}`} name="image" label="Nuevo archivo" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/x-icon" helpText={help} />
                <Button type="submit">Subir</Button>
              </form>
            </Card>
          );
        })}
      </div>
    </>
  );
}
