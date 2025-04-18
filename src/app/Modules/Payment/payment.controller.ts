// payment.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PaymentService } from './payment.service';
import { Payment } from './payment.model';
import { PaymentValidationSchema } from './payment.validation';
import AppError from '../../ErrorHandlers/AppError';
import '../../types/express';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const clientIp = req.ip || '';
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  // Validate the request body
  const validatedData = PaymentValidationSchema.parse(req.body);

  const checkoutUrl = await PaymentService.createPaymentInDB(
    req.user,
    validatedData,
    clientIp,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment initiated successfully',
    data: { checkoutUrl },
  });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await PaymentService.getPaymentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.role || !req.user?.id || !req.user?.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  let payments;
  if (req.user.role === 'tenant') {
    payments = await PaymentService.getTenantPaymentsFromDB(
      req.user.email,
      req.query,
    );
  } else if (req.user.role === 'landlord') {
    payments = await PaymentService.getLandlordPaymentsFromDB(
      req.user.id,
      req.query,
    );
  } else if (req.user.role === 'admin') {
    payments = await PaymentService.getPaymentsFromDB(req.query);
  } else {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid user role');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.query.order_id as string;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }

  const payment = await PaymentService.verifyPayment(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verified successfully',
    data: payment,
  });
});

const calculateRevenue = catchAsync(async (req: Request, res: Response) => {
  const totalRevenue = await Payment.calculateTotalRevenue();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue calculated successfully',
    data: {
      totalRevenue,
    },
  });
});

export const PaymentController = {
  createPayment,
  verifyPayment,
  getPayments,
  getMyPayments,
  calculateRevenue,
};
