import { Router } from 'express';
import NotificationController from '../controllers/NotificationController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Busca todas as notificações do usuário logado
router.get('/', NotificationController.getNotifications);

// Busca quantidade de não lidas
router.get('/unread-count', NotificationController.getUnreadCount);

// Marca todas como lidas
router.patch('/mark-all-read', NotificationController.markAllAsRead);

// Marca uma como lida
router.patch('/:id/read', NotificationController.markAsRead);

router.delete('/:id', NotificationController.deleteOne);

router.delete('/', NotificationController.deleteAll);

export default router;