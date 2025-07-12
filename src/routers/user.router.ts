import { Router } from 'express';
import {userController} from '../controllers/user.controllers';
import {commonMiddleware} from '../middlewares/common.middleware';




const router = Router();

router.get('/', userController.getList);
router.post('/', userController.create);

router.get('/:userId',commonMiddleware.isIdValid('userId'), userController.getById);
router.put('/:userId',commonMiddleware.isIdValid('userId'), userController.putById.bind(userController));
router.delete('/:userId',commonMiddleware.isIdValid('userId'), userController.delete);



export const userRouter = router;

console.log('userRouter is:', typeof userRouter);