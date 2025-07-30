import { IUser } from '../interfaces/user.interface';
import {configs} from '../configs/config';

class UserPresenter {
    toPublicResDto(entity: IUser) {
        return {
            _id: entity._id,
            name: entity.name,
            email: entity.email,
            age: entity.age,
            role: entity.role,
            avatar: entity.avatar
                ? `${configs.AWS_S3_ENDPOINT}/${entity.avatar}`
                : null,
            isDeleted: entity.isDeleted,
            isVerified: entity.isVerified,
        };
    }
}

export const userPresenter = new UserPresenter();