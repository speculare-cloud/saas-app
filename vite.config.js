import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import removeConsole from "vite-plugin-remove-console";

export default defineConfig(({command, mode, ssrBuild}) => {
	console.log("Current mode:", mode);
	return {
		plugins: [vue()],
		server: {
			port: 8080,
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		esbuild: {
			drop: mode !== 'development' ? ['console', 'debugger'] : [],
		},
	}
})