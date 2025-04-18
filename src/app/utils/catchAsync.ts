import { NextFunction, Request, Response } from 'express';

type AsyncRequestHandler<T = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const catchAsync = <T = Request>(fn: AsyncRequestHandler<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as T, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
