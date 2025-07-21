import { NextFunction, Request, Response } from 'express';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { ApiError } from '../errors/api-error';
import { tokenService } from '../services/token.service';
import {tokenRepository} from '../repositores/token.repository';

class AuthMiddleware {
    public async checkAccessToken(req: Request, res: Response, next: NextFunction,) {
        try {
            const header = req.headers.authorization;
            if (!header) {
                throw new ApiError('Token is not provided', 401);
            }
            const accessToken = header.split('Bearer ')[1];
            const payload = tokenService.verifyToken(
                accessToken,
                TokenTypeEnum.ACCESS,
            );

            const pair = await tokenRepository.findByParams({accessToken});
            if (!pair) {
                throw new ApiError('Token is not valid', 401);
            }
            req.res.locals.jwtPayload = payload;
            next();
        } catch (e) {
            next(e);
        }
    }


    public async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.body;
            if (!refreshToken) {
                throw new ApiError('Refresh token missing', 401);
            }
            const tokenPair = await tokenRepository.findByParams({ refreshToken: refreshToken });
            if (!tokenPair) {
                throw new ApiError('Refresh token is invalid or has been revoked', 401);
            }
            const payload = tokenService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
            req.res.locals.jwtPayload = payload;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();