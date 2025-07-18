import {model, Schema} from 'mongoose';
import {IUser} from '../interfaces/user.interface';
import {RoleEnum} from '../enums/enum';

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/},
    password: { type: String, required: true, select: false },
    age: {type: Number, required: true},
    phone: {type: Number, required: false},
    role: {type: String, enum: RoleEnum, default: RoleEnum.User},
    isVerified: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
},
{
  timestamps: true,
  versionKey: false,
},

);
export const User = model<IUser>('users', UserSchema);