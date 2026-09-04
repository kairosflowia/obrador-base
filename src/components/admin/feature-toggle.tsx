"use client";

import { useRef, useState, useTransition } from "react";

import type { FeatureFlags, FeatureKey } from "@/config/feature-config";
import { Badge, Button, ConfirmDialog, useToast } from "@/components/ui";

import { setFeatureFlagAction } from "@/app/admin/configuracion/funcionalidades/actions";
import { FEATURE_META } from "@/app/admin/configuracion/funcionalidades/feature-meta";

export function FeatureToggle({
  feature,
  enabled: initialEnabled,
  disabledToActivate = false,
}: {
  feature: FeatureKey;
  enabled: boolean;
  disabledToActivate?: boolean;
}) {
  const meta = FEATURE_META[feature];
  const [enabled, setEnabled] = useState(initialEnabled);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { push } = useToast();

  function apply(nextEnabled: boolean) {
    startTransition(async () => {
      try {
        const resolved: FeatureFlags = await setFeatureFlagAction(feature, nextEnabled);
        setEnabled(resolved[feature]);
        setOpen(false);
        push({
          title: resolved[feature] ? `${meta.label} activado` : `${meta.label} desactivado`,
          variant: "success",
        });
      } catch (error) {
        push({
          title: "No se ha podido cambiar",
          description: error instanceof Error ? error.message : undefined,
          variant: "error",
        });
      }
    });
  }

  function onClick() {
    if (enabled) {
      setOpen(true);
    } else {
      apply(true);
    }
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={enabled ? "secondary" : "primary"}
        loading={pending}
        disabled={!enabled && disabledToActivate}
        onClick={onClick}
      >
        {enabled ? "Desactivar" : "Activar"}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => apply(false)}
        title={`¿Desactivar ${meta.label}?`}
        confirmLabel="Sí, desactivar"
        destructive
        loading={pending}
        returnFocusRef={triggerRef}
      >
        <p>{meta.description}</p>
        {meta.dependsOn.length ? (
          <p className="field__help">
            Otras funcionalidades que dependen de esta también se desactivarán si no pueden funcionar sin ella.
          </p>
        ) : null}
      </ConfirmDialog>
    </>
  );
}

export function FeatureStateBadge({ enabled }: { enabled: boolean }) {
  return <Badge variant={enabled ? "success" : "neutral"}>{enabled ? "Activo" : "Inactivo"}</Badge>;
}
