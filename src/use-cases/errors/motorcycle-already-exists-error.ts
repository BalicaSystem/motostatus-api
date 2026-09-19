export class MotorcycleAlreadyExistsError extends Error {
  constructor() {
    super('Motorcycle already register with this CHASSI.')
  }
}
