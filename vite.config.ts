import { defineConfig, type Plugin } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { fetchArchives } from "./src/archive.ts";

// The setlist is fetched once at build time and shipped as /data.json, so the
// page never waits on the slow Apps Script endpoint.
function setlistData(): Plugin {
  let json: Promise<string> | undefined;
  const load = () =>
    json ??= fetchArchives().then((archives) => JSON.stringify(archives));

  return {
    name: "setlist-data",
    configureServer(server) {
      server.middlewares.use("/data.json", async (_req, res, next) => {
        try {
          res.setHeader("Content-Type", "application/json");
          res.end(await load());
        } catch (e) {
          next(e);
        }
      });
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "data.json",
        source: await load(),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    deno(),
    react(),
    setlistData(),
  ],
});
