import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { exclude: ["tests/e2e/**", "node_modules/**", ".next/**"] },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next.js resuelve "server-only" como no-op fuera de un Client
      // Component; fuera del bundler de Next (aquí, en Vitest/Node) el
      // paquete real lanza un error si detecta el entorno de test, así que
      // se apunta al shim vacío que el propio paquete expone para SSR/RSC.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
});
