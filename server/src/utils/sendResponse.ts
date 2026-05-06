import { Response } from "express";

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  statusCode: number;
  success?: boolean;
  message?: string;
  meta?: TMeta;
  data?: T | null;
};

const sendResponse = <T extends Record<string, any>>(
  res: Response,
  response: TResponse<T> | any,
) => {
  const { statusCode, data } = response;

  const success = response.success ?? (statusCode >= 200 && statusCode < 400);
  const message = data?.message ?? response.message;

  const jsonResponse: Record<string, any> = {
    statusCode,
    success,
    message,
    data,
  };

  if (response.data?.meta) {
    jsonResponse.meta = response.data.meta;
    delete response.data.meta;
  }

  if (response?.meta) {
    jsonResponse.meta = response.meta;
  }

  if (message) jsonResponse.message = message;

  return res.status(statusCode).json(jsonResponse);
};

export default sendResponse;
