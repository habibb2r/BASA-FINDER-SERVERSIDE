import { Document, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface TCreateUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phone?: string;
  address?: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked: boolean;
  isActive: boolean;
  photoURL: string;
  isDeleted?: boolean;
}

export interface TUpdateUserStatus {
  id: string;
  action: string;
}
