import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    sessionKVBindingName: undefined,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  site: "https://intru.in",
  vite: {
    ssr: {
      external: ["node:crypto"],
    },
  },
});
