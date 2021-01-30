import { IApi } from 'umi'
export default (api: IApi) => {
  api.addEntryCodeAhead(() => {
    return `
      import * as Sentry from '@sentry/react'
      import { Integrations } from '@sentry/tracing'

      Sentry.init({
        dsn:
          '${api.config.sentry.dsn}',
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: ${api.config.sentry.tracesSampleRate}
      })
    `
  })
  api.describe({
    key: 'sentry',
    config: {
      schema: joi => {
        return joi.object({
          dsn: joi.string(),
          tracesSampleRate: joi.number().min(0).max(1),
        })
      },
    },
  })
}
