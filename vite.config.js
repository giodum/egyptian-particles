import {defineConfig} from 'vite'
import autoprefixer from 'autoprefixer'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [glsl()],
})
