import {ApiError} from '../errors/api-error';
import {userRepository} from '../repositores/user.repository';
import {NextFunction, Request, Response} from 'express';

class UserMiddleware {

    public async isEmailExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            const user = await userRepository.getByEmail(email);
            if (user) {
                throw new ApiError(`User with email ${email} already exists`, 409);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const userMiddleware = new UserMiddleware();