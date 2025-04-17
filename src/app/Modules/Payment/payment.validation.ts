// payment.validation.ts
import { z } from "zod";

export const PaymentValidationSchema = z.object({
    tenantEmail: z.string().email({ message: "Invalid email address" }),
    listingId: z.string().min(1, { message: "Listing ID must not be empty" }),
    requestId: z.string().min(1, { message: "Request ID must not be empty" }),
    amount: z.number().nonnegative({ message: "Amount must be a non-negative number" }),
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
});