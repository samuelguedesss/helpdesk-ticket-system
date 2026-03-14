import db from '../models/index.js';

const { UserCategory } = db;

const getCategoriesByUserRepo = async (id_user) => {
    try {
        return await UserCategory.findAll({ where: { id_user } });
    } catch (error) {
        throw new Error(`Erro no repository: ${error.message}`);
    }
};

const saveCategoriesRepo = async (id_user, categorias) => {
    try {
        await UserCategory.destroy({ where: { id_user } });
        const registros = categorias.map(id_category => ({ id_user, id_category }));
        return await UserCategory.bulkCreate(registros);
    } catch (error) {
        throw new Error(`Erro no repository: ${error.message}`);
    }
};

export default { getCategoriesByUserRepo, saveCategoriesRepo };