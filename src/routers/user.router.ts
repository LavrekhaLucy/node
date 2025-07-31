import {Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware';
import {commonMiddleware} from '../middlewares/common.middleware';
import {userController} from '../controllers/user.controllers';
import {updateUserSchema} from '../validators/user.validator';
import {fileMiddleware} from '../middlewares/file.middleware';

const router = Router();

router.get('/',
    userController.getList);

router.get('/me',
    authMiddleware.checkAccessToken,
    userController.getMe);

router.put(
    '/me',
    authMiddleware.checkAccessToken,
    commonMiddleware.isBodyValid(updateUserSchema),
    userController.updateMe,
);
router.delete('/me',
    authMiddleware.checkAccessToken,
    userController.deleteMe);

router.post(
    '/me/avatar',
    authMiddleware.checkAccessToken,
    fileMiddleware.isFileValid('avatar'),
    userController.uploadAvatar,
);

router.get(
    '/:userId',
    commonMiddleware.isIdValid('userId'),
    userController.getById,
);


export const userRouter = router;
