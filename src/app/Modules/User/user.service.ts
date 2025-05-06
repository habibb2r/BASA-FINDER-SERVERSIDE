import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
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
  const result = await createUserModel.findOne({ _id: userId });
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
  payload: { name?: string; email?: string; phone?: string; address?: string, photoURL?: string },
) => {
  if (!userData?.email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Found');
  }

  try {
    // Build update object dynamically
    const updateFields: { [key: string]: string } = {};
    if (payload.name) updateFields.name = payload.name;
    if (payload.email) updateFields.email = payload.email;
    if (payload.phone) updateFields.phone = payload.phone;
    if (payload.address) updateFields.address = payload.address;
    if (payload.photoURL) updateFields.photoURL = payload.photoURL;

    // If no fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new AppError(StatusCodes.NO_CONTENT, 'No update fields provided');
    }

    const data = await createUserModel.updateOne(
      { email: userData.email },
      {
        $set: updateFields,
      },
    );

    // Return only updated fields
    const result = data?.modifiedCount > 0 ? updateFields : {};
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Unable to update user profile',
    );
  }
};

interface IUpdatePasswordPayload {
  email: string;
  cpassword: string;
  npassword: string;
}

const updateUserPasswordInDB = async (payload: IUpdatePasswordPayload) => {
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
