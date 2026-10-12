import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// `npm run dev`  -> talks to the real backend (default http://localhost:8000, set BACKEND_URL to change)
// `npm run mock` -> no backend at all: src/api/mock.js fakes the whole API in the browser
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.BACKEND_URL || "http://localhost:8000";
  const proxy = { target: backend, changeOrigin: false };
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: mode === "mock" ? undefined : { "/api": proxy, "/media": proxy, "/healthz": proxy },
    },
    build: { outDir: "dist", sourcemap: false },
  };
});
