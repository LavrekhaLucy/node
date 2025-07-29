import { Router } from 'express';


import { authMiddleware } from '../middlewares/auth.middleware';
import { commonMiddleware } from '../middlewares/common.middleware';

import {userController} from '../controllers/user.controllers';
import {listQuerySchema, updateUserSchema} from '../validators/user.validator';

const router = Router();

router.get(
    '/',
    commonMiddleware.isQueryValid(listQuerySchema),
    userController.getList,
);

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

router.get(
    '/:userId',
    commonMiddleware.isIdValid('userId'),
    userController.getById,
);

export const userRouter = router;
