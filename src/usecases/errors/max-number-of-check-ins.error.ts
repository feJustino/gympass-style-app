export class MaxNumberOfCheckinsError extends Error {
  constructor() {
    super('Max check-in reached.')
  }
}
