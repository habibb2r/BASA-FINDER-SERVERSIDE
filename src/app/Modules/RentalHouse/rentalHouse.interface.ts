import { Model } from 'mongoose';

export type TRentalHouse = {
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  images: string[];
  amenities: string[];
  landlordId: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
};

export interface RentalHouseModel extends Model<TRentalHouse> {
  isRentalHouseAvailable(id: string): Promise<TRentalHouse | null>;
  isRentalHouseExists(location: string, landlordId: string): Promise<boolean>;
}
