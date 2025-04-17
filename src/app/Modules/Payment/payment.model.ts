// payment.model.ts
import { Schema, model } from 'mongoose';
import { PaymentModel, TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment, PaymentModel>(
  {
    tenantId: { 
      type: String, 
      // required: true,  // Ensure tenantId is always stored
      trim: true 
    },
    tenantEmail: {
      type: String,
      required: [true, 'Tenant email is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    listingId: {
      type: String,
      required: [true, 'Listing ID is required'],
      trim: true,
    },
    requestId: {
      type: String,
      required: [true, 'Request ID is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Cancelled"],
      default: "Pending",
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add a static method to calculate total revenue
paymentSchema.statics.calculateTotalRevenue = async function () {
  try {
    const result = await this.aggregate([
      {
        $match: { 
          status: "Paid"  // Only count completed payments
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.totalRevenue || 0;
  } catch (error: unknown) {
    console.log("Error calculating revenue:", error);
    throw new Error('Error calculating revenue');
  }
};

export const Payment = model<TPayment, PaymentModel>('Payment', paymentSchema);