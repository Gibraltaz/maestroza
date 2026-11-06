import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: "0.0.0.0",
    port: 9100,
    allowedHosts: true,
    proxy: {
      '/api': {
          target: 'http://localhost:9101', // Adresse backend
          //changeOrigin: true,
          //pathRewrite: { '^/api': '' },
      }
    }
  },

})
