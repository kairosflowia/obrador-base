"use client";

import { fontCssVar } from "@/config/font-options";

export type BrandPreviewState = {
  colorBackground: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  fontDisplay: string;
  fontBody: string;
  logo?: string;
  heroTitle: string;
  heroDescription: string;
};

export function BrandPreview({ state }: { state: BrandPreviewState }) {
  const fontDisplayVar = fontCssVar(state.fontDisplay, "Georgia, serif");
  const fontBodyVar = fontCssVar(state.fontBody, "Arial, sans-serif");

  return (
    <div
      className="brand-preview"
      style={{
        background: state.colorBackground,
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        fontFamily: fontBodyVar,
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {[state.colorBackground, state.colorPrimary, state.colorSecondary, state.colorAccent].map((color, i) => (
          <span
            key={i}
            title={color}
            style={{ width: 28, height: 28, borderRadius: "999px", background: color, border: "1px solid rgba(0,0,0,0.15)" }}
          />
        ))}
      </div>

      {state.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={state.logo} alt="Logo" style={{ height: 40, marginBottom: "1rem" }} />
      ) : null}

      <h2 style={{ fontFamily: fontDisplayVar, color: state.colorAccent, margin: "0 0 0.5rem" }}>{state.heroTitle}</h2>
      <p style={{ margin: "0 0 1rem", color: "inherit" }}>{state.heroDescription}</p>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <span style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", background: state.colorPrimary, color: "#fff", fontFamily: fontBodyVar }}>
          Botón primario
        </span>
        <span
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            background: state.colorSecondary,
            color: state.colorAccent,
            fontFamily: fontBodyVar,
          }}
        >
          Botón secundario
        </span>
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "0.5rem", padding: "1rem", background: "rgba(255,255,255,0.5)" }}>
        <strong style={{ fontFamily: fontDisplayVar }}>Pan de masa madre</strong>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>Card de producto de ejemplo.</p>
      </div>
    </div>
  );
}
