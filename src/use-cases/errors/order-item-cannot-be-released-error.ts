export class OrderItemCannotBeReleasedError extends Error {
  constructor() {
    super('Order item cannot be released.')
  }
}
