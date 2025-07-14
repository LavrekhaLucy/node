import { Router } from 'express';
import {userController} from '../controllers/user.controllers';
import {commonMiddleware} from '../middlewares/common.middleware';
import {updateUserSchema, userBodySchema, userIdSchema, userQuerySchema} from '../validators/user.validator';


const router = Router();

router.get('/',
    commonMiddleware.isQueryValid(userQuerySchema),
    userController.getList);


router.post('/',
    commonMiddleware.isBodyValid(userBodySchema),
    userController.create);


router.get('/:userId',
    commonMiddleware.isParamsValid(userIdSchema),
    userController.getById);


router.put('/:userId',
    commonMiddleware.isParamsValid(userIdSchema),
    commonMiddleware.isBodyValid(updateUserSchema),
    userController.updateById.bind(userController));


router.delete('/:userId',
    commonMiddleware.isParamsValid(userIdSchema),
    userController.deleteById);



export const userRouter = router;

