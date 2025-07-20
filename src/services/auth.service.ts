import { ApiError } from '../errors/api-error';
import { ITokenPair } from '../interfaces/token.interface';
import { ISignIn, IUser } from '../interfaces/user.interface';
import { passwordService } from './password.service';
import { tokenService } from './token.service';
import {tokenRepository} from '../repositores/token.repository';
import {userRepository} from '../repositores/user.repository';
import {userService} from './user.service';
import {TokenTypeEnum} from '../enums/token-type.enum';
import {emailService} from './email.service';
import {EmailTypeEnum} from '../enums/email-type.enum';

class AuthService {
    public async signUp(
        dto: Partial<IUser>,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        await this.isEmailExistOrThrow(dto.email);
        const password = await passwordService.hashPassword(dto.password);
        const user = await userRepository.create({ ...dto, password });
        console.log('Created user:', user);
        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });

        await emailService.sendMail(
            EmailTypeEnum.WELCOME,
            'lavreha7@gmail.com',
            { name: user.name },
        );
        return { user, tokens };
    }

    public async signIn(
        dto: ISignIn,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
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
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    }

    public async refreshToken(refreshToken: string): Promise<ITokenPair> {
        if (!refreshToken) {
            throw new ApiError('No refresh token provided', 401);
        }

        const payload = tokenService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);

        const tokenFromDB = await tokenRepository.findByParams({ refreshToken });

        if (!tokenFromDB) {
            throw new ApiError('Invalid refresh token', 401);
        }

        const user = await userService.getById(payload.userId);

        const newTokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });

        await tokenRepository.create({ ...newTokens, _userId: user._id });

        return newTokens;
    }
    public async logout(refreshToken: string): Promise<void> {
         await tokenRepository.deleteByParams({ refreshToken });
            }

    public async logoutAll(userId: string): Promise<void> {
        await tokenRepository.deleteByParams({ _userId: userId });
    }


    private async isEmailExistOrThrow(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError('Email already exists', 409);
        }
    }
}

export const authService = new AuthService();