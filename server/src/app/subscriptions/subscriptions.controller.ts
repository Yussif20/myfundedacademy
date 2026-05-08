import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { SubscriptionsService } from "./subscriptions.service";

export const SubscriptionsController = {
  checkout: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await SubscriptionsService.checkout(req.user.id, req.body.plan);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  getMine: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await SubscriptionsService.getMine(req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  cancel: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await SubscriptionsService.cancelAtPeriodEnd(req.user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subscription will end at the current period.",
      data,
    });
  }),

  billingPortal: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await SubscriptionsService.billingPortal(req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  listAll: catchAsync(async (req, res) => {
    const data = await SubscriptionsService.listAll({
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),
};
