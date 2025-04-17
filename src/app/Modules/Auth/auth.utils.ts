import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export const generateToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string | number,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  const isVerfied = jwt.verify(token, secret) as JwtPayload;
  return isVerfied;
};
