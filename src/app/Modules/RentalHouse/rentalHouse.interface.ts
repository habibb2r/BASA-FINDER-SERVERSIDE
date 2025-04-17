
import { Model } from 'mongoose';

// Define the type for the Rental House
export type TRentalHouse = {
    location: string;
    description: string;
    rentAmount: number;
    bedrooms: number;
    images: string[]; // Array of image URLs
    amenities: string[]; // Array of amenities
    landlordId: string; // Reference to the User (landlord)
    isAvailable: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
};

export interface RentalHouseModel extends Model<TRentalHouse> {
    /* eslint-disable no-unused-vars */
    isRentalHouseAvailable(id: string): Promise<TRentalHouse | null>;
    isRentalHouseExists(location: string, landlordId: string): Promise<boolean>;
}
