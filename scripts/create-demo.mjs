// FASE 14: prepara rápidamente el .env.local de una demo nueva para un
// cliente, a partir de unas pocas preguntas. No crea ni conecta ningún
// servicio externo (Supabase, Stripe, Resend, Vercel) — eso sigue siendo
// un paso manual posterior. El resultado es solo el valor de fábrica/
// seed inicial: en runtime, la fuente de verdad sigue siendo app_settings
// (editable desde /admin/configuracion/marca una vez el Supabase esté
// conectado).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_LOCAL = resolve(ROOT, ".env.local");
const ENV_EXAMPLE = resolve(ROOT, ".env.example");

const PRESETS = ["BASIC", "COMMERCE", "FULL"];
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const SLUG_OK = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortName(name) {
  const first = name.trim().split(/\s+/)[0] ?? name.trim();
  return first.toUpperCase().slice(0, 24);
}

async function ask(rl, question, { validate, defaultValue } = {}) {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  while (true) {
    const answer = (await rl.question(`${question}${suffix} `)).trim();
    const value = answer || defaultValue || "";
    if (!value) {
      console.log("  Este dato es obligatorio.");
      continue;
    }
    if (validate) {
      const error = validate(value);
      if (error) {
        console.log(`  ${error}`);
        continue;
      }
    }
    return value;
  }
}

function readEnvFile(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function setEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) return content.replace(pattern, line);
  return content.trimEnd() + `\n${line}\n`;
}

async function main() {
  console.log("Preparar demo nueva — obrador-base");
  console.log("Solo genera la configuración inicial (.env.local). No crea ni conecta Supabase, Stripe, Resend ni Vercel.\n");

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const clientName = await ask(rl, "Nombre del cliente (obrador):");

    const suggestedSlug = toSlug(clientName);
    const slug = await ask(rl, "Slug (minúsculas, guiones):", {
      defaultValue: suggestedSlug,
      validate: (value) => (SLUG_OK.test(value) ? null : "Usa minúsculas, números y guiones (ej: panaderia-luz)."),
    });

    const city = await ask(rl, "Ciudad:");

    const preset = (
      await ask(rl, `Preset (${PRESETS.join(" / ")}):`, {
        defaultValue: "FULL",
        validate: (value) => (PRESETS.includes(value.toUpperCase()) ? null : `Elige uno de: ${PRESETS.join(", ")}.`),
      })
    ).toUpperCase();

    const colorPrimary = await ask(rl, "Color principal (hex, ej: #b97844):", {
      defaultValue: "#b97844",
      validate: (value) => (HEX_COLOR.test(value) ? null : "Usa un color hexadecimal, ej: #b97844."),
    });

    const colorSecondary = await ask(rl, "Color secundario (hex, ej: #ede8dc):", {
      defaultValue: "#ede8dc",
      validate: (value) => (HEX_COLOR.test(value) ? null : "Usa un color hexadecimal, ej: #ede8dc."),
    });

    let base = readEnvFile(ENV_LOCAL);
    if (!base) {
      base = readEnvFile(ENV_EXAMPLE);
      if (!base) throw new Error("No se encontró .env.local ni .env.example en la raíz del proyecto.");
      console.log("\nNo existía .env.local: se crea a partir de .env.example.");
    }

    const updates = {
      NEXT_PUBLIC_BRAND_NAME: clientName,
      NEXT_PUBLIC_BRAND_SHORT_NAME: shortName(clientName),
      NEXT_PUBLIC_CITY: city,
      NEXT_PUBLIC_PRODUCT_PRESET: preset,
      NEXT_PUBLIC_COLOR_PRIMARY: colorPrimary,
      NEXT_PUBLIC_COLOR_SECONDARY: colorSecondary,
      NEXT_PUBLIC_SITE_URL: `https://${slug}.vercel.app`,
    };

    let next = base;
    for (const [key, value] of Object.entries(updates)) {
      next = setEnvValue(next, key, value);
    }

    writeFileSync(ENV_LOCAL, next, "utf8");

    console.log("\n.env.local actualizado con:");
    for (const [key, value] of Object.entries(updates)) {
      console.log(`  ${key}=${value}`);
    }

    console.log("\nEsto es solo el valor de fábrica/seed inicial. No se ha creado ni conectado:");
    console.log("  - Supabase (NEXT_PUBLIC_SUPABASE_URL, claves)");
    console.log("  - Stripe (STRIPE_SECRET_KEY, claves)");
    console.log("  - Resend (RESEND_API_KEY)");
    console.log("  - Vercel (proyecto, dominio, variables de entorno remotas)");

    console.log("\nPróximos pasos manuales:");
    console.log("  1. Conectar un proyecto Supabase y completar sus variables en .env.local.");
    console.log("  2. npm run dev — revisar el portal con la marca inicial ya aplicada.");
    console.log("  3. Una vez el Supabase esté conectado y las migraciones aplicadas, afinar todo");
    console.log("     desde /admin/configuracion/inicio (asistente de puesta en marcha).");
    console.log("  4. Configurar Stripe, Resend y el proyecto de Vercel cuando corresponda.");
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
