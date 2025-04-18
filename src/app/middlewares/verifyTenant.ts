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

const verifyTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
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

    if (role !== USER_ROLE.tenant) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Access denied. Tenant access only!',
      );
    }

    req.user = decoded;
    next();
  },
);

export default verifyTenant;
