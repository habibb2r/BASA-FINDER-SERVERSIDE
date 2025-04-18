import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const handleZodValidation = (err: any, res: Response) => {
  const issues = err.issues.map((item: any) => {
    return {
      path: item.path.join('> '),
      message: item.message,
    };
  });

  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: err.message,
    issues: issues,
    error: err,
  });
};

export default handleZodValidation;
