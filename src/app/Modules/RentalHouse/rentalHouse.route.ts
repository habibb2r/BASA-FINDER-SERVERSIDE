import express from 'express';
import { RentalHouseControllers } from './rentalHouse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/listings',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalHouseControllers.createRentalHouse,
);

router.get('/listings', RentalHouseControllers.getAllRentalHouses);

router.get('/listings/:id', RentalHouseControllers.getSingleRentalHouse);

router.get(
  '/landlord/listings',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalHouseControllers.getRentalHousesByLandlord,
);

router.delete(
  '/listings/:rentalHouseId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalHouseControllers.deleteRentalHouse,
);

router.patch(
  '/listings/:rentalHouseId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RentalHouseControllers.updateRentalHouseHandler,
);

export const RentalHouseRoutes = router;
