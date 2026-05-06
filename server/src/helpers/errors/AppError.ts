type Data = {
  accessTokenExpired?: boolean;
  refreshTokenExpired?: boolean;
  signOut?: boolean;
  [key: string]: any;
};

class AppError extends Error {
  public readonly statusCode: number;
  public readonly data?: Record<string, any>;

  constructor(statusCode: number, message: string, data: Data = {}, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    Object.setPrototypeOf(this, new.target.prototype);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
