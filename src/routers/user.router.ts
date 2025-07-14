import { Router } from 'express';
import {userController} from '../controllers/user.controllers';




const router = Router();

router.get('/', userController.getList);
router.post('/', userController.create);
router.get('/:userId', userController.getById);

router.put('/:userId', userController.updateById.bind(userController));
router.delete('/:userId', userController.delete);



export const userRouter = router;

