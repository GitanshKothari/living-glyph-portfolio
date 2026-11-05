import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "static-route-preview",
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = new URL(req.url || "/", "http://localhost");
          if (
            url.pathname !== "/" &&
            existsSync("dist" + url.pathname + "/index.html")
          )
            req.url = url.pathname + "/index.html" + url.search;
          next();
        });
      },
    },
  ],
});
