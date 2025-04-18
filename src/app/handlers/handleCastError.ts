import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const handleCastError = (err: any, res: Response) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: err.message,
    error: err,
  });
};

export default handleCastError;
