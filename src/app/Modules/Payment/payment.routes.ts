
import express from 'express';
import { PaymentController } from './payment.controller';
import verifyTenant from '../../middlewares/verifyTenant';
import verifyUser from '../../middlewares/verifyUser';
import verifyAdmin from '../../middlewares/verifyAdmin';

const router = express.Router();

router.post('/create', verifyTenant, PaymentController.createPayment);

router.get('/verify', verifyUser, PaymentController.verifyPayment);

router.get('/', verifyAdmin, PaymentController.getPayments);

router.get('/my-payments', verifyUser, PaymentController.getMyPayments);

router.get('/revenue', verifyAdmin, PaymentController.calculateRevenue);

export const PaymentRoutes = router;
