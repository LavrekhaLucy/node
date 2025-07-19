import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
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

    public isBodyValid(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body);
                next();
            } catch (e) {
                next(new ApiError(e.details[0].message, 400));
            }
        };
    }
}


//
// // middlewares/validation.middleware.js
// const { body, validationResult } = require('express-validator');
//
// // Middleware для обработки ошибок валидации
// const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     next(); // Если ошибок нет, передаем управление следующему middleware/контроллеру
// };
//
// // Правила валидации для маршрута входа (sign-in)
// const signInValidationRules = () => {
//     return [
//         body('email')
//             .isEmail().withMessage('Please enter a valid email address.')
//             .normalizeEmail(), // Опционально: нормализовать email (например, в нижний регистр)
//         body('password')
//             .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
//         // Дополнительные проверки могут быть добавлены здесь, если нужно
//     ];
// };
//
// module.exports = {
//     signInValidationRules,
//     handleValidationErrors
// };


export const commonMiddleware = new CommonMiddleware();