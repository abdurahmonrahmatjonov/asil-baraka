import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@context": path.resolve(__dirname, "./src/context"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@lib": path.resolve(__dirname, "./src/lib"),
			"@helpers": path.resolve(__dirname, "./src/helpers"),
		},
	},

	server: {
		port: 3000,
		watch: {
			usePolling: true,
		},
	},
	preview: {
		port: 3000,
	},
	build: {
		assetsDir: "assets",
	},
	define: {
		// env variable from .env file
		"process.env.VITE_KEY": JSON.stringify(process.env.VITE_KEY),
		"process.env.VITE_BASE_URL": JSON.stringify(process.env.VITE_BASE_URL),
	},
});
