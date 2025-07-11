import { Router } from 'express';
import {userController} from '../controllers/user.controllers';




const router = Router();

router.get('/', userController.getList);
router.post('/', userController.create);
router.get('/:userId', userController.getById);
// router.put('/:userId', userController.putById);

router.put('/:userId', userController.putById.bind(userController));
router.delete('/:userId', userController.delete);



export const userRouter = router;

console.log('userRouter is:', typeof userRouter);