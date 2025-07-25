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
import { configs } from '../configs/config';

// public async signUp(dto: Partial<IUser>,jwtPayload: ITokenPayload): Promise<{ user: IUser; tokens: ITokenPair }> {
//
//     const password = await passwordService.hashPassword(dto.password);
//     const user = await userRepository.create({ ...dto, password });
//     console.log('Created user:', user);
//
//     const tokens = tokenService.generateTokens({
//         userId: user._id,
//         role: user.role,
//         name:user.name,
//         email:user.email,
//     });
//
//     const verificationToken = tokenService.generateActionTokens({
//         userId: user._id,
//         email: user.email,
//         role: user.role,
//         name: user.name,
// });
//      const verificationLink = `${config.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
//
//     await emailService.sendMail(
//         EmailTypeEnum.WELCOME,
//         'lavreha7@gmail.com',
//         { name: user.name, verifyLink:verificationLink},
//     );
//     return { user, tokens };
// }

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

            }
        );

        return { user, tokens };
    }
    // public async signUp(dto: Partial<IUser>,): Promise<{ user: IUser; tokens: ITokenPair }> {
    //
    //     const password = await passwordService.hashPassword(dto.password);
    //     const user = await userRepository.create({ ...dto, password });
    //     console.log('Created user:', user);
    //
    //     // 1. Генерація Access та Refresh Токенів (використовує generateTokens)
    //     const tokens = tokenService.generateTokens({
    //         userId: user._id, // Завжди перетворюйте ObjectId на string для JWT payload
    //         role: user.role,
    //         name: user.name,
    //         email: user.email,
    //     });
    //
    //     // 2. Генерація Токену Верифікації (повинен використовувати generateVerificationToken)
    //     // Ви використовували generateTokens, але це має бути окремий метод для токенів верифікації
    //     const verificationToken = tokenService.generateVerificationToken({ // <-- ВИПРАВЛЕНО ТУТ!
    //         userId: user._id, // Завжди перетворюйте ObjectId на string
    //         email: user.email,
    //         role: user.role,
    //         name: user.name, // Якщо потрібно, щоб ім'я було в payload верифікаційного токена
    //     });
    //
    //     // 3. Формування посилання верифікації
    //     // Використовуйте змінну конфігурації (config.FRONTEND_URL або config.BASE_URL)
    //     const verificationLink = `${config.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`; // <-- ВИПРАВЛЕНО ТУТ!
    //
    //     // 4. Надсилання листа верифікації
    //     // Надсилаємо лист на email користувача (user.email), а не на фіксовану адресу
    //     await emailService.sendMail(
    //         EmailTypeEnum.WELCOME,
    //         'lavreha7@gmail.com', // <-- ВИПРАВЛЕНО ТУТ! Використовуємо реальний email користувача
    //         { name: user.name, link: verificationLink}, // <-- ВИПРАВЛЕНО ТУТ! Назва ключа має відповідати шаблону
    //     );
    //
    //     // 5. Збереження токенів у базі даних (лише Access/Refresh)
    //     // Цей рядок був відсутній у вашому останньому фрагменті, але він КРИТИЧНИЙ
    //     // для функціонування Refresh Token та Logout
    //     await tokenRepository.create({ ...tokens, _userId: user._id });
    //
    //
    //     return { user, tokens };
    // }


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


    // public async verify(jwtPayload: ITokenPayload): Promise<void> {
    //
    //     await userRepository.updateById(jwtPayload.userId, { isVerified: true });
    //     await actionTokenRepository.deleteManyByParams({
    //         _userId: jwtPayload.userId,
    //         type: ActionTokenTypeEnum.VERIFY_EMAIL,
    //
    //     });

    // }

    public async verify(jwtPayload: ITokenPayload): Promise<void> {

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

        console.log(`✅ Email verified for ${user.email}`);
    }

}

export const authService = new AuthService();