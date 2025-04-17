// payment.service.ts
import { RentalRequest } from '../rentalRequest/rentalRequest.model';
// import { RentalListing } from '../rentalListing/rentalListing.model';
import { RentalHouse } from '../rentalHouse/rentalHouse.model';
import { TUser } from '../User/user.interface';
import { Payment } from './payment.model';
import { paymentUtils } from './payment.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
// import { PAYMENT } from './payment.interface';
// import { sendEmail } from '../../utils/sendEmail';
import { User } from '../User/user.model';

interface IPaymentPayload {
    tenantEmail: string;
    listingId: string;
    requestId: string;
    amount: number;
    name?: string;
    address?: string;
    phone?: string;
}

const createPaymentInDB = async (
    user: TUser,
    payload: IPaymentPayload,
    client_ip: string
) => {
    console.log("Validating Payment Data:", payload);
    // Validate request exists and is approved
    const request = await RentalRequest.findById(payload.requestId);

    if (!request) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental request not found');
    }
    
    if (request.status !== 'approved') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment can only be made for approved requests'
        );
    }
    
    // Validate listing exists
    const listing = await RentalHouse.findById(payload.listingId);
    
    if (!listing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental listing not found');
    }
    
    // Verify tenant is the one who made the request
    // if (request.tenantId.toString() !== user._id.toString()) {
    if (request.tenantId.toString() !== user?.id.toString()) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'You are not authorized to make this payment'
        );
    }
    
    // Create payment record
    const payment = await Payment.create({
        tenantEmail: user.email,
        listingId: payload.listingId,
        requestId: payload.requestId,
        amount: listing.rentAmount, // Use actual rent amount from listing
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        status: 'Pending'
    });
    
    // Prepare SurjoPay payment payload
    const surjopayPayload = {
        amount: listing.rentAmount,
        order_id: payment._id,
        currency: 'BDT',
        customer_name: user.name,
        customer_email: user.email,
        client_ip,
        customer_phone: payload.phone || 'N/A',
        customer_address: payload.address || 'N/A',
        customer_city: user.city || 'N/A',
    };
    
    // Make payment with SurjoPay
    const paymentResponse = await paymentUtils.makePayment(surjopayPayload);
    
    if (paymentResponse?.transactionStatus) {
        await payment.updateOne({
            transaction: {
                id: paymentResponse.sp_order_id,
                transactionStatus: paymentResponse.transactionStatus,
            },
        });
    }
    
    console.log('Payment URL:', paymentResponse.checkout_url);
    
    return paymentResponse.checkout_url;
};

const getPaymentsFromDB = async (query: Record<string, unknown>) => {
    const paymentQuery = new QueryBuilder(Payment.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
        
    const result = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();
    
    return {
        result,
        meta
    };
};

const getTenantPaymentsFromDB = async (email: string, query: Record<string, unknown>) => {
    const paymentQuery = new QueryBuilder(
        Payment.find({ tenantEmail: email }),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();
        
    const result = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();
    
    return {
        result,
        meta
    };
};

const getLandlordPaymentsFromDB = async (userId: string, query: Record<string, unknown>) => {
    // First, get all listings owned by this landlord
    const listings = await RentalHouse.find({ landlordId: userId }, '_id');
    const listingIds = listings.map(listing => listing._id.toString());
    
    const paymentQuery = new QueryBuilder(
        Payment.find({ listingId: { $in: listingIds } }),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();
        
    const result = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();
    
    return {
        result,
        meta
    };
};

const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await paymentUtils.verifyPaymentAsync(order_id);
    
    if (verifiedPayment.length) {
        const payment = await Payment.findOneAndUpdate(
            {
                "transaction.id": order_id,
            },
            {
                "transaction.bank_status": verifiedPayment[0].bank_status,
                "transaction.sp_code": verifiedPayment[0].sp_code,
                "transaction.sp_message": verifiedPayment[0].sp_message,
                "transaction.transactionStatus": verifiedPayment[0].transaction_status,
                "transaction.method": verifiedPayment[0].method,
                "transaction.date_time": verifiedPayment[0].date_time,
                status:
                    verifiedPayment[0].bank_status == "Success"
                        ? "Paid"
                        : verifiedPayment[0].bank_status == "Failed"
                            ? "Pending"
                            : verifiedPayment[0].bank_status == "Cancel"
                                ? "Cancelled"
                                : "",
            },
            { new: true }
        );
        
        // If payment was successful, update the rental request status
        if (payment && payment.status === "Paid") {
            const request = await RentalRequest.findByIdAndUpdate(
                payment.requestId,
                // { paymentStatus: "Paid" },
                { paymentStatus: "paid" },
                { new: true }
            );
            
            // Send email notifications
            if (request) {
                // Get tenant and landlord information
                // const tenant = await User.findOne({ email: payment.tenantEmail });
                await User.findOne({ email: payment.tenantEmail });
                const listing = await RentalHouse.findById(payment.listingId);
                const landlord = listing ? await User.findById(listing.landlordId) : null;
                console.log(landlord);
                // Send notification to tenant
                // if (tenant) {
                //     await sendEmail(
                //         tenant.email,
                //         'Rental Payment Confirmation',
                //         `Your payment for the rental property at ${listing?.location} has been successfully processed. You can now contact the landlord at ${request.landlordPhone}.`
                //     );
                // }
                
                // Send notification to landlord
                // if (landlord) {
                //     await sendEmail(
                //         landlord.email,
                //         'Tenant Payment Received',
                //         `The payment for your property at ${listing?.location} has been received from ${tenant?.name}. You can contact them at ${tenant?.phone}.`
                //     );
                // }
            }
        }
    }
    
    return verifiedPayment;
};

export const PaymentService = {
    createPaymentInDB,
    getPaymentsFromDB,
    verifyPayment,
    getTenantPaymentsFromDB,
    getLandlordPaymentsFromDB,
};