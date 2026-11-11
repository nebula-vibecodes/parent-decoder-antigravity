import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type PluginOption } from "vite"

// Safely load inspectAttr if available; fallback gracefully if @babel dependencies are absent
let inspectAttrPlugin: PluginOption | null = null
try {
  const mod = await import('kimi-plugin-inspect-react')
  if (typeof mod?.inspectAttr === 'function') {
    inspectAttrPlugin = mod.inspectAttr()
  }
} catch {
  // kimi-plugin-inspect-react is an optional development inspector
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    ...(inspectAttrPlugin ? [inspectAttrPlugin] : []),
    react()
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
