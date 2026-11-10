import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Separate from vite.config.ts (which the dev server / build use) so the
// test config doesn't need to carry the dev-only proxy setup, and so this
// stays a plain object Vitest can load without going through loadEnv.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    exclude: ["**/node_modules/**", "dist/**", "e2e/**", "app/**"],
    coverage: {
      provider: "v8",
      include: ["src/**", "api/**"],
      exclude: ["src/test/**", "**/*.d.ts"],
    },
  },
});
