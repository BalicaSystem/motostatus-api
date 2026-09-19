export class MotorcycleUnavailableError extends Error {
  constructor() {
    super('Motorcycle is not available')
  }
}
