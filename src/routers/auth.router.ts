import {Router} from 'express';
import {authController} from '../controllers/auth.controller';
import {commonMiddleware} from '../middlewares/common.middleware';
import {changePasswordSchema, signInSchema, updateUserSchema, verifyEmailSchema} from '../validators/user.validator';
import {authMiddleware} from '../middlewares/auth.middleware';
import {userMiddleware} from '../middlewares/user.middleware';
import {ActionTokenTypeEnum} from '../enums/action-token-type.enum';


const router = Router();

router.post(
    '/sign-up',
    commonMiddleware.isBodyValid(updateUserSchema),
    userMiddleware.isEmailExist,
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

router.post('/forgot-password',
    authController.forgotPasswordSendEmail);

router.put(
    '/forgot-password',
    authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
    authController.forgotPasswordSet
);

router.post(
    '/change-password',
    authMiddleware.checkAccessToken,
    commonMiddleware.isBodyValid(changePasswordSchema),
    authController.changePassword,
);

router.post(
    '/verify-email',
    commonMiddleware.isBodyValid(verifyEmailSchema),
    authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
    authController.verifyEmail,
);

export const authRouter = router;