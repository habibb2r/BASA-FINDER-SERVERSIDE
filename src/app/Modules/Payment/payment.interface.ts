// payment.interface.ts
import { Document, Model } from 'mongoose';

export interface TPayment extends Document {
    tenantEmail: string;
    tenantId: string;
    listingId: string;
    requestId: string;
    amount: number;
    status: "Pending" | "Paid" | "Failed" | "Cancelled";
    name?: string;
    phone?: string;
    address?: string;
    transaction: {
        id: string;
        transactionStatus: string;
        bank_status: string;
        sp_code: string;
        sp_message: string;
        method: string;
        date_time: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaymentModel extends Model<TPayment> {
    calculateTotalRevenue(): Promise<number>;
}

export type PAYMENT = {
    tenantEmail: string;
    listingId: string;
    requestId: string;
    amount: number;
    name?: string;
    phone?: string;
    address?: string;
    status?: "Pending" | "Paid" | "Failed" | "Cancelled";
    transaction?: {
        id: string;
        transactionStatus: string;
        bank_status: string;
        sp_code: string;
        sp_message: string;
        method: string;
        date_time: string;
    };
}