import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy: forwards /cms-api/* to the WanderOn staging backend so the
// browser avoids CORS issues while developing locally. In production the
// app calls the backend directly (see src/api/config.ts).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // FMS/PMS host used by the /pms-api dev proxy (Razorpay order/verify). Set
  // VITE_FMS_PROXY_TARGET in .env to the real FMS base URL (host root; the
  // /api/v1/payment path is added by src/api/config.ts).
  const pmsTarget = env.VITE_FMS_PROXY_TARGET || "https://<pms-host>";

  return {
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
        "/pms-api": {
          target: pmsTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/pms-api/, ""),
        },
      },
    },
  };
});
