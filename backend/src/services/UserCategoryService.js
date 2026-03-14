import UserCategoryRepository from '../repositories/UserCategoryRepository.js';

const getCategoriesByUserService = async (id_user) => {
    try {
        const result = await UserCategoryRepository.getCategoriesByUserRepo(id_user);
        return result.map(r => r.id_category);
    } catch (error) {
        console.error('Erro no service: ', error);
        throw error;
    }
};

const saveCategoriasService = async (id_user, categorias) => {
    try {
        if (!Array.isArray(categorias)) {
            const err = new Error('Formato inválido');
            err.status = 400;
            throw err;
        }
        await UserCategoryRepository.saveCategoriesRepo(id_user, categorias);
        return { message: 'Categorias salvas com sucesso' };
    } catch (error) {
        console.error('Erro no service: ', error);
        throw error;
    }
};

export default { getCategoriesByUserService, saveCategoriasService };