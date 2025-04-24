import { Router } from 'express';
import { UserController } from './user.controller';
import verifyAdmin from '../../middlewares/verifyAdmin';
import verifyUser from '../../middlewares/verifyUser';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const UserRouter = Router();

UserRouter.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

UserRouter.patch(
  "/update-profile",
  auth(USER_ROLE.landlord, USER_ROLE.admin, USER_ROLE.tenant),
  UserController.updateUserProfile
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

UserRouter.get(
  '/my-profile/:id',
  auth(USER_ROLE.landlord, USER_ROLE.admin, USER_ROLE.tenant),
  UserController.getSingleUser,
);

export default UserRouter;
