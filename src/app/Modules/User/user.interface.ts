import { Document } from 'mongoose';

export interface TCreateUser extends Document {
  name: string;
  phone?: string;
  address?: string;
  email: string;
  password: string;
  role: 'admin' | 'tenant' | 'landlord';
  isBlocked: boolean;
  isActive: boolean;
  photoURL: string;
  isDeleted?: boolean;
}

export interface TUpdateUserStatus {
  id: string;
  action: string;
}
