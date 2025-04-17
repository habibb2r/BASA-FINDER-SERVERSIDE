// model.ts
import { Schema, model } from 'mongoose';
import { TRentalRequest, RentalRequestModel, REQUEST_STATUS } from './rentalRequest.interface';

const rentalRequestSchema = new Schema<TRentalRequest, RentalRequestModel>(
    {
        rentalHouseId: {
            type: String,
            required: [true, 'Rental house ID is required'],
        },
        tenantId: {
            type: String,
            required: [true, 'Tenant ID is required'],
        },
        landlordId: {
            type: String,
            required: [true, 'LandlordId ID is required'],
        },
        message: {
            type: String,
            required: [true, 'Request message is required'],
        },
        status: {
            type: String,
            enum: Object.values(REQUEST_STATUS),
            default: REQUEST_STATUS.PENDING,
        },
        landlordPhone: {
            type: String,
            required: false,
        },

        location: {
            type: String,
        },
        bedrooms: { type: Number },
        rentAmount: { type: Number },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
        timestamps: true,
    }
);

// // Static methods
// rentalRequestSchema.statics.findRequestsByTenant = async function (tenantId: string) {
//     return this.find({ tenantId });
// };
// rentalRequestSchema.statics.findRequestsByRentalHouse = async function (rentalHouseId: string) {
//     return this.find({ rentalHouseId });
// };
// rentalRequestSchema.statics.findRequestsForLandlord = async function (landlordId: string) {
//     // This implementation will be expanded in the service to join with rental houses
//     return this.find({});
// };

// Middleware - Pre-find hook to exclude soft-deleted items
rentalRequestSchema.pre('find', function (next) {
    this.find({ isDeleted: false });
    next();
});

// Static method to check if a request already exists
rentalRequestSchema.statics.isRequestExists = async function (rentalHouseId: string, tenantId: string) {
    const request = await this.findOne({
        rentalHouseId,
        tenantId,
        status: { $in: ['pending', 'approved'] },
        isDeleted: false
    });
    return !!request; // Return true if a request exists, otherwise false
};


export const RentalRequest = model<TRentalRequest, RentalRequestModel>('RentalRequest', rentalRequestSchema);

