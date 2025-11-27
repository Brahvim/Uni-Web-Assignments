import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({

    server: {
        port: 8080,
        host: "0.0.0.0",
        strictPort: true,
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html")
            }
        }
    }
});
