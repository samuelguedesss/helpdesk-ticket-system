import { Router } from 'express';
import PasswordResetController from '../controllers/PasswordResetController.js';

const router = Router();

router.post('/request', PasswordResetController.requestReset);
router.get('/verify/:token', PasswordResetController.verifyToken);
router.post('/reset', PasswordResetController.resetPassword);

export default router;