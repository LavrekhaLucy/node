import {Router} from 'express';

import {authController} from '../controllers/auth.controller';
import {commonMiddleware} from '../middlewares/common.middleware';
import {updateUserSchema} from '../validators/user.validator';

const router = Router();

router.post(
    '/sign-up',
    commonMiddleware.isBodyValid(updateUserSchema),
    authController.signUp,
);
router.post(
    '/sign-in',
    //  commonMiddleware.isBodyValid(updateUserSchema),
    authController.signIn,
);

//TODO add refresh token route

export const authRouter = router;