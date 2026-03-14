import { Router } from 'express';
import DepartmentController from '../controllers/DepartmentController.js';

const router = Router();

router.get('/:id_corporation', DepartmentController.getDepartmentById)
router.get('/', DepartmentController.getDepartments)

export default router;