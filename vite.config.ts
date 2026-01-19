import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const defineGlobals = {
    __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
    __API_TIMEOUT__: JSON.stringify(env.VITE_API_TIMEOUT),
    __ENABLE_MOCK_DATA__: JSON.stringify(env.VITE_ENABLE_MOCK_DATA),
    __AMADEUS_API_KEY__: JSON.stringify(env.VITE_AMADEUS_API_KEY),
  };

  return {
    plugins: [react(), tailwindcss()],
    build: {
      cssMinify: "esbuild",
    },
    define: defineGlobals,

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            $app-name: ${JSON.stringify(env.VITE_APP_NAME)};
            $primary-color: #1d4ed8; // example
          `,
        },
      },
    },
  };
});
