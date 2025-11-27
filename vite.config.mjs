import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({

	root: ".",

	server: {

		port: 8080,
		host: "0.0.0.0",
		strictPort: false,

	},

	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html")
			}
		}
	}

});
