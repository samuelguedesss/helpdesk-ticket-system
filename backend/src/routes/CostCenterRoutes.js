import { Router } from 'express';
import  CostCenterController  from '../controllers/CostCenterController.js';


const router = Router();

router.get('/', CostCenterController.getAllCostCenters);

export default router;