import { app } from './app'
import { env } from './env'
import { registerKeepAliveJob } from './jobs/keep-alive'
import { registerMarkDelayedMotorcyclesJob } from './jobs/mark-delayed-motorcycles'

const start = async () => {
  registerMarkDelayedMotorcyclesJob()
  registerKeepAliveJob()

  await app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  })

  console.log('🚀 HTTP Server Running!')
}

const shutdown = async () => {
  console.log('Shutting down...')

  await app.close()

  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

start()