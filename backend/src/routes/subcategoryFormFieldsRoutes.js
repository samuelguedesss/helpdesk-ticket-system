import {Router} from 'express';
import SubcategoryFormFieldController from '../controllers/SubCategoryFormFieldController.js';

const router = Router();

router.post('/', SubcategoryFormFieldController.getFormFieldsBySubcategory);

export default router;