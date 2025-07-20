import {Router} from 'express';
import {authController} from '../controllers/auth.controller';
import {commonMiddleware} from '../middlewares/common.middleware';
import {signInSchema, updateUserSchema} from '../validators/user.validator';
import {authMiddleware} from '../middlewares/auth.middleware';


const router = Router();

router.post(
    '/sign-up',
    commonMiddleware.isBodyValid(updateUserSchema),
    authController.signUp,
);

router.post(
    '/sign-in',
    commonMiddleware.isBodyValid(signInSchema),
    authController.signIn
);


router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refreshToken,
);
router.post('/logout',
    authMiddleware.checkAccessToken,
    authController.logout);

router.post('/logout-all',
    authMiddleware.checkAccessToken,
    authController.logoutAll);




export const authRouter = router;