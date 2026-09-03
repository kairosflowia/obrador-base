"use client";

import { useState } from "react";

import { Button, Card, Input, Select } from "@/components/ui";
import { FONT_OPTIONS } from "@/config/font-options";

import { BrandPreview, type BrandPreviewState } from "./brand-preview";

type ColorFontState = Omit<BrandPreviewState, "heroTitle" | "heroDescription" | "logo">;

export function BrandColorsForm({
  action,
  initial,
  heroTitle,
  heroDescription,
  logo,
}: {
  action: (form: FormData) => void;
  initial: ColorFontState;
  heroTitle: string;
  heroDescription: string;
  logo: string;
}) {
  const [state, setState] = useState<BrandPreviewState>({ ...initial, heroTitle, heroDescription, logo });

  return (
    <div className="admin-marca-colors">
      <Card>
        <form action={action} className="admin-form">
          <Input
            id="marca.color_primary"
            name="marca.color_primary"
            label="Color principal"
            type="color"
            defaultValue={state.colorPrimary}
            onChange={(e) => setState((s) => ({ ...s, colorPrimary: e.target.value }))}
          />
          <Input
            id="marca.color_secondary"
            name="marca.color_secondary"
            label="Color secundario"
            type="color"
            defaultValue={state.colorSecondary}
            onChange={(e) => setState((s) => ({ ...s, colorSecondary: e.target.value }))}
          />
          <Input
            id="marca.color_background"
            name="marca.color_background"
            label="Color de fondo"
            type="color"
            defaultValue={state.colorBackground}
            onChange={(e) => setState((s) => ({ ...s, colorBackground: e.target.value }))}
          />
          <Input
            id="marca.color_accent"
            name="marca.color_accent"
            label="Color de acento"
            type="color"
            defaultValue={state.colorAccent}
            onChange={(e) => setState((s) => ({ ...s, colorAccent: e.target.value }))}
          />
          <Select
            id="marca.font_display"
            name="marca.font_display"
            label="Tipografía de títulos"
            defaultValue={state.fontDisplay}
            onChange={(e) => setState((s) => ({ ...s, fontDisplay: e.target.value }))}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </Select>
          <Select
            id="marca.font_body"
            name="marca.font_body"
            label="Tipografía de texto"
            defaultValue={state.fontBody}
            onChange={(e) => setState((s) => ({ ...s, fontBody: e.target.value }))}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </Select>
          <Button type="submit">Guardar colores y tipografía</Button>
        </form>
      </Card>
      <div>
        <p className="field__help">Vista previa (no se guarda hasta pulsar el botón)</p>
        <BrandPreview state={state} />
      </div>
    </div>
  );
}
