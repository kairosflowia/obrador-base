import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";

export default async function Preview() {
  const siteConfig = await getBrandSettings();
  return <>
    <AdminPageHeader title="Previsualización de email" description="Usa datos de ejemplo explícitamente técnicos; no se envía ningún mensaje." />
    <div style={{ background: siteConfig.brand.colors.background, color: siteConfig.brand.colors.foreground, padding: 32, maxWidth: 600 }}>
      <strong>{siteConfig.brand.name}</strong>
      <h2>Vista previa</h2>
      <p>Selecciona una plantilla activa desde el listado para revisar su asunto, texto y variables.</p>
    </div>
  </>;
}
