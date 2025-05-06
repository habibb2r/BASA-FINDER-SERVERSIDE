import { Model } from 'mongoose';
import { TCreateUser } from '../User/user.interface';
import { USER_ROLE } from '../User/user.constant';

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface TLogin extends Model<TCreateUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserExistsByCustomId(email: string): Promise<TCreateUser>;
}

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  email: string;
  role: UserRole;
  id: string;
  photoURL: string;
};
