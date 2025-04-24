class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Product Not found') {
    super(message, 404);
  }
}

module.exports = {
  AppError,
  NotFoundError
};
