import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
// import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import { pluginWebExtension } from "rsbuild-plugin-web-extension-local";
import { pluginSass } from '@rsbuild/plugin-sass';
import manifest from "./manifest";

export default defineConfig({
  environments: {
    web: {
      output: {
        copy: [
          {
            from: './public'
          }
        ],
      },
      plugins: [
        pluginSass(),
        pluginReact(),
        pluginWebExtension({
          manifest,
        }),
      ],
    },
    "web-worker": {
      source: {
        entry: {
          content: "./src/content/index.ts",
          "content/skipbookmarkearth": './src/content/skipbookmarkearth/index.ts',
          background: "./src/background/index.ts",
        }
      },
      output: {
        emitCss: true,
        target: "web-worker"
      },
      plugins: [
        pluginSass(),
      ]
    },
  },
  dev: {
    watchFiles: [
      {
        paths: "./manifest.ts",
        type: "reload-server"
      }
    ]
  },
  server: {
    publicDir: {
      copyOnBuild: false
    }
  },
});
