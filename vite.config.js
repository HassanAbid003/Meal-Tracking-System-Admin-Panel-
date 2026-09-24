// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-charts',
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              priority: 50,
            },
            {
              name: 'vendor-qr',
              test: /[\\/]node_modules[\\/]qrcode\.react[\\/]/,
              priority: 40,
            },
            {
              name: 'vendor-toast',
              test: /[\\/]node_modules[\\/]react-hot-toast[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-redux',
              test: /[\\/]node_modules[\\/](@reduxjs\/toolkit|react-redux)[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react-dom|react-router-dom|react-router)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})