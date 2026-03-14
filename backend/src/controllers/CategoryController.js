import categoryService from '../services/CategoryService.js';

const createCategory = async (req, res) => {
    try {
        // console.log("REQ.BODY RECEBIDO:", req.body);
        // console.log("TIPO DESCRIPTION:", typeof req.body.description);
        const category = await categoryService.createCategoryService(req.body);
        return res.status(201).json(category);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategoriesService();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryByIdService(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        
        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.updateCategoryService(id, req.body);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
};