// route.ts
import express from 'express';
import { RentalRequestControllers } from './rentalRequest.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Route to create a new rental request (Tenant only)
router.post(
    '/tenants/create',
    auth(USER_ROLE.tenant),
    RentalRequestControllers.createRentalRequest
);

// Route to get all rental requests by tenant (Tenant only)
router.get(
    '/tenants/requests',
    auth(USER_ROLE.tenant),
    RentalRequestControllers.getTenantRentalRequests
);

// Route to get all rental requests for a landlord's properties (Landlord only)
router.get(
    '/landlord/requests',
    auth(USER_ROLE.landlord),
    RentalRequestControllers.getLandlordRentalRequests
);

// Route to update a rental request status (Landlord only)
router.patch(
    // '/:requestId/status',
    '/requests/:requestId/status',
    auth(USER_ROLE.landlord),
    RentalRequestControllers.updateRentalRequestStatus
);

// Route to update payment status (Tenant only)
router.patch(
    '/:requestId/payment',
    auth(USER_ROLE.tenant),
    RentalRequestControllers.updatePaymentStatus
);

// Route to get all rental requests (landlords)
router.get(
    // '/admin/all',
    '/requests',
    // auth(USER_ROLE.admin),
    auth(USER_ROLE.landlord),
    RentalRequestControllers.getAllRentalRequests
);

// Route to get a single rental request
router.get(
    '/requests/:id',
    auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
    // auth(USER_ROLE.landlord),
    RentalRequestControllers.getSingleRentalRequest
);

// Route to delete a rental request
router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.tenant),
    RentalRequestControllers.deleteRentalRequest
);

export const RentalRequestRoutes = router;