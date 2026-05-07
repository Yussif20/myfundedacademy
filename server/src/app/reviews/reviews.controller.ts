import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { ReviewsService } from "./reviews.service";

export const ReviewsController = {
  upsertCourseReview: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await ReviewsService.upsertCourseReview(
      String(req.params.slug),
      { id: req.user.id, role: req.user.role },
      req.body,
    );
    sendResponse(res, { statusCode: httpStatus.OK, message: "Review saved.", data });
  }),

  listCourseReviews: catchAsync(async (req, res) => {
    const data = await ReviewsService.listCourseReviews(
      String(req.params.slug),
      req.query as never,
    );
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  getMyReview: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await ReviewsService.getMyReview(String(req.params.slug), req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  removeReview: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    await ReviewsService.removeReview(String(req.params.id), {
      id: req.user.id,
      role: req.user.role,
    });
    sendResponse(res, { statusCode: httpStatus.OK, message: "Review deleted.", data: null });
  }),
};
