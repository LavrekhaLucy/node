import {NextFunction, Request, Response} from 'express';
import {ISignIn, IUser} from '../interfaces/user.interface';
import {authService} from '../services/auth.service';
import {ITokenPair} from '../interfaces/token.interface';

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IUser;
            const result = await authService.signUp(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as ISignIn;
            const result = await authService.signIn(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }
    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {

            const {refreshToken} = req.body as ITokenPair;
            const result = await authService.refreshToken(refreshToken);
            res.status(201).json(result);

        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();