import { Router } from 'express';
import authMiddleware from '../middlewares/AuthMiddleware.js'; 

import AuthRoutes from './AuthRoutes.js'
import UserRoutes from './UserRoutes.js'
import CostCenterRoutes from './CostCenterRoutes.js'
import DepartmentRoutes from './DepartmentRoutes.js'
import CategoryRoutes from './CategoryRoutes.js'
import SubCategoryRoutes from './SubCategoryRoutes.js'
import CalledOpenRoutes from './CalledOpenRoutes.js'
import CalledFiledValueRoutes from './CalledFiledValueRoutes.js'
import CalledRoutes from './CalledRoutes.js'
import SubcategoryFormFieldRoutes from './subcategoryFormFieldsRoutes.js';
import UserCategoryRoutes from './UserCategoryRoutes.js'
import PasswordResetRoutes from './passwordResetRoutes.js'
import NotificationRoutes from './notificationRoutes.js';
import CalledAttachmentsRoutes from './calledAttachmentsRoutes.js';
import MessageCalledRoutes from "./MessageCalledRoutes.js";
const router = Router();

// ROTA PÚBLICA (sem autenticação)
router.use('/login', AuthRoutes);

// ROTAS PROTEGIDAS (com autenticação)
router.use('/user', authMiddleware, UserRoutes);
router.use('/costCenters', authMiddleware, CostCenterRoutes);
router.use('/departments', authMiddleware, DepartmentRoutes);
router.use('/categories', authMiddleware, CategoryRoutes);
router.use('/subcategories', authMiddleware, SubCategoryRoutes);
router.use('/called', authMiddleware, CalledOpenRoutes);
router.use('/calledFieldValues', authMiddleware, CalledFiledValueRoutes);
router.use('/calleds', authMiddleware, CalledRoutes);
router.use('/subcategoryFormFields', authMiddleware, SubcategoryFormFieldRoutes);
router.use('/user-categories',authMiddleware, UserCategoryRoutes);
router.use('/password-reset', PasswordResetRoutes);
router.use('/notifications', NotificationRoutes);
router.use('/calledsAttachments', authMiddleware, CalledAttachmentsRoutes);
router.use("/messages-called", authMiddleware, MessageCalledRoutes);

export default router;