import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { InstructorsService } from "./instructors.service";

export const InstructorsController = {
  list: catchAsync(async (req, res) => {
    const data = await InstructorsService.list({
      featured: req.query.featured as unknown as boolean | undefined,
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  get: catchAsync(async (req, res) => {
    const data = await InstructorsService.get(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  create: catchAsync(async (req, res) => {
    const data = await InstructorsService.create(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Instructor created.",
      data,
    });
  }),

  update: catchAsync(async (req, res) => {
    const data = await InstructorsService.update(String(req.params.id), req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Instructor updated.",
      data,
    });
  }),

  remove: catchAsync(async (req, res) => {
    await InstructorsService.remove(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Instructor deleted.", data: null });
  }),
};
