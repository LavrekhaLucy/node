import {Router} from 'express';
import {authController} from '../controllers/auth.controller';
import {commonMiddleware} from '../middlewares/common.middleware';
import {updateUserSchema} from '../validators/user.validator';
import {authMiddleware} from '../middlewares/auth.middleware';


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

router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refreshToken,
);




export const authRouter = router;