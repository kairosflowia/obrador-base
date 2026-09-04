import { redirect } from "next/navigation";

import { featureKeys } from "@/config/feature-config";
import { selectedProductPreset } from "@/config/site-config";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FeatureStateBadge, FeatureToggle } from "@/components/admin/feature-toggle";
import { Alert, Badge, Card } from "@/components/ui";
import { getBrandSettings } from "@/lib/brand/get-brand-settings";
import { getCurrentIdentity } from "@/lib/auth/session";

import { FEATURE_META } from "./feature-meta";

export default async function MarcaFuncionalidades() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) redirect("/cuenta/acceso-denegado");

  const siteConfig = await getBrandSettings();

  return (
    <>
      <AdminPageHeader
        title="Funcionalidades"
        description="Activa o desactiva módulos del portal. Los cambios se aplican de inmediato y respetan las dependencias entre funcionalidades."
      />
      <Card>
        <h2>Preset actual</h2>
        <p>
          <Badge variant="information">{selectedProductPreset}</Badge>{" "}
          <span className="field__help">
            Define los valores de fábrica al desplegar. Los ajustes de aquí abajo son overrides que se guardan aparte y
            no cambian el preset.
          </span>
        </p>
      </Card>

      <div className="admin-image-grid">
        {featureKeys.map((key) => {
          const meta = FEATURE_META[key];
          const enabled = siteConfig.features[key];
          const missingDeps = meta.dependsOn.filter((dep) => !siteConfig.features[dep]);

          return (
            <Card key={key}>
              <h3>{meta.label}</h3>
              <p>{meta.description}</p>
              <p>
                <FeatureStateBadge enabled={enabled} />
              </p>
              {meta.dependsOn.length ? (
                <p className="field__help">
                  Depende de: {meta.dependsOn.map((dep) => FEATURE_META[dep].label).join(", ")}
                </p>
              ) : null}
              {!enabled && missingDeps.length ? (
                <Alert variant="warning" title="No se puede activar todavía">
                  Primero activa: {missingDeps.map((dep) => FEATURE_META[dep].label).join(", ")}.
                </Alert>
              ) : null}
              <FeatureToggle feature={key} enabled={enabled} disabledToActivate={missingDeps.length > 0} />
            </Card>
          );
        })}
      </div>
    </>
  );
}
