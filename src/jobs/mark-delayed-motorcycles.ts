import { makeMarkDelayedMotorcyclesUseCase } from '../use-cases/factories/make-mark-delayed-motorcycles-use-case'
import { BRAZIL_TIME_ZONE, getTodayInBrazil } from '../utils/date'

export function registerMarkDelayedMotorcyclesJob() {
  return Bun.cron(
    '0 0 * * *',
    async () => {
      try {
        const useCase = makeMarkDelayedMotorcyclesUseCase()

        const { count } = await useCase.execute({
          referenceDate: getTodayInBrazil(),
        })

        console.log(`Marked ${count} motorcycle(s) as delayed.`)
      } catch (error) {
        console.error('Failed to mark delayed motorcycles.', error)
      }
    },
    { tz: BRAZIL_TIME_ZONE },
  )
}