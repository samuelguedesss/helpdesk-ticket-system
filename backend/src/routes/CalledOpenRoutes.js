import { Router } from 'express';
import CalledOpenController from '../controllers/CalledOpenController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post('/', AuthMiddleware, CalledOpenController.calledOpen); 

export default router;