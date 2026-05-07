import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { QuizzesService } from "./quizzes.service";

export const QuizzesController = {
  // Admin
  upsertCourseQuiz: catchAsync(async (req, res) => {
    const data = await QuizzesService.upsertCourseQuiz(String(req.params.courseId), req.body);
    sendResponse(res, { statusCode: httpStatus.OK, message: "Quiz saved.", data });
  }),

  getCourseQuizForAdmin: catchAsync(async (req, res) => {
    const data = await QuizzesService.getCourseQuizForAdmin(String(req.params.courseId));
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  removeCourseQuiz: catchAsync(async (req, res) => {
    await QuizzesService.removeCourseQuiz(String(req.params.courseId));
    sendResponse(res, { statusCode: httpStatus.OK, message: "Quiz removed.", data: null });
  }),

  // Student
  getCourseQuizForStudent: catchAsync(async (req, res) => {
    const data = await QuizzesService.getCourseQuizForStudent(String(req.params.slug));
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  attemptQuiz: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await QuizzesService.attemptQuiz(
      String(req.params.slug),
      { id: req.user.id, role: req.user.role },
      req.body.answers,
    );
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  // Certificate
  issueCertificate: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await QuizzesService.issueCertificate(String(req.params.slug), {
      id: req.user.id,
      role: req.user.role,
    });
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  listMyCertificates: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await QuizzesService.listMyCertificates(req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  getMyCertificateForCourse: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const data = await QuizzesService.getMyCertificateForCourse(
      req.user.id,
      String(req.params.slug),
    );
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),

  verifyCertificate: catchAsync(async (req, res) => {
    const data = await QuizzesService.verifyCertificate(String(req.params.code));
    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),
};
