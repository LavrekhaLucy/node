import {RoleEnum} from '../enums/enum';

export interface IUser {
    _id?:string;
    name:string;
    age:number;
    email:string;
    password: string;
    role:RoleEnum;
    isEmailVerified?: boolean;
    isVerified:boolean;
    isDeleted:boolean;
    phone?:string;
    createdAt?:Date;
    updatedAt?:Date;
}
export type ISignIn = Pick<IUser, 'email' | 'password'>;

export type IResetPasswordSend = Pick<IUser, 'email'>;

export type IResetPasswordSet = Pick<IUser, 'password'> & { token: string };

export type IVerify = Pick<IUser, '_id'|'name'|'email' >;
