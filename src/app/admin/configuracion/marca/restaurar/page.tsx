import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert, Button, Card } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

async function resetBrandSettingsAction() {
  "use server";
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) throw new Error("forbidden");
  const db = createAdminClient();
  // Se borran las filas (no se ponen a null) para que getBrandSettings()
  // vuelva a caer en los valores de fábrica de siteConfig/contentConfig.
  // Los archivos ya subidos a brand-assets no se eliminan: son huérfanos de
  // bajo coste, y borrar storage por error es más costoso que dejarlos.
  await db.from("app_settings").delete().like("key", "marca.%");
  revalidateTag("brand-settings", "max");
  revalidatePath("/", "layout");
  redirect("/admin/configuracion/marca/restaurar?done=1");
}

export default async function MarcaRestaurar({ searchParams }: { searchParams: Promise<{ done?: string }> }) {
  const { done } = await searchParams;

  return (
    <>
      <AdminPageHeader
        title="Restaurar configuración demo"
        description="Elimina toda la personalización de marca (identidad, colores, tipografía, contacto, textos e imágenes) y vuelve a la identidad genérica del obrador-base."
      />
      {done ? <Alert variant="success" title="Configuración restaurada">El portal ha vuelto a la identidad genérica.</Alert> : null}
      <Card>
        <p>
          Esta acción no se puede deshacer. Los archivos ya subidos no se eliminan del almacenamiento, pero dejarán de
          usarse en el portal.
        </p>
        <form action={resetBrandSettingsAction}>
          <Button type="submit" variant="secondary">
            Restaurar configuración demo
          </Button>
        </form>
      </Card>
    </>
  );
}
