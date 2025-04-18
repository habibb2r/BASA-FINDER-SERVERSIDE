import { Router } from 'express';
import AuthRouter from '../Modules/Auth/auth.route';
import { RentalHouseRoutes } from '../Modules/RentalHouse/rentalHouse.route';
import { RentalRequestRoutes } from '../Modules/RentalRequest/rentalRequest.route';
import { PaymentRoutes } from '../Modules/Payment/payment.routes';
import UserRouter from '../Modules/User/user.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/landlords',
    route: RentalHouseRoutes, 
  },
  {
   
    path: '/rental-request',
    route: RentalRequestRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes, 
  },
  {
    path: '/user',
    route: UserRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
