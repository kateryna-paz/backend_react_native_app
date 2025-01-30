const ERROR_TYPES = {
  AUTH_ERROR: "AuthError",
  VALIDATION_ERROR: "ValidationError",
  NOT_FOUND: "NotFoundError",
  DUPLICATE_ERROR: "DuplicateError",
  SERVER_ERROR: "ServerError",
};

const ERROR_MESSAGES = {
  AUTH_ERROR: "Помилка авторизації",
  VALIDATION_ERROR: "Помилка валідації даних",
  NOT_FOUND: "Дані не знайдено",
  DUPLICATE_ERROR: "Такий запис вже існує",
  SERVER_ERROR: "Помилка сервера",
};

class AppError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    switch (err.name) {
      case ERROR_TYPES.VALIDATION_ERROR:
        return res.status(400).json({
          type: ERROR_TYPES.VALIDATION_ERROR,
          message: err.message || ERROR_MESSAGES.VALIDATION_ERROR,
        });
      case ERROR_TYPES.NOT_FOUND:
        return res.status(404).json({
          type: ERROR_TYPES.NOT_FOUND,
          message: err.message || ERROR_MESSAGES.NOT_FOUND,
        });
      case ERROR_TYPES.AUTH_ERROR:
        return res.status(401).json({
          type: ERROR_TYPES.AUTH_ERROR,
          message: err.message || ERROR_MESSAGES.AUTH_ERROR,
        });
      case ERROR_TYPES.DUPLICATE_ERROR:
        return res.status(409).json({
          type: ERROR_TYPES.DUPLICATE_ERROR,
          message: err.message || ERROR_MESSAGES.DUPLICATE_ERROR,
        });
      default:
        return res.status(500).json({
          type: ERROR_TYPES.SERVER_ERROR,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
    }
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      type: ERROR_TYPES.AUTH_ERROR,
      message: ERROR_MESSAGES.AUTH_ERROR,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      type: ERROR_TYPES.DUPLICATE_ERROR,
      message: ERROR_MESSAGES.DUPLICATE_ERROR,
    });
  }

  return res.status(500).json({
    type: ERROR_TYPES.SERVER_ERROR,
    message: ERROR_MESSAGES.SERVER_ERROR,
  });
}

module.exports = { errorHandler, AppError, ERROR_TYPES };
