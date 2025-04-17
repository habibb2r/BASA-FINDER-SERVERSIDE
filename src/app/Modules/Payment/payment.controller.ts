// payment.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";
import { Payment } from "./payment.model";
import { PaymentValidationSchema } from "./payment.validation";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    // Get user from auth middleware
    const user = req.user;
    const clientIp = req.ip || "";

    console.log(req.user);
    // Validate the request body
    PaymentValidationSchema.parse(req.body);
    console.log("Received Payment Request:", req.body);

    const checkoutUrl = await PaymentService.createPaymentInDB(user, req.body, clientIp);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Payment initiated successfully",
        data: { checkoutUrl },
    });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
    const payments = await PaymentService.getPaymentsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
    });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    // Get user from auth middleware
    const user = req.user;

    // Call appropriate service based on user role
    let payments;
    if (user.role === 'tenant') {
        payments = await PaymentService.getTenantPaymentsFromDB(user.email, req.query);
    } else if (user.role === 'landlord') {
        // payments = await PaymentService.getLandlordPaymentsFromDB(user._id, req.query);
        payments = await PaymentService.getLandlordPaymentsFromDB(user.id, req.query);
    } else {
        // For admin, get all payments
        payments = await PaymentService.getPaymentsFromDB(req.query);
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const payment = await PaymentService.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment verified successfully",
        data: payment,
    });
});

// Calculate total revenue from all payments
const calculateRevenue = catchAsync(async (req: Request, res: Response) => {
    try {
        const totalRevenue = await Payment.calculateTotalRevenue();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Revenue calculated successfully",
            data: {
                totalRevenue,
            },
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

        console.error("Error calculating revenue:", errorMessage);

        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: errorMessage,
            data: null,
        });
    }
});

export const PaymentController = {
    createPayment,
    verifyPayment,
    getPayments,
    getMyPayments,
    calculateRevenue,
};