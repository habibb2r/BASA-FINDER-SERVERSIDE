
import { FilterQuery } from "mongoose";
import { TRentalHouse } from "./rentalHouse.interface";
import { RentalHouse } from "./rentalHouse.model";
import AppError from "../../errors/AppError";
import httpStatus from 'http-status';
import { USER_ROLE } from "../User/user.constant";

const createRentalHouseInDB = async (rentalHouseData: TRentalHouse) => {
    // Check if a rental house with the same location already exists for this landlord
    if (await RentalHouse.isRentalHouseExists(rentalHouseData.location, rentalHouseData.landlordId)) {
        throw new AppError(httpStatus.CONFLICT, "You already have a rental house listing at this location");
    }
    const result = await RentalHouse.create(rentalHouseData);
    return result;
};

const getAllRentalHousesFromDB = async (query: {
    filter?: FilterQuery<TRentalHouse>;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}) => {
    const { filter = {}, page = 1, limit = 30, sortBy = "createdAt", sortOrder = "desc" } = query;

    const finalFilter = { ...filter, isDeleted: false }; // Exclude soft-deleted rental houses
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const skip = (page - 1) * limit;

    const rentalHouses = await RentalHouse.find(finalFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    const total = await RentalHouse.countDocuments(finalFilter);

    return {
        data: rentalHouses,
        meta: {
            total,
            page,
            limit,
        },
    };
};

const getSingleRentalHouseFromDB = async (id: string) => {
    const rentalHouse = await RentalHouse.findById(id);
    if (!rentalHouse || rentalHouse.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental house not found');
    }
    return rentalHouse;
};

const getRentalHousesByLandlord = async (landlordId: string) => {
    const rentalHouses = await RentalHouse.find({ 
        landlordId, 
        isDeleted: false 
    });
    
    return rentalHouses;
};

const deleteRentalHouseFromDB = async (id: string, userId: string, userRole: string) => {
    const rentalHouse = await RentalHouse.findById(id);

    if (!rentalHouse || rentalHouse.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental house not found");
    }

    // Check if the user is the owner or an admin
    if (userRole !== USER_ROLE.admin && rentalHouse.landlordId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to delete this rental house");
    }

    // Soft delete
    const result = await RentalHouse.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );

    return result;
};

const updateRentalHouseInDB = async (id: string, updateData: Partial<TRentalHouse>, userId: string, userRole: string) => {
    const rentalHouse = await RentalHouse.findById(id);
    
    if (!rentalHouse || rentalHouse.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental house not found");
    }

    // Check if the user is the owner or an admin
    if (userRole !== USER_ROLE.admin && rentalHouse.landlordId !== userId) {
        // throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to update this rental house");
        throw new AppError(httpStatus.UNAUTHORIZED, "You don't have permission to update this rental house");
    }

    // Prevent landlordId change
    if (updateData.landlordId && updateData.landlordId !== rentalHouse.landlordId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Landlord ID cannot be changed");
    }

    const updatedRentalHouse = await RentalHouse.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
    );
    
    return updatedRentalHouse;
};

export const RentalHouseServices = {
    createRentalHouseInDB,
    getAllRentalHousesFromDB,
    getSingleRentalHouseFromDB,
    getRentalHousesByLandlord,
    deleteRentalHouseFromDB,
    updateRentalHouseInDB,
};
