// service.ts
import { FilterQuery } from "mongoose";
import { TRentalRequest } from "./rentalRequest.interface";
import { RentalRequest } from "./rentalRequest.model";
// import { RentalHouse } from "../RentalHouse/rentalHouse.model";
import { RentalHouse } from "../rentalHouse/rentalHouse.model";
import AppError from "../../errors/AppError";
import httpStatus from 'http-status';
import { USER_ROLE } from "../User/user.constant";
// import { sendEmail } from "../../utils/sendEmail"; // Adjust import based on your project structure

// Create a new rental request
const createRentalRequestInDB = async (requestData: TRentalRequest) => {
    // Check if the rental house exists and is available
    // const rentalHouse = await RentalHouse.isRentalHouseAvailable(requestData.rentalHouseId);
    await RentalHouse.isRentalHouseAvailable(requestData.rentalHouseId);
    console.log(requestData);
    // Check if the tenant already has a pending or approved request for this rental house
    if (await RentalRequest.isRequestExists(requestData.rentalHouseId, requestData.tenantId, requestData.landlordId)) {
        throw new AppError(httpStatus.CONFLICT, "You already have a pending or approved request for this rental house");
    }
    // const landlord = await User.findById(requestData.landlordId); // Find user by ID
    // console.log('f-RRS, landlord',landlord);
      
    // Create the request
    const result = await RentalRequest.create(requestData);
    
    // Send email notification to landlord (if email service is set up)
    // try {
    //     // This is a placeholder for email notification logic
    //     // You'll need to implement this based on your email service
    //     await sendEmail({
    //         // to: 'landlord@example.com', // You'd need to fetch landlord's email
    //         to: `${landlord?.email}`, // landlord's email
    //         subject: 'New Rental Request',
    //         text: `You have received a new rental request for property ${rentalHouse?.location}`,
    //         html: `<p>You have received a new rental request for property ${rentalHouse?.location}</p>`
    //     });
    // } catch (error) {
    //     console.log('Email notification failed', error);
    //     // Continue even if email fails
    // }
    
    return result;
};

// Get all rental requests by tenant
const getRentalRequestsByTenant = async (tenantId: string) => {
    console.log(tenantId);
    const requests = await RentalRequest.find({ 
        tenantId, 
        isDeleted: false 
    });
    
    // Populate with rental house details if needed
    // This would require adjusting your models to use refs
    // Or manually fetching and combining data
    
    return requests;
};

// Get all rental requests for a landlord's properties
const getRentalRequestsByLandlord = async (landlordId: string) => {
    // First, get all rental houses owned by this landlord
    const rentalHouses = await RentalHouse.find({ 
        landlordId, 
        isDeleted: false 
    });
    
    const rentalHouseIds = rentalHouses.map(house => house._id.toString());
    
    // Then find all requests for these rental houses
    const requests = await RentalRequest.find({
        rentalHouseId: { $in: rentalHouseIds },
        isDeleted: false
    });
    
    return requests;
};

// Update a rental request (approve/reject)
const updateRentalRequestStatus = async (
    requestId: string,
    updateData: { status: 'approved' | 'rejected', landlordPhone?: string },
    landlordId: string
) => {
    const request = await RentalRequest.findById(requestId);
    
    if (!request || request.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }
    
    // Verify the rental house belongs to this landlord
    const rentalHouse = await RentalHouse.findById(request.rentalHouseId);
    
    if (!rentalHouse || rentalHouse.landlordId !== landlordId) {
        throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to update this request");
    }
    
    // Update the request
    const updatedRequest = await RentalRequest.findByIdAndUpdate(
        requestId,
        { 
            ...updateData, 
            updatedAt: new Date(),
            // If approving, initialize payment status
            ...(updateData.status === 'approved' ? { paymentStatus: 'pending' } : {})
        },
        { new: true, runValidators: true }
    );
    
    // Send email notification to tenant
    // try {
    //     // This is a placeholder for email notification logic
    //     await sendEmail({
    //         to: 'tenant@example.com', // You'd need to fetch tenant's email
    //         subject: `Rental Request ${updateData.status}`,
    //         text: `Your rental request for ${rentalHouse.location} has been ${updateData.status}`,
    //         html: `<p>Your rental request for ${rentalHouse.location} has been ${updateData.status}</p>`
    //     });
    // } catch (error) {
    //     console.log('Email notification failed', error);
    //     // Continue even if email fails
    // }
    
    return updatedRequest;
};

// Update payment status for an approved request
const updatePaymentStatus = async (requestId: string, tenantId: string) => {
    const request = await RentalRequest.findById(requestId);
    
    if (!request || request.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }
    
    // Verify the request belongs to this tenant
    if (request.tenantId !== tenantId) {
        throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to update this payment");
    }
    
    // Verify the request is approved
    if (request.status !== 'approved') {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment is only available for approved requests");
    }
    
    // Update payment status
    const updatedRequest = await RentalRequest.findByIdAndUpdate(
        requestId,
        { 
            paymentStatus: 'completed',
            updatedAt: new Date()
        },
        { new: true }
    );
    
    return updatedRequest;
};

// Get all rental requests (admin only)
const getAllRentalRequests = async (query: {
    filter?: FilterQuery<TRentalRequest>;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}) => {
    const { filter = {}, page = 1, limit = 30, sortBy = "createdAt", sortOrder = "desc" } = query;

    const finalFilter = { ...filter, isDeleted: false };
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const skip = (page - 1) * limit;

    const requests = await RentalRequest.find(finalFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    const total = await RentalRequest.countDocuments(finalFilter);
    
    return {
        data: requests,
        meta: {
            total,
            page,
            limit,
        },
    };
};

// Get a single rental request
const getSingleRentalRequest = async (id: string, userId: string, userRole: string) => {
    const request = await RentalRequest.findById(id);
    
    if (!request || request.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }
    
    // Check authorization - admin can view any request, tenant can view their own, landlord can view requests for their properties
    if (userRole === USER_ROLE.admin) {
        // Admin can view any request
        return request;
    } else if (userRole === USER_ROLE.tenant && request.tenantId === userId) {
        // Tenant can view their own requests
        return request;
    } else if (userRole === USER_ROLE.landlord) {
        // Landlord can view requests for their properties
        const rentalHouse = await RentalHouse.findById(request.rentalHouseId);
        if (rentalHouse && rentalHouse.landlordId === userId) {
            return request;
        }
    }
    
    // If none of the conditions are met, the user is not authorized
    throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to view this request");
};

// Delete a rental request (soft delete)
const deleteRentalRequest = async (id: string, userId: string, userRole: string) => {
    const request = await RentalRequest.findById(id);
    
    if (!request || request.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }
    
    // Check authorization - admin can delete any request, tenant can delete their own if pending
    if (userRole === USER_ROLE.admin) {
        // Admin can delete any request
    } else if (userRole === USER_ROLE.tenant && request.tenantId === userId) {
        // Tenant can only delete their own pending requests
        if (request.status !== 'pending') {
            throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete a non-pending request");
        }
    } else {
        throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to delete this request");
    }
    
    // Soft delete
    const result = await RentalRequest.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    
    return result;
};

export const RentalRequestServices = {
    createRentalRequestInDB,
    getRentalRequestsByTenant,
    getRentalRequestsByLandlord,
    updateRentalRequestStatus,
    updatePaymentStatus,
    getAllRentalRequests,
    getSingleRentalRequest,
    deleteRentalRequest,
};
