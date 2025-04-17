// payment.routes.ts
import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Create a new payment (only tenants can make payments)
router.post(
    '/create',
    // '/payment',
    auth(USER_ROLE.tenant),
    PaymentController.createPayment
);

// Verify payment callback
router.get(
    '/verify',
    auth(USER_ROLE.tenant, USER_ROLE.landlord, USER_ROLE.admin),
    PaymentController.verifyPayment
);

// Get all payments (admin only)
router.get(
    '/',
    auth(USER_ROLE.admin),
    PaymentController.getPayments
);

// Get my payments (all roles)
router.get(
    '/my-payments',
    auth(USER_ROLE.tenant, USER_ROLE.landlord, USER_ROLE.admin),
    PaymentController.getMyPayments
);

// Calculate revenue (admin only)
router.get(
    '/revenue',
    auth(USER_ROLE.admin),
    PaymentController.calculateRevenue
);

export const PaymentRoutes = router;