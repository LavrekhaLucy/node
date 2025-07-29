import {ApiError} from '../errors/api-error';
import {ITokenPayload} from '../interfaces/token.interface';
import {IUser} from '../interfaces/user.interface';
import {userRepository} from '../repositores/user.repository';


class UserService {

    public async getList(query: IUserListQuery): Promise<IUserListResponse> {
        const [entities, total] = await userRepository.getList(query);
        return userPresenter.toListResDto(entities, total, query);
    }

    public async getById(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }

    public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
        const user = await userRepository.getById(jwtPayload.userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }

    public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<IUser> {
        return await userRepository.updateById(jwtPayload.userId, dto);
    }

    public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
        return await userRepository.deleteById(jwtPayload.userId);
    }



}

export const userService = new UserService();