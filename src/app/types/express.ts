import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { USER_ROLE } from '../Modules/User/user.constant';

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        role: UserRole;
        id: string;
        email: string;
      };
    }
  }
}

// This is for backwards compatibility while we migrate
export interface CustomRequest extends Request {
  user: JwtPayload & {
    role: UserRole;
    id: string;
    email: string;
  };
}
