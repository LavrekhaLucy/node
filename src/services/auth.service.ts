import { ApiError } from '../errors/api-error';
import { ITokenPair } from '../interfaces/token.interface';
import { ISignIn, IUser } from '../interfaces/user.interface';

import { passwordService } from './password.service';
import {userRepository} from '../repositores/user.repository';
import {tokenService} from './token.service';
import {tokenRepository} from '../repositores/token.repository';


class AuthService {
    public async signUp(
        dto: Partial<IUser>,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        await this.isEmailExistOrThrow(dto.email);
        const password = await passwordService.hashPassword(dto.password);console.log('HERE');
        const user = await userRepository.create({ ...dto, password });

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
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

    // TODO add refresh token service

    private async isEmailExistOrThrow(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError('Email already exists', 409);
        }
    }
}

export const authService = new AuthService();