import { defineConfig } from 'umi'
import { join } from 'path'

export default defineConfig({
  plugins: [join(__dirname, '..', 'plugins', 'umi-plugin-sentry')],
  sentry: {
    dsn:
      'https://79b40d031aa647b581c310ebe0739abf@o512888.ingest.sentry.io/5614268',
    tracesSampleRate: 1.0,
  },
  define: {
    'process.env.axiosBaseURL': 'https://www.fkmap.vip/api',
  },
})
