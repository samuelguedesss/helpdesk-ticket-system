import { Router } from 'express';
import CalledController from '../controllers/CalledController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.get('/tecnico', AuthMiddleware, CalledController.getCalledsByTecnico);
router.get('/historico', AuthMiddleware, CalledController.getHistory);
router.get('/financial-approval', AuthMiddleware, CalledController.getPendingFinancialApprovals);
router.get('/', AuthMiddleware, CalledController.getAllCalleds);
router.patch('/:id/reabrir', AuthMiddleware, CalledController.reopenCalled);
router.get('/:id', AuthMiddleware, CalledController.getCalledDetails);
router.patch('/:id/assumir', AuthMiddleware, CalledController.assumirCalled);
router.patch('/:id/status', AuthMiddleware, CalledController.updateStatus);
router.patch('/:id/prioridade', AuthMiddleware, CalledController.updatePrioridade);
router.patch('/:id/financial-approval', AuthMiddleware, CalledController.resolveFinancialApproval);

export default router;