import { env } from '../env'

function getSelfUrl() {
  return env.RENDER_EXTERNAL_URL ?? `http://localhost:${env.PORT}`
}

export function registerKeepAliveJob() {
  return Bun.cron('*/14 * * * *', async () => {
    try {
      await fetch(`${getSelfUrl()}/health`)
    } catch (error) {
      console.error('Failed to keep the service alive.', error)
    }
  })
}