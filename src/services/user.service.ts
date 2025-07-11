import { ApiError } from '../errors/api-error';
import { IUser } from '../interfaces/user.interface';
import {userRepository} from '../repositores/user.repository';


class UserService {
    public async getList(): Promise<IUser[]> {
        return await userRepository.getList();
    }

    public async create(dto: Partial<IUser>): Promise<IUser> {
        if (!dto.name || dto.name.length < 3) {
            throw new ApiError(
                'Name is required and should be at least 3 characters long', 400,);}
        if (!dto.name || dto.name.length <= 3) {
            throw new ApiError ('Name must be longer than 3 characters', 400);}
        if (isNaN(dto.age) || dto.age < 0) {
            throw new ApiError ('Age must be a number greater than or equal to 0', 400);}

        return await userRepository.create(dto);
    }

    public async getById(userId: number): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }

    public async putById(userId: number, dto: Partial<IUser>): Promise<IUser> {
            const user = await userRepository.putById(userId, dto);
            if (!user) {
                throw new ApiError('User not found', 404);
            }
            return user;
    }

    public async delete(userId: number): Promise<IUser> {
        const user = await userRepository.delete(userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }
}

export const userService = new UserService();