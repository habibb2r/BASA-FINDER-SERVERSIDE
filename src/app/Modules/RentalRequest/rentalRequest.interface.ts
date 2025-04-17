// interface.ts
import { Model } from 'mongoose';

export const REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
} as const;

export type TRequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

export type TRentalRequest = {
    rentalHouseId: string;
    tenantId: string;
    landlordId: string;
    message?: string; // Special requirements, move-in dates, etc.
    status: TRequestStatus;
    location: string;
    bedrooms: number;
    rentAmount: number;
    landlordPhone?: string; // Optional, provided by landlord after approval
    paymentStatus?: 'pending' | 'paid';
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
};

export interface RentalRequestModel extends Model<TRentalRequest> {
    findRequestsByTenant(tenantId: string): Promise<TRentalRequest[]>;
    findRequestsByRentalHouse(rentalHouseId: string): Promise<TRentalRequest[]>;
    findRequestsForLandlord(landlordId: string): Promise<TRentalRequest[]>;
    /* eslint-disable no-unused-vars */
    // isRequestExists(rentalHouseId: string, tenantId: string): Promise<boolean>;
    isRequestExists(rentalHouseId: string, tenantId: string, landlordId: string): Promise<boolean>;
}
