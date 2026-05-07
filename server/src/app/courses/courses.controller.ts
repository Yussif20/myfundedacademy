import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { CoursesService } from "./courses.service";

export const CoursesController = {
  list: catchAsync(async (req, res) => {
    const data = await CoursesService.list(req.query as never, {
      isAdmin: req.user?.role === "ADMIN",
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  get: catchAsync(async (req, res) => {
    const data = await CoursesService.get(String(req.params.idOrSlug), {
      isAdmin: req.user?.role === "ADMIN",
      userId: req.user?.id,
      role: req.user?.role,
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  previewOtp: catchAsync(async (req, res) => {
    const data = await CoursesService.getPreviewOtp(String(req.params.id), {
      ip: req.ip || "",
      userAgent: req.headers["user-agent"] || "",
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  create: catchAsync(async (req, res) => {
    const data = await CoursesService.create(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Course draft created.",
      data,
    });
  }),

  update: catchAsync(async (req, res) => {
    const data = await CoursesService.update(String(req.params.id), req.body);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Course updated.", data });
  }),

  remove: catchAsync(async (req, res) => {
    await CoursesService.remove(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Course deleted.", data: null });
  }),

  publish: catchAsync(async (req, res) => {
    const data = await CoursesService.publish(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Course published.", data });
  }),

  unpublish: catchAsync(async (req, res) => {
    const data = await CoursesService.unpublish(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Course unpublished.", data });
  }),

  // Sections
  createSection: catchAsync(async (req, res) => {
    const data = await CoursesService.createSection(String(req.params.courseId), req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Section created.",
      data,
    });
  }),

  updateSection: catchAsync(async (req, res) => {
    const data = await CoursesService.updateSection(String(req.params.id), req.body);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Section updated.", data });
  }),

  removeSection: catchAsync(async (req, res) => {
    await CoursesService.removeSection(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Section deleted.", data: null });
  }),

  reorderSections: catchAsync(async (req, res) => {
    await CoursesService.reorderSections(String(req.params.courseId), req.body.ids);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Sections reordered.", data: null });
  }),

  // Lessons
  createLesson: catchAsync(async (req, res) => {
    const data = await CoursesService.createLesson(String(req.params.sectionId), req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: "Lesson created.", data });
  }),

  updateLesson: catchAsync(async (req, res) => {
    const data = await CoursesService.updateLesson(String(req.params.id), req.body);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Lesson updated.", data });
  }),

  removeLesson: catchAsync(async (req, res) => {
    await CoursesService.removeLesson(String(req.params.id));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Lesson deleted.", data: null });
  }),

  reorderLessons: catchAsync(async (req, res) => {
    await CoursesService.reorderLessons(String(req.params.sectionId), req.body.ids);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Lessons reordered.", data: null });
  }),

  addAttachment: catchAsync(async (req, res) => {
    const data = await CoursesService.addAttachment(String(req.params.id), req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: "Attachment added.", data });
  }),

  removeAttachment: catchAsync(async (req, res) => {
    await CoursesService.removeAttachment(String(req.params.id), String(req.params.attachmentId));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Attachment removed.", data: null });
  }),
};
