
import express from 'express';
import { PaymentController } from './payment.controller';
import verifyTenant from '../../middlewares/verifyTenant';
import verifyUser from '../../middlewares/verifyUser';
import verifyAdmin from '../../middlewares/verifyAdmin';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/create', auth(USER_ROLE.tenant), PaymentController.createPayment);

router.get('/verify', verifyUser, PaymentController.verifyPayment);

router.get('/', verifyAdmin, PaymentController.getPayments);

router.get('/my-payments', auth(USER_ROLE.tenant), PaymentController.getMyPayments);

router.get('/revenue', verifyAdmin, PaymentController.calculateRevenue);

export const PaymentRoutes = router;
