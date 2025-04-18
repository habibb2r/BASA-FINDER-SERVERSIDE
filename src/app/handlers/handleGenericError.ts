import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const handleGenericError = (err: any, res: Response) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `any error: ${err.message}`,
    error: err.stack || err.message,
  });
};

export default handleGenericError;
