import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages 部署設定（若使用自訂 domain 可移除 base）
  site: "https://orangeapple-jp.github.io",
  base: "/jp-home",
  vite: {
    plugins: [tailwindcss()],
  },
});
