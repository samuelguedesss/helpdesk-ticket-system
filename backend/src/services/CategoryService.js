import CategoryRepository from '../repositories/CategoryRepository.js';

const createCategoryService = async ({ name, description }) => {
    try {
        if (!name) {
            throw new Error('Nome da Categoria é obrigatório');
        }

        return await CategoryRepository.createCategoryRepo({
            name,
            description
        });
    } catch (error) {

        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("Categoria já existe");
        }
        throw new Error('Erro no service ao criar Categoria: ');
    }

};

const getAllCategoriesService = async () => {
    return await CategoryRepository.getAllCategoriesRepo();
};

const getCategoryByIdService = async (id) => {
    try {
        const category = await CategoryRepository.getCategoryByIdRepo(id);
        
        if (!category) {
            throw new Error('Categoria não encontrada');
        }
        
        return category;
    } catch (error) {
        throw new Error('Erro no service ao buscar Categoria: ' + error.message);
    }
};


const updateCategoryService = async (id, { name, description }) => {
    try {
        if (!name) {
            throw new Error('Nome da Categoria é obrigatório');
        }

        return await CategoryRepository.updateCategoryRepo(id, {
            name,
            description
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("Categoria já existe");
        }
        throw new Error('Erro no service ao atualizar Categoria: ' + error.message);
    }
};

export default {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
};