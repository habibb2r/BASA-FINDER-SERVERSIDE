import { Router } from 'express';
import { UserController } from './user.controller';
import verifyAdmin from '../../middlewares/verifyAdmin';
import verifyUser from '../../middlewares/verifyUser';

const UserRouter = Router();

UserRouter.get('/all', verifyAdmin, UserController.getAllUsers);
UserRouter.get(
  '/userInfo/:email',
  verifyUser,
  UserController.getSingleUser,
);
UserRouter.patch('/update', verifyAdmin, UserController.updateUserStatus);
UserRouter.patch(
  '/update/user',
  verifyUser,
  UserController.updateUserProfile,
);
UserRouter.patch(
  '/update/password',
  verifyUser,
  UserController.updateUserPassword,
);

export default UserRouter;
