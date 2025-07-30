import {RoleEnum} from '../enums/enum';
import {IOldPassword} from './old-password.interface';

export interface IUser {
    _id?:string;
    name:string;
    age:number;
    email:string;
    password: string;
    oldPasswords?: IOldPassword[];
    role:RoleEnum;
    isVerified:boolean;
    isDeleted:boolean;
    phone?:string;
    avatar?: string;
    createdAt?:Date;
    updatedAt?:Date;
}
export type ISignIn = Pick<IUser, 'email' | 'password'>;

export type IResetPasswordSend = Pick<IUser, 'email'>;

export type IResetPasswordSet = Pick<IUser, 'password'> & { token: string };

export type IChangePassword = Pick<IUser, 'password'> & { oldPassword: string };


