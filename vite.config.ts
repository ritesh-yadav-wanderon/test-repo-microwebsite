import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy: forwards /cms-api/* to the WanderOn staging backend so the
// browser avoids CORS issues while developing locally. In production the
// app calls the backend directly (see src/api/config.ts).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/cms-api": {
        target: "https://cms-backend-staging-b2yue.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/cms-api/, ""),
      },
      "/lf-api": {
        target: "https://dev-lf-api.wanderon.in",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/lf-api/, ""),
      },
    },
  },
});
