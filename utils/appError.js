export default class AppError extends Error {
   constructor(statusCode, message) {
      super(message)

      this.statusCode = statusCode
      this.isOperational = true

      Error.captureStackTrace(this, this.constructor)
   }
}
