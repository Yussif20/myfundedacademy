import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { CategoriesService } from "./categories.service";

export const CategoriesController = {
  list: catchAsync(async (req, res) => {
    const data = await CategoriesService.list({
      featured: req.query.featured as unknown as boolean | undefined,
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  get: catchAsync(async (req, res) => {
    const data = await CategoriesService.get(String(req.params.idOrSlug));
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  create: catchAsync(async (req, res) => {
    const data = await CategoriesService.create(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Category created.",
      data,
    });
  }),

  update: catchAsync(async (req, res) => {
    const data = await CategoriesService.update(String(req.params.id), req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category updated.",
      data,
    });
  }),

  remove: catchAsync(async (req, res) => {
    await CategoriesService.remove(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Category deleted.", data: null });
  }),
};
