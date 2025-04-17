import { model, Schema } from 'mongoose';
import { TCreateUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TLogin } from '../Auth/auth.interface';

const createUserSchema = new Schema<TCreateUser, TLogin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], required: true },
    isBlocked: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: false, required: true },
    photoURL: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users',
  },
);

createUserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const data = this;
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

createUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
createUserSchema.statics.isUserExistsByCustomId = async function (
  email: string,
) {
  return await createUserModel.findOne({ email }).select('+password');
};

export const createUserModel = model<TCreateUser, TLogin>(
  'users',
  createUserSchema,
);
