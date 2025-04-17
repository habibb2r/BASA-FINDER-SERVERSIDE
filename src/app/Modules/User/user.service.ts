/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../ErrorHandlers/AppError';
import { createUserModel } from './user.model';
import { TUpdateUserStatus } from './user.interface';
import mongoose from 'mongoose';
import config from '../../config';

const getAllUserFromDB = async () => {
  const users = await createUserModel.find();
  return users;
};

const getSingleUserFromDB = async (email: string) => {
  const result = await createUserModel.findOne({ email });
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

const updateUserProfileInDB = async (payload: any) => {
  if (!payload?.email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Found');
  }
  if (!payload?.name) {
    throw new AppError(StatusCodes.NO_CONTENT, 'No Name Provided');
  }
  try {
    const data = await createUserModel.updateOne(
      { email: payload?.email },
      {
        $set: {
          name: payload?.name,
        },
      },
    );
    const result = data?.modifiedCount > 0 ? { name: payload?.name } : {};
    return result;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Unable to update user profile',
    );
  }
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
  updateUserProfileInDB,
  updateUserPasswordInDB,
};
