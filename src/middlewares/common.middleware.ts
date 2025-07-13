import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';
import {ApiError} from '../errors/api-error';

class CommonMiddleware {
    public isParamsValid(schema: Joi.ObjectSchema) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const {error} = schema.validate(req.params);
                if (error) {
                    const errorMessage = error.details.map(detail => detail.message).join(', ');
                    throw new ApiError(errorMessage, 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
    public isBodyValid(schema: Joi.ObjectSchema) {
            return (req: Request, res: Response, next: NextFunction) => {
                try {
                    const {error} = schema.validate(req.body);
                    if (error) {
                        const errorMessage = error.details.map(detail => detail.message).join(', ');
                        throw new ApiError(errorMessage, 400);
                    }
                    next();
                } catch (e) {
                    next(e);
                }
            };
        }

    public isQueryValid(schema: Joi.ObjectSchema) {
            return (req: Request, res: Response, next: NextFunction) => {
                try {
                    const {error} = schema.validate(req.query);
                    if (error) {
                        const errorMessage = error.details.map(detail => detail.message).join(', ');
                        throw new ApiError(errorMessage, 400);
                    }
                    next();
                } catch (e) {
                    next(e);
                }
            };
        }
    }


export const commonMiddleware = new CommonMiddleware();

