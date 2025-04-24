
import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/create', auth(USER_ROLE.tenant), PaymentController.createPayment);

router.get('/verify', auth(USER_ROLE.tenant, USER_ROLE.landlord, USER_ROLE.admin), PaymentController.verifyPayment);

router.get('/', auth(USER_ROLE.admin), PaymentController.getPayments);

router.get('/my-payments', auth(USER_ROLE.tenant), PaymentController.getMyPayments);

router.get('/revenue', auth(USER_ROLE.admin), PaymentController.calculateRevenue);

export const PaymentRoutes = router;
