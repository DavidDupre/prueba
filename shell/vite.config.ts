import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    federation({
      name: "shell",
      filename: "remoteEntry.js",
      exposes: {
        "./FormComponentModelInputs":
          "./src/components/Forms/FormComponentModelInputs.vue",
      },
      shared: ["vue", "quasar"],
    }),
  ],
});
// https://vitejs.dev/config/
