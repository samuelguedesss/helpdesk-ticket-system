import { Router } from 'express';
import CalledFiledValueController from '../controllers/CalledFiledValueController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.post('/:id_called/field', AuthMiddleware, CalledFiledValueController.createCalledFieldValue);
export default router;