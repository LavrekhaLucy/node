import {ApiError} from '../errors/api-error';
import {ITokenPair, ITokenPayload} from '../interfaces/token.interface';
import {IChangePassword, IResetPasswordSend, IResetPasswordSet, ISignIn, IUser} from '../interfaces/user.interface';
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
import { configs } from '../configs/config';
import {oldPasswordRepository} from '../repositores/old-password.repository';


class AuthService {
    public async signUp(dto: Partial<IUser>): Promise<{ user: IUser; tokens: ITokenPair }> {
        const password = await passwordService.hashPassword(dto.password);

        const user = await userRepository.create({ ...dto, password });
        console.log('Created user:', user);

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
        });

        await tokenRepository.create({ ...tokens, _userId: user._id });

        const verificationToken = tokenService.generateActionTokens(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            ActionTokenTypeEnum.VERIFY_EMAIL
        );

        await actionTokenRepository.create({
            _userId: user._id,
            token: verificationToken,
            type: ActionTokenTypeEnum.VERIFY_EMAIL
        });

        const verificationLink = `${configs.APP_FRONT_URL}/auth/verify-email?token=${verificationToken}`;

        await emailService.sendMail(
            EmailTypeEnum.VERIFY_EMAIL,
            'lavreha7@gmail.com',
            {
                name: user.name,
                verifyLink: verificationLink,
            });
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


    public async verifyEmail(jwtPayload: ITokenPayload): Promise<void> {

        const user = await userRepository.getById(jwtPayload.userId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        if (user.isVerified) {
            throw new ApiError('Email already verified', 400);
        }

        await userRepository.updateById(jwtPayload.userId, { isVerified: true });

        await actionTokenRepository.deleteManyByParams({
            _userId: jwtPayload.userId,
            type: ActionTokenTypeEnum.VERIFY_EMAIL,
        });

        console.log(` Email verified for ${user.email}`);
    }

    public async changePassword(jwtPayload: ITokenPayload, dto: IChangePassword,): Promise<void> {
        const user = await userRepository.getById(jwtPayload.userId);
        const oldPasswords = await oldPasswordRepository.findByParams(jwtPayload.userId);
        const isPasswordCorrect = await passwordService.comparePassword(
            dto.oldPassword,
            user.password,
        );
        if (!user || !user.password) {
            throw new ApiError('User or password not found', 404);
        }
        if (!isPasswordCorrect) {
            throw new ApiError('Invalid previous password', 401);
        }
        const passwords = [...oldPasswords, {password:user.password}];
        await Promise.all(
            passwords.map(async (oldPassword) => {
                const isPrevious = await passwordService.comparePassword(dto.password, oldPassword.password);
                if (isPrevious) {
                    throw new ApiError('This password was already used', 400);
                }
            }),
        );
        const  password = await passwordService.hashPassword(dto.password);

        await userRepository.updateById(jwtPayload.userId, { password});
        await oldPasswordRepository.create({
            _userId:jwtPayload.userId,
            password:user.password
        });
        await tokenRepository.deleteByParams({ _userId: jwtPayload.userId });
    }
}

export const authService = new AuthService();
