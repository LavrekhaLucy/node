import {RoleEnum} from '../enums/enum';


export interface IToken {
    _id?: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITokenPayload {
    userId: string;
    role: RoleEnum;
    email: string;
    name: string;

}

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}


