import { Router } from 'express';
import { UserController } from './user.controller';
import verifyAdmin from '../../middlewares/verifyAdmin';
import verifyCustomer from '../../middlewares/verifyCustomer';

const UserRouter = Router();

UserRouter.get('/all', verifyAdmin, UserController.getAllUsers);
UserRouter.get(
  '/userInfo/:email',
  verifyCustomer,
  UserController.getSingleUser,
);
UserRouter.patch('/update', verifyAdmin, UserController.updateUserStatus);
UserRouter.patch(
  '/update/user',
  verifyCustomer,
  UserController.updateUserProfile,
);
UserRouter.patch(
  '/update/password',
  verifyCustomer,
  UserController.updateUserPassword,
);

export default UserRouter;
