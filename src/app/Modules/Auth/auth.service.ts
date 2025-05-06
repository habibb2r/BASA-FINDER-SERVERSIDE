import config from '../../config';
import { TCreateUser } from '../User/user.interface';
import { createUserModel } from '../User/user.model';
import { TJwtPayload, TLoginUser } from './auth.interface';
import { generateToken } from './auth.utils';
import AppError from '../../ErrorHandlers/AppError';
import httpStatus from 'http-status';

const createUserIntoDB = async (userData: TCreateUser) => {
  const res = await createUserModel.create(userData);
  return res;
};

const loginService = async (payload: TLoginUser) => {
  const user = await createUserModel.findOne({ email: payload?.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // console.log(payload.password, 'payload.password');
  // console.log(user.password, 'user.password');
  const isPasswordMatched = await createUserModel.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role,
    photoURL: user.photoURL,
    id: user._id.toString(),
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userInfo: {
      name: user?.name,
      email: user?.email,
      role: user?.role,
      photoURL: user?.photoURL,
    },
  };
};

export const AuthServices = {
  createUserIntoDB,
  loginService,
};
