import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const UserRouter = Router();

UserRouter.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

UserRouter.patch(
  "/update-profile",
  auth(USER_ROLE.landlord, USER_ROLE.admin, USER_ROLE.tenant),
  UserController.updateUserProfile
);
UserRouter.patch('/update', auth(USER_ROLE.admin), UserController.updateUserStatus);
UserRouter.patch(
  '/update/user',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  UserController.updateUserProfile,
);
UserRouter.patch(
  '/update/password',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  UserController.updateUserPassword,
);

UserRouter.get(
  '/my-profile/:id',
  auth(USER_ROLE.landlord, USER_ROLE.admin, USER_ROLE.tenant),
  UserController.getSingleUser,
);

export default UserRouter;
