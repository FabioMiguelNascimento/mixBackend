export class ValidationError extends Error {
  details: any;
  constructor(message: string, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError'
  }
}