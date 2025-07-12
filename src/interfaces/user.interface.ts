import {RoleEnum} from '../enums/enum';

export interface IUser {

    id:number;
    name:string;
    age:number;
    email:string;
    phone?:string;
    role:RoleEnum;
    isVerified:boolean;
    isDeleted:boolean;
    createdAt?:Date;
    updatedAt?:Date;






}