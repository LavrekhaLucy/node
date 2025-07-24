import {ApiError} from '../errors/api-error';
import {ITokenPair, ITokenPayload} from '../interfaces/token.interface';
import {IResetPasswordSend, IResetPasswordSet, ISignIn, IUser} from '../interfaces/user.interface';
import {passwordService} from './password.service';
import {tokenService} from './token.service';
import {tokenRepository} from '../repositores/token.repository';
import {userRepository} from '../repositores/user.repository';
import {userService} from './user.service';
import {TokenTypeEnum} from '../enums/token-type.enum';
import {emailService} from './email.service';
import {EmailTypeEnum} from '../enums/email-type.enum';
import {ActionTokenTypeEnum} from '../enums/action-token-type.enum';
import {actionTokenRepository} from '../repositores/action-token.repository';

class AuthService {
    public async signUp(dto: Partial<IUser>,): Promise<{ user: IUser; tokens: ITokenPair }> {

        const password = await passwordService.hashPassword(dto.password);
        const user = await userRepository.create({ ...dto, password });
        console.log('Created user:', user);

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
            name:user.name,
            email:user.email,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });

        await emailService.sendMail(
            EmailTypeEnum.WELCOME,
            'lavreha7@gmail.com',
            { name: user.name },
        );
        return { user, tokens };
    }


    public async signIn(dto: ISignIn,): Promise<{ user: IUser; tokens: ITokenPair }> {
        const user = await userRepository.getByEmail(dto.email);
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const isPasswordCorrect = await passwordService.comparePassword(
            dto.password,
            user.password,
        );
        if (!isPasswordCorrect) {
            throw new ApiError('Invalid credentials', 401);
        }

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
            name:user.name,
            email:user.email,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    }

    public async refreshToken(refreshToken: string): Promise<ITokenPair> {

        const payload = tokenService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);

        const tokenFromDB = await tokenRepository.findByParams({ refreshToken });

        if (!tokenFromDB) {
            throw new ApiError('Invalid refresh token', 401);
        }

        const user = await userService.getById(payload.userId);

        const newTokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
            name:user.name,
            email:user.email,
        });

        await tokenRepository.create({ ...newTokens, _userId: user._id });

        return newTokens;
    }

    public async logout(refreshToken: string): Promise<void> {

        const token = await tokenRepository.findByParams({ refreshToken });
        if (!token) throw new ApiError('Refresh token not found', 404);

         await tokenRepository.deleteByParams({ refreshToken });
            }

    public async logoutAll(userId: string): Promise<void> {
        const result = await tokenRepository.deleteByParams({ _userId: userId });
        console.log(`Deleted ${result} tokens for user ${userId}`);

    }

    public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
        const user = await userRepository.getByEmail(dto.email);
        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const token = tokenService.generateActionTokens(
            {
                userId: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
            },
            ActionTokenTypeEnum.FORGOT_PASSWORD,
        );
        await actionTokenRepository.create({
            type: ActionTokenTypeEnum.FORGOT_PASSWORD,
            _userId: user._id,
            token,
        });

        await emailService.sendMail(EmailTypeEnum.FORGOT_PASSWORD,
            'lavreha7@gmail.com',
            {name: user.name,
            email: user.email,
            actionToken: token,
        });
    }

    public async forgotPasswordSet(dto: IResetPasswordSet, jwtPayload: ITokenPayload): Promise<void> {
        const password = await passwordService.hashPassword(dto.password);

        await userRepository.updateById(jwtPayload.userId, { password });

        await actionTokenRepository.deleteManyByParams({
            _userId: jwtPayload.userId,
            type: ActionTokenTypeEnum.FORGOT_PASSWORD,
        });
        await tokenRepository.deleteByParams({ _userId: jwtPayload.userId });
    }

    // public async register(dto:Partial<IUser>): Promise<void> {
    //
    //     const userExists = await userRepository.getByEmail(dto.email);
    //     if (userExists) {
    //         throw new ApiError('User with this email already exists', 409);
    //     }
    //
    //     const hashedPassword = await passwordService.hashPassword(dto.password);
    //     const createdUser = await userRepository.create({
    //         name: dto.name,
    //         email: dto.email,
    //         password: hashedPassword,
    //         role: RoleEnum.User,
    //         isEmailVerified: false,
    //     });
    //
    //     const token = tokenService.generateActionTokens(
    //         {
    //             userId: createdUser._id,
    //             name: createdUser.name,
    //             email: createdUser.email,
    //             role: createdUser.role,
    //         },
    //         ActionTokenTypeEnum.VERIFY_EMAIL
    //     );
    //
    //     await actionTokenRepository.create({
    //         _userId: createdUser._id,
    //         token,
    //         type: ActionTokenTypeEnum.VERIFY_EMAIL,
    //     });
    //
    //     await emailService.sendVerifyEmail(
    //         EmailTypeEnum.VERIFY_EMAIL,
    //         createdUser.email,
    //         {
    //             name: createdUser.name,
    //             email: createdUser.email,
    //             verifyLink: `${configs.APP_FRONT_URL}/auth/verify-email?token=${token}`,
    //
    //         }
    //     );
    // }

    // public async verifyEmail(token:string): Promise<IActionToken> {
    //     try {
    //         const token = actionTokenRepository.findOneByParams({token});
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

}

export const authService = new AuthService();