// route.ts
import express from 'express';
import { RentalRequestControllers } from './rentalRequest.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/tenants/create',
  auth(USER_ROLE.tenant),
  RentalRequestControllers.createRentalRequest,
);

router.get(
  '/tenants/requests',
  auth(USER_ROLE.tenant),
  RentalRequestControllers.getTenantRentalRequests,
);

router.get(
  '/rental-request/landlord/requests',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalRequestControllers.getLandlordRentalRequests,
);

router.patch(
  '/requests/:requestId/status',
  auth(USER_ROLE.landlord),
  RentalRequestControllers.updateRentalRequestStatus,
);

router.patch(
  '/:requestId/payment',
  auth(USER_ROLE.tenant),
  RentalRequestControllers.updatePaymentStatus,
);

router.get(
  '/requests',
  auth(USER_ROLE.landlord),
  RentalRequestControllers.getAllRentalRequests,
);

router.get(
  '/requests/:id',
  auth(USER_ROLE.landlord, USER_ROLE.tenant, USER_ROLE.admin),
  RentalRequestControllers.getSingleRentalRequest,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.tenant),
  RentalRequestControllers.deleteRentalRequest,
);

export const RentalRequestRoutes = router;
