// route.ts
import express from 'express';
import { RentalRequestControllers } from './rentalRequest.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import verifyTenant from '../../middlewares/verifyTenant';
import verifyLandlord from '../../middlewares/verifyLandlord';
import verifyUser from '../../middlewares/verifyUser';

const router = express.Router();

router.post(
  '/tenants/create',
  verifyTenant,
  RentalRequestControllers.createRentalRequest,
);

router.get(
  '/tenants/requests',
  verifyTenant,
  RentalRequestControllers.getTenantRentalRequests,
);

router.get(
  '/landlord/requests',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalRequestControllers.getLandlordRentalRequests,
);

router.patch(
  '/requests/:requestId/status',
  verifyLandlord,
  RentalRequestControllers.updateRentalRequestStatus,
);

router.patch(
  '/:requestId/payment',
  verifyTenant,
  RentalRequestControllers.updatePaymentStatus,
);

router.get(
  '/requests',
  verifyLandlord,
  RentalRequestControllers.getAllRentalRequests,
);

router.get(
  '/requests/:id',
  verifyUser,
  RentalRequestControllers.getSingleRentalRequest,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.tenant),
  RentalRequestControllers.deleteRentalRequest,
);

export const RentalRequestRoutes = router;
