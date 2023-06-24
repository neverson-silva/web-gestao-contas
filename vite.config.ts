import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    react(),
    {
      // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: true,
        emitError: true,
        emitWarning: true,
      }),
      apply: 'serve',
      enforce: 'post',
    },
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@components': `${path.resolve(__dirname, './src/components/')}`,
      '@apis': `${path.resolve(__dirname, './src/apis/')}`,
      '@assets': `${path.resolve(__dirname, './src/assets/')}`,
      '@contexts': `${path.resolve(__dirname, './src/contexts/')}`,
      '@hooks': `${path.resolve(__dirname, './src/hooks/')}`,
      '@models': `${path.resolve(__dirname, './src/models/')}`,
      '@pages': `${path.resolve(__dirname, './src/pages/')}`,
      '@utils': `${path.resolve(__dirname, './src/utils/')}`,
      '@routes': `${path.resolve(__dirname, './src/routes/')}`,
      '@public': `${path.resolve(__dirname, './public/')}`,
    },
  },
})
