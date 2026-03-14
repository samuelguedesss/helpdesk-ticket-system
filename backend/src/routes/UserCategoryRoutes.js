import { Router } from 'express';
import UserCategoryController from '../controllers/UserCategoryController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.get('/:id_user', AuthMiddleware, UserCategoryController.getCategoriesByUser);
router.post('/:id_user', AuthMiddleware, UserCategoryController.saveCategories);

export default router;