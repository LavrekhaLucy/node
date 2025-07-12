import { NextFunction, Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';

import { ApiError } from '../errors/api-error';

class CommonMiddleware {
    public isIdValid(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!isObjectIdOrHexString(req.params[key])) {
                    throw new ApiError('Invalid ID', 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}
//     isIdValid: (param: string) => (req: Request, res: Response, next: NextFunction) => {
//         const id = Number(req.params[param]);
//         if (!id || id < 1) {
//     return res.status(400).json({ error: `Invalid ${param}` });
// }
// next();
// },

//     isBodyValid: (schema: Joi.ObjectSchema) =>
//         (req: Request, res: Response, next: NextFunction) => {
//             const {
//     error
// }
//
// = schema.validate(req.body);
// if (error) {
//     return res.status(400).json({error: error.details[0].message});
// }
// next();
// },
// }
// }

export const commonMiddleware = new CommonMiddleware();