export class ChassisAlreadyExistsError extends Error {
  constructor() {
    super('Chassis already exists')
  }
}
