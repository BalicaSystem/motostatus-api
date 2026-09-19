export class MotorcycleCannotBeCheckedInError extends Error {
  constructor() {
    super('Motorcycle cannot be checked in.')
  }
}