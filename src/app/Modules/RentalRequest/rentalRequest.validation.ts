// validation.ts
import { z } from "zod";

const rentalRequestValidationSchema = z.object({
  rentalHouseId: z.string({
    required_error: 'Rental house ID is required'
  }),
  
  tenantId: z.string({
    required_error: 'Tenant ID is required'
  }),

  landlordId: z.string({
    required_error: 'landlordId ID is required'
  }),
  
  bedrooms:z.number(),
  rentAmount:z.number(),
  location:z.string(),

  message: z.string({
    required_error: 'Message is required'
  // }).min(10, 'Message must be at least 10 characters long'),
  }).min(0, 'Message must be at least 10 characters long').optional(),
  
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  
  landlordPhone: z.string().optional(),
  
//   paymentStatus: z.enum(['pending', 'completed']).default('pending'),
  paymentStatus: z.enum(['pending', 'paid']).default('pending'),
  
  isDeleted: z.boolean().optional(),
});

const updateRentalRequestValidationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  landlordPhone: z.string().optional(),
});

export { rentalRequestValidationSchema, updateRentalRequestValidationSchema };
