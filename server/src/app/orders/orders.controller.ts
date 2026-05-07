import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { OrdersService } from "./orders.service";

export const OrdersController = {
  checkoutCourse: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const result = await OrdersService.checkoutCourse(req.user.id, req.body.courseId);
    sendResponse(res, { statusCode: httpStatus.OK, data: result });
  }),

  listMine: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await OrdersService.listMyOrders(req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  getMineBySession: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const sessionId = String(req.params.sessionId);
    const data = await OrdersService.getMyOrderBySession(req.user.id, sessionId);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),
};
