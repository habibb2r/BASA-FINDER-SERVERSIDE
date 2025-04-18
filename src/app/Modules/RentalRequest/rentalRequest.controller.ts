// controller.ts
import { Request, Response } from 'express';
import { RentalRequestServices } from './rentalRequest.service';
import {
  rentalRequestValidationSchema,
  updateRentalRequestValidationSchema,
} from './rentalRequest.validation';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../ErrorHandlers/AppError';
import '../../types/express';

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const { rentalRequest: rentalRequestData } = req.body;

  if (!rentalRequestData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No rental request data provided',
    );
  }

  // Add tenant ID from authenticated user
  if (!req.user?.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  rentalRequestData.tenantId = req.user.id;

  const validatedData = rentalRequestValidationSchema.parse(rentalRequestData);
  const result =
    await RentalRequestServices.createRentalRequestInDB(validatedData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental request submitted successfully',
    data: result,
  });
});

const getTenantRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await RentalRequestServices.getRentalRequestsByTenant(
      req.user.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tenant rental requests retrieved successfully',
      data: result,
    });
  },
);

const getLandlordRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const result = await RentalRequestServices.getRentalRequestsByLandlord(
      req.user.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Landlord rental requests retrieved successfully',
      data: result,
    });
  },
);

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { requestId } = req.params;
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const updateData = updateRentalRequestValidationSchema.parse(req.body);

    const result = await RentalRequestServices.updateRentalRequestStatus(
      requestId,
      updateData,
      req.user.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Rental request ${updateData.status} successfully`,
      data: result,
    });
  },
);

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  if (!req.user?.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await RentalRequestServices.updatePaymentStatus(
    requestId,
    req.user.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment completed successfully',
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder, status } = req.query;

  // Build filter object
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status) {
    filter.status = status;
  }

  // Construct query
  const query = {
    filter,
    page: Number(page) || 1,
    limit: Number(limit) || 30,
    sortBy: (sortBy as string) || 'createdAt',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
  };

  const result = await RentalRequestServices.getAllRentalRequests(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All rental requests retrieved successfully',
    meta: {
      limit: query.limit,
      page: query.page,
      total: result.meta.total,
      totalPage: Math.ceil(result.meta.total / query.limit),
    },
    data: result.data,
  });
});

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.user?.id || !req.user?.role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await RentalRequestServices.getSingleRentalRequest(
      id,
      req.user.id,
      req.user.role,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental request retrieved successfully',
      data: result,
    });
  },
);

const deleteRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.user?.id || !req.user?.role) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await RentalRequestServices.deleteRentalRequest(
    id,
    req.user.id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental request deleted successfully',
    data: result,
  });
});

export const RentalRequestControllers = {
  createRentalRequest,
  getTenantRentalRequests,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
  updatePaymentStatus,
  getAllRentalRequests,
  getSingleRentalRequest,
  deleteRentalRequest,
};
