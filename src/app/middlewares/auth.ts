import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import { createUserModel } from '../Modules/User/user.model';
import AppError from '../ErrorHandlers/AppError';
import catchAsync from '../utils/catchAsync';
import '../types/express';
import { USER_ROLE } from '../Modules/User/user.constant';
import { CustomRequest } from '../types/express';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers)
    const token = req.headers.authorization;


    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as CustomRequest['user'];

    const { role, email } = decoded;

    const user = await createUserModel.isUserExistsByCustomId(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user?.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account is blocked!');
    }

    if (!user?.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account is not active!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized! length');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
