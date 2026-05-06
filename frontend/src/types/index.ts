export type ServerError_T = {
  statusCode: number;
  success: false;
  message: string;
  errorDetails?: { issues?: { path: string; message: string }[] } | Record<string, unknown>;
};

export type ApiSuccess<T> = {
  statusCode: number;
  success: true;
  message?: string;
  data: T;
  meta?: { limit: number; page: number; total: number; totalPage: number };
};
