import UserCategoryService from '../services/UserCategoryService.js';

const getCategoriesByUser = async (req, res) => {
    try {
        const { id_user } = req.params;
        const result = await UserCategoryService.getCategoriesByUserService(id_user);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro no controller:', error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Erro interno.' });
    }
};

const saveCategories = async (req, res) => {
    try {
        const { id_user } = req.params;
        const { categorias } = req.body;
        const result = await UserCategoryService.saveCategoriasService(id_user, categorias);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro no controller:', error);
        if (error.status) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Erro interno.' });
    }
};

export default { getCategoriesByUser, saveCategories };