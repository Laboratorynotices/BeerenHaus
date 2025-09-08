import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// Определяем константу MD_BREAKPOINT (rem) для использования в CSS и JavaScript
// Значение 48rem соответствует 768px, что является стандартным значением для медиазапросов
export const MD_BREAKPOINT = 48;
// Значение 64rem соответствует 1024px, что является стандартным значением для медиазапросов
export const LG_BREAKPOINT = 64;

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), tailwindcss()],
  base: mode === "ghpages" ? "/BeerenHaus/" : "/",
  define: {
    // Делаем константу доступной в глобальном окружении JavaScript
    "import.meta.env.MD_BREAKPOINT": MD_BREAKPOINT,
  },
  css: {
    // Передаем константу в CSS как переменную
    preprocessorOptions: {
      scss: {
        additionalData: `
          @theme {
            --md-breakpoint: ${MD_BREAKPOINT}rem;
            --lg-breakpoint: ${LG_BREAKPOINT}rem;
          }
        `,
      },
    },
  },
}));
