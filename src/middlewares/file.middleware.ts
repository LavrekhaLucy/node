import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../errors/api-error';
import {configs} from '../configs/config-file';

class FileMiddleware {
    public isFileValid(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const file = req.files?.[key];

                if (!file || Array.isArray(file)) {
                    throw  new ApiError ('Avatar file is required', 400);
                }

                const maxSize = configs.FILE.MAX_SIZE_MB * 1024 * 1024;

                if (file.size > maxSize) {
                     throw  new ApiError(`File too large. Max size is ${configs.FILE.MAX_SIZE_MB}MB`, 413);
                }

                if (!configs.FILE.ALLOWED_TYPES.includes(file.mimetype)) {
                    throw  new ApiError (`Unsupported file type: ${file.mimetype}`, 415);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const fileMiddleware = new FileMiddleware();

