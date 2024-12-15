import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import alias from '@rollup/plugin-alias'
import { resolve } from 'path'
const projectRootDir = resolve(__dirname);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    alias(),
    vue()
  ],
  resolve: {
    alias: {
      // aliases for paths, tired of long nested routes
      "@": resolve(projectRootDir, "./src"),
      "@utils": resolve(projectRootDir, "./utils"),
    },
  },
 
  
})
