import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../ErrorHandlers/AppError';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    success: true,
    message: 'All Users Retrieved successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  // console.log(userId);
  const result = await UserServices.getSingleUserFromDB(userId);
  sendResponse(res, {
    success: true,
    message: 'User Retrieved successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateUserStatusInDB(req?.body);
  sendResponse(res, {
    success: true,
    message: 'Updated User Status Successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }
  const updatedUser = await UserServices.updateUserInDB(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: updatedUser,
    message: 'User profile updated successfully!',
  });
});

const updateUserPassword = catchAsync(async (req: Request, res: Response) => {
  const getUpdatePassword = req.body;
  const result = await UserServices.updateUserPasswordInDB(getUpdatePassword);
  sendResponse(res, {
    success: true,
    message: 'Updated User Password Successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUserProfile,
  updateUserPassword,
};
