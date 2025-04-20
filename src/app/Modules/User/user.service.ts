import httpStatus from 'http-status-codes';

/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../ErrorHandlers/AppError';
import { createUserModel } from './user.model';
import { TUpdateUserStatus } from './user.interface';
import mongoose from 'mongoose';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

const getAllUserFromDB = async () => {
  const users = await createUserModel.find();
  return users;
};

const getSingleUserFromDB = async (userId: string) => {
  const result = await createUserModel.findOne({ userId });
  return result;
};

const updateUserStatusInDB = async (payload: TUpdateUserStatus) => {
  const users = await createUserModel.findById(payload?.id);
  if (!users) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
  }
  if (users?.role === 'admin') {
    throw new AppError(StatusCodes.FORBIDDEN, `Cannot change admin status`);
  }
  if (!payload?.action) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Action');
  }
  if (payload?.action === 'block') {
    const res = await createUserModel.findByIdAndUpdate(payload?.id, {
      isBlocked: true,
    });
    return res;
  }
  if (payload?.action === 'active') {
    const res = await createUserModel.findByIdAndUpdate(payload?.id, {
      isActive: true,
    });
    return res;
  }
  if (payload?.action === 'deactive') {
    const res = await createUserModel.findByIdAndUpdate(payload?.id, {
      isActive: false,
    });
    return res;
  }
};

const updateUserInDB = async (
  userData: JwtPayload,
  payload: { name?: string; email?: string; phone?: string; address?: string }
) => {
 
  const user = await createUserModel.isUserExistsByCustomId(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }


  if (payload.name) user.name = payload.name;
  if (payload.email) user.email = payload.email;
  if (payload.phone) user.phone = payload.phone;
  if (payload.address) user.address = payload.address;


  await user.save();

  return user;
};

const updateUserPasswordInDB = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await createUserModel
      .findOne({ email: payload?.email })
      .session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User Not found');
    }

    const isMatchPassword = await bcrypt.compare(
      payload?.cpassword,
      user?.password,
    );
    if (!isMatchPassword) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Incorrect Old Password, Provide Correct Password',
      );
    }

    const newpass = await bcrypt.hash(
      payload?.npassword,
      Number(config.bcrypt_salt_rounds),
    );
    if (!newpass) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error while password hashing',
      );
    }

    const res = await createUserModel
      .updateOne({ email: payload?.email }, { password: newpass })
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return res;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const UserServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserStatusInDB,
  updateUserInDB,
  updateUserPasswordInDB,
};
