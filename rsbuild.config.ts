import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import { pluginSass } from '@rsbuild/plugin-sass';
import manifest from "./manifest";

export default defineConfig({
  source: {
    entry: {
      content: "./src/content/index.ts",
      "content/skipbookmarkearth": './src/content/skipbookmarkearth/index.ts' 
    }
  },
  plugins: [
    pluginSass(),
    pluginReact(),
    pluginWebExtension({
      manifest,
    }),
  ],
});
