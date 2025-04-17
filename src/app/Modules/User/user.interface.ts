import { Document } from 'mongoose';

export interface TCreateUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  isBlocked: boolean;
  isActive: boolean;
  photoURL: string;
}

export interface TUpdateUserStatus {
  id: string;
  action: string;
}
