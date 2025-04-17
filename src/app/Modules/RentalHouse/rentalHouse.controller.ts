
import { Request, Response } from 'express';
import { RentalHouseServices } from './rentalHouse.service';
import rentalHouseValidationSchema from './rentalHouse.validation';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const createRentalHouse = catchAsync(async (req: Request, res: Response) => {
    
    const { rentalHouse: rentalHouseData } = req.body;
    
    // Add landlord ID from authenticated user
    rentalHouseData.landlordId = req.user.id;
    
    const validatedData = rentalHouseValidationSchema.parse(rentalHouseData);
    const result = await RentalHouseServices.createRentalHouseInDB(validatedData);

    console.log(result);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Rental house listed successfully',
        data: result,
    });
});

const getAllRentalHouses = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sortBy, sortOrder, searchTerm, location, minPrice, maxPrice, bedrooms } = req.query;
    // Build filter object
    const filter: Record<string, unknown> = { isDeleted: false }; // Ensure only non-deleted rental houses are fetched
    
    if (searchTerm) {
        filter.location = new RegExp(searchTerm as string, 'i'); // Search by location
    }
    
    // Apply specific filters if provided
    if (location) {
        filter.location = new RegExp(location as string, 'i');
    }
    
    if (minPrice) {
        filter.rentAmount = { ...(filter.rentAmount as object || {}), $gte: Number(minPrice) };
    }
    
    if (maxPrice) {
        filter.rentAmount = { ...(filter.rentAmount as object || {}), $lte: Number(maxPrice) };
    }
    
    if (bedrooms) {
        filter.bedrooms = Number(bedrooms);
    }
    
    // Construct query
    const query = {
        filter,
        page: Number(page) || 1,
        limit: Number(limit) || 30,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    };
    
    try {
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
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error',
            data: null,
        });
    }
};

const getSingleRentalHouse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await RentalHouseServices.getSingleRentalHouseFromDB(id);
    console.log('f-rhc:id',id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Rental house retrieved successfully',
        data: result,
    });
});

const getRentalHousesByLandlord = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user.id;
    const result = await RentalHouseServices.getRentalHousesByLandlord(landlordId);
    console.log('f-rfc: landlordId',landlordId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Landlord rental houses retrieved successfully',
        data: result,
    });
});

const deleteRentalHouse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rentalHouseId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const result = await RentalHouseServices.deleteRentalHouseFromDB(rentalHouseId, userId, userRole);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Rental house deleted successfully',
            data: result,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message || 'Something went wrong',
                error: err,
            });
        }
        // Unexpected error fallback
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};

const updateRentalHouseHandler = async (req: Request, res: Response): Promise<void> => {
    const { rentalHouseId } = req.params; // Extract rental house ID from route params
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!rentalHouseId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Rental House Not Found!');
    }
    
    const updateData = req.body;
    try {
        // Call the service to update the rental house
        const updatedRentalHouse = await RentalHouseServices.updateRentalHouseInDB(rentalHouseId, updateData, userId, userRole);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Rental house is updated successfully',
            data: updatedRentalHouse,
        });
    } catch (error) {
        // Handle errors and send appropriate response
        if (error instanceof Error) {
            sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: error.message || 'Could not update the rental house',
                data: updateData,
            });
        }

        // Handle unexpected error types
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'An unknown error occurred',
            data: updateData,
        });
    }
};

export const RentalHouseControllers = {
    createRentalHouse,
    getAllRentalHouses,
    getSingleRentalHouse,
    getRentalHousesByLandlord,
    deleteRentalHouse,
    updateRentalHouseHandler,
};
