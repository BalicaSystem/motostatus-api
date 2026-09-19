export class OrderItemCannotBeCompletedError extends Error {
  constructor() {
    super('Order item cannot be completed.')
  }
}
