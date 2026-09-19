import { app } from './app'
import { env } from './env'

const start = async () => {
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