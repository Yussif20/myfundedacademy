import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { UploadsService } from "./uploads.service";

export const UploadsController = {
  avatarPresign: catchAsync(async (req, res) => {
    const data = await UploadsService.avatarPresign(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  thumbnailPresign: catchAsync(async (req, res) => {
    const data = await UploadsService.thumbnailPresign(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  attachmentPresign: catchAsync(async (req, res) => {
    const data = await UploadsService.attachmentPresign(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  videoCredentials: catchAsync(async (req, res) => {
    const data = await UploadsService.videoCredentials(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),
};
