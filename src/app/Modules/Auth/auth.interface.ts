/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { TCreateUser } from '../User/user.interface';

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
export interface TJwtPayload {
  email: string;
  role: 'admin' | 'customer';
}
