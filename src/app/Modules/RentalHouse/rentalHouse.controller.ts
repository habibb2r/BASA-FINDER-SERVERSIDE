import { Request, Response } from 'express';
import { RentalHouseServices } from './rentalHouse.service';
import rentalHouseValidationSchema from './rentalHouse.validation';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../ErrorHandlers/AppError';
import '../../types/express';

const createRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const { rentalHouse: rentalHouseData } = req.body;
  if (!req.user?.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  rentalHouseData.landlordId = req.user.id;

  const validatedData = rentalHouseValidationSchema.parse(rentalHouseData);
  const result = await RentalHouseServices.createRentalHouseInDB(validatedData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental house listed successfully',
    data: result,
  });
});

const getAllRentalHouses = catchAsync(async (req: Request, res: Response) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    searchTerm,
    location,
    minPrice,
    maxPrice,
    bedrooms,
  } = req.query;
  // Build filter object
  const filter: Record<string, unknown> = { isDeleted: false };

  if (searchTerm) {
    filter.location = new RegExp(searchTerm as string, 'i');
  }

  if (location) {
    filter.location = new RegExp(location as string, 'i');
  }

  if (minPrice) {
    filter.rentAmount = {
      ...((filter.rentAmount as object) || {}),
      $gte: Number(minPrice),
    };
  }

  if (maxPrice) {
    filter.rentAmount = {
      ...((filter.rentAmount as object) || {}),
      $lte: Number(maxPrice),
    };
  }

  if (bedrooms) {
    filter.bedrooms = Number(bedrooms);
  }

  const query = {
    filter,
    page: Number(page) || 1,
    limit: Number(limit) || 30,
    sortBy: (sortBy as string) || 'createdAt',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
  };

  const result = await RentalHouseServices.getAllRentalHousesFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental houses fetched successfully',
    meta: {
      limit: query.limit,
      page: query.page,
      total: result.meta.total,
      totalPage: Math.ceil(result.meta.total / query.limit),
    },
    data: result.data,
  });
});

const getSingleRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RentalHouseServices.getSingleRentalHouseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house retrieved successfully',
    data: result,
  });
});

const getRentalHousesByLandlord = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await RentalHouseServices.getRentalHousesByLandlord(
      req.user.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Landlord rental houses retrieved successfully',
      data: result,
    });
  },
);

const deleteRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const { rentalHouseId } = req.params;
  if (!req.user?.id || !req.user?.role) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await RentalHouseServices.deleteRentalHouseFromDB(
    rentalHouseId,
    req.user.id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house deleted successfully',
    data: result,
  });
});

const updateRentalHouseHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { rentalHouseId } = req.params;
    if (!req.user?.id || !req.user?.role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    if (!rentalHouseId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Rental House ID is required!',
      );
    }

    const updateData = req.body;
    const updatedRentalHouse = await RentalHouseServices.updateRentalHouseInDB(
      rentalHouseId,
      updateData,
      req.user.id,
      req.user.role,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental house updated successfully',
      data: updatedRentalHouse,
    });
  },
);

export const RentalHouseControllers = {
  createRentalHouse,
  getAllRentalHouses,
  getSingleRentalHouse,
  getRentalHousesByLandlord,
  deleteRentalHouse,
  updateRentalHouseHandler,
};
