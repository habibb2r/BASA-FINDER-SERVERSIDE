import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const handleDuplicateError = (err: any, res: Response) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: err.errorResponse.errmsg,
    error: err,
  });
};

export default handleDuplicateError;
