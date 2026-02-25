import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  site: "https://kbs-sol.github.io",
  base: "/intru-ecom",
  vite: {
    ssr: {
      external: ["node:crypto"],
    },
  },
});
