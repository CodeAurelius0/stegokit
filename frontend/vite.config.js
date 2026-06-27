import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/stegokit/' : '/')

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_PROXY || 'http://localhost:5000',
          changeOrigin: true,
          timeout: 600000,          // 10 min — large image encode/decode
          proxyTimeout: 600000,     // 10 min — server-side processing timeout
          configure: (proxy) => {
            proxy.on('error', (err) => console.error('[proxy error]', err.message));
          },
        },
      },
    },
  }
})
