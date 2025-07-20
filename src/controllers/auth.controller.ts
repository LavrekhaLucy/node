import {NextFunction, Request, Response} from 'express';
import {ISignIn, IUser} from '../interfaces/user.interface';
import {authService} from '../services/auth.service';
import {ITokenPair} from '../interfaces/token.interface';
// import {emailService} from "../services/email.service";
// import {EmailTypeEnum} from "../enums/email-type.enum";

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

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            await authService.logout(refreshToken);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }

    // public async logoutAll(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { _id, email } = req.user;
    //
    //         await authService.logoutAll(_id);
    //         await emailService.sendMail(
    //             EmailTypeEnum.LOGOUT_ALL,
    //             email, { name: req.user.name } );
    //
    //         res.status(200).json({ message: 'All sessions terminated. Email sent.' });
    //     } catch (e) {
    //         next(e);
    //     }
    // }

}

export const authController = new AuthController();