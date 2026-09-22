export class MotorcycleHasOrderItemsError extends Error {
  constructor() {
    super('Cannot delete a motorcycle that is used in order items.')
  }
}
