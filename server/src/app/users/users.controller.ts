import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { UsersService } from "./users.service";

const getMe = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
  const user = await UsersService.getMe(req.user.id);
  sendResponse(res, { statusCode: httpStatus.OK, data: user });
});

const updateMe = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
  const user = await UsersService.updateMe(req.user.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, message: "Profile updated.", data: user });
});

const changePassword = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
  await UsersService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password updated. Please sign in again on other devices.",
    data: null,
  });
});

const listUsers = catchAsync(async (req, res) => {
  const result = await UsersService.listUsers(req.query as never);
  sendResponse(res, { statusCode: httpStatus.OK, data: result });
});

const createUser = catchAsync(async (req, res) => {
  const user = await UsersService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created.",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await UsersService.updateUser(String(req.params.id), req.body);
  sendResponse(res, { statusCode: httpStatus.OK, message: "User updated.", data: user });
});

const deleteUser = catchAsync(async (req, res) => {
  await UsersService.deleteUser(String(req.params.id));
  sendResponse(res, { statusCode: httpStatus.OK, message: "User deleted.", data: null });
});

export const UsersController = {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
