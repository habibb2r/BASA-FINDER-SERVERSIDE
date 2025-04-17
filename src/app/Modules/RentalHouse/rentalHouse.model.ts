
import { Schema, model } from 'mongoose';
import { TRentalHouse, RentalHouseModel } from './rentalHouse.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const rentalHouseSchema = new Schema<TRentalHouse, RentalHouseModel>(
    {
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        rentAmount: {
            type: Number,
            required: [true, 'Rent amount is required'],
            min: [0, 'Rent amount must be a positive number'],
        },
        bedrooms: {
            type: Number,
            required: [true, 'Number of bedrooms is required'],
            min: [1, 'At least one bedroom is required'],
        },
        images: {
            type: [String],
            required: [true, 'At least one image is required'],
            validate: {
                validator: function (val: string[]) {
                    return val.length > 0;
                },
                message: 'At least one image is required',
            },
        },
        amenities: {
            type: [String],
            required: [true, 'Amenities are required'],
        },
        landlordId: {
            type: String,
            required: [true, 'Landlord ID is required'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
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

// Middleware - Pre-find hook to exclude soft-deleted items
rentalHouseSchema.pre('find', function (next) {
    this.find({ isDeleted: false });
    next();
});

// Static Methods
rentalHouseSchema.statics.isRentalHouseAvailable = async function (id: string) {
    const rentalHouse = await this.findOne({ _id: id, isAvailable: true, isDeleted: false });
    if (!rentalHouse) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental house not found or not available');
    }
    return rentalHouse;
};

rentalHouseSchema.statics.isRentalHouseExists = async function (location: string, landlordId: string) {
    const rentalHouse = await this.findOne({ 
        location: { $regex: new RegExp('^' + location + '$', 'i') }, 
        landlordId 
    });
    return !!rentalHouse; // Return true if a rental house exists, otherwise false
};

// Exporting Models
export const RentalHouse = model<TRentalHouse, RentalHouseModel>('RentalHouse', rentalHouseSchema);
