import { Router } from 'express';
import SubCategoryController from '../controllers/SubCategoryController.js';
import SubcategoryFormFieldController from '../controllers/SubCategoryFormFieldController.js';

const router = Router();

router.post('/', SubCategoryController.createSubCategory);
router.get('/', SubCategoryController.getSubCategoriesByCategory);
router.get("/by-category/:categoryId", SubCategoryController.getSubCategoriesByCategory);
router.get('/:id/form-fields', SubcategoryFormFieldController.getFormFieldsBySubcategory);
router.get('/:id', SubCategoryController.getSubcategoryById); 
router.put('/:id', SubCategoryController.updateSubcategoryComplete); 
router.patch('/:id/status', SubCategoryController.updateSubCategory);


export default router;