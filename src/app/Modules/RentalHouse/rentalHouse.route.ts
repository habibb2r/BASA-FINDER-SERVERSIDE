
import express from 'express';
import { RentalHouseControllers } from './rentalHouse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Route to create a new rental house (Landlord only)
router.post(
    // '/create/listings',
    '/listings',
    auth(USER_ROLE.landlord),
    RentalHouseControllers.createRentalHouse
);

// Route to get all rental houses (Public)
router.get('/listings', RentalHouseControllers.getAllRentalHouses);

// Route to get a single rental house by ID (Public)
router.get('/listings/:id',RentalHouseControllers.getSingleRentalHouse);

// Route to get all rental houses by landlord (Private - Landlord)
router.get(
    '/landlord/listings',
    auth(USER_ROLE.landlord),
    RentalHouseControllers.getRentalHousesByLandlord
);

// Route to delete a rental house by ID (Landlord or Admin)
router.delete(
    '/listings/:rentalHouseId',
    auth(USER_ROLE.landlord, USER_ROLE.admin),
    RentalHouseControllers.deleteRentalHouse
);

// Route to update a rental house (Landlord or Admin)
router.patch(
    '/listings/:rentalHouseId',
    auth(USER_ROLE.landlord, USER_ROLE.admin),
    RentalHouseControllers.updateRentalHouseHandler
);

export const RentalHouseRoutes = router;
