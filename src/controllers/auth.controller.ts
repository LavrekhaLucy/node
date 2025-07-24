import {NextFunction, Request, Response} from 'express';
import {IResetPasswordSend, IResetPasswordSet, ISignIn, IUser, IVerify} from '../interfaces/user.interface';
import {authService} from '../services/auth.service';
import {ITokenPair, ITokenPayload} from '../interfaces/token.interface';
import {emailService} from '../services/email.service';
import {EmailTypeEnum} from '../enums/email-type.enum';

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

    public async logoutAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId:_id, email, name } = res.locals.jwtPayload as ITokenPayload;

            await authService.logoutAll(_id);
            await emailService.sendMail(
                EmailTypeEnum.LOGOUT_ALL,
                'lavreha7@gmail.com',
                {
                    name,
                    email,
                });
            res.status(200).json({ message: 'All sessions terminated. Email sent.' });
        } catch (e) {
            next(e);
        }
    }

    public async forgotPasswordSendEmail(req: Request, res: Response, next: NextFunction,
    ) {
        try {
            const dto = req.body as IResetPasswordSend;
            await authService.forgotPasswordSendEmail(dto);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }

    public async forgotPasswordSet(req: Request, res: Response, next: NextFunction,
    ) {
        try {
            const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
            const dto = req.body as IResetPasswordSet;

            await authService.forgotPasswordSet(dto, jwtPayload);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }
    public async register(req: Request, res: Response, next: NextFunction) {
        try {

            const dto = req.body as IVerify;

            await authService.register(dto);
            res.status(201).json({ message: 'User created. Please verify your email.' });
        } catch (e) {
            next(e);
        }
    }
    // public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const token = req.query.token as string;
    //         if (!token) {
    //             throw new ApiError('Token is missing', 400);
    //         }
    //
    //         const payload = tokenService.verifyToken(token, ActionTokenTypeEnum.VERIFY_EMAIL);
    //
    //         const tokenEntity = await actionTokenRepository.findOneByParams({
    //             token,
    //             _userId: payload.userId,
    //             type: ActionTokenTypeEnum.VERIFY_EMAIL,
    //         });
    //
    //         if (!tokenEntity) {
    //             throw new ApiError('Token is not valid or already used', 401);
    //         }
    //
    //         await userRepository.updateById(payload.userId, {
    //             isEmailVerified: true,
    //         });
    //
    //         await actionTokenRepository.deleteManyByParams({
    //             _userId: payload.userId,
    //             type: ActionTokenTypeEnum.VERIFY_EMAIL,
    //         });
    //
    //         res.status(200).json({ message: 'Email successfully verified' });
    //     } catch (e) {
    //         next(e);
    //     }
    // }
//     public async verify(req: Request, res: Response, next: NextFunction) {
//         try {
//             const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
//
//             await authService.verify(jwtPayload);
//             res.sendStatus(204);
//         } catch (e) {
//             next(e);
//         }
//     }
//
//     public async changePassword(req: Request, res: Response, next: NextFunction) {
//         try {
//             const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
//             const dto = req.body as IChangePassword;
//
//             await authService.changePassword(jwtPayload, dto);
//             res.sendStatus(204);
//         } catch (e) {
//             next(e);
//         }
//     }
// }
}

export const authController = new AuthController();