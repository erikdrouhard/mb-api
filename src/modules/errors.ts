export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Record not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'A record with that value already exists') {
    super(409, message);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Not authorized') {
    super(401, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(400, message);
  }
}
