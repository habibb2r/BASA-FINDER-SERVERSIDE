
import { z } from "zod";

const rentalHouseValidationSchema = z.object({
  location: z.string({
    required_error: 'Location is required'
  }).min(1, 'Location cannot be empty')
    .max(100, 'Location cannot exceed 100 characters'),
  
  description: z.string({
    required_error: 'Description is required'
  }).min(10, 'Description must be at least 10 characters'),
  
  rentAmount: z
    .number({
      required_error: 'Rent amount is required'
    })
    .positive("Rent amount must be a positive number"),
  
  bedrooms: z
    .number({
      required_error: 'Number of bedrooms is required'
    })
    .int("Number of bedrooms must be an integer")
    .min(1, "At least one bedroom is required"),
  
  images: z.array(
    z.string({
      required_error: 'Image URL is required'
    })
  ).min(1, "At least one image is required"),
  
  amenities: z.array(
    z.string({
      required_error: 'Amenity is required'
    })
  ).min(1, "At least one amenity is required"),
  
  landlordId: z.string({
    required_error: 'Landlord ID is required'
  }),
  
  isAvailable: z.boolean().default(true),
  
  isDeleted: z.boolean().optional(),
});

export default rentalHouseValidationSchema;

