import db from '../models/index.js';

const { Category} = db;

const createCategoryRepo = async  ({ name, description }) => {
    try{
        const category = await Category.create({
            name,
            description
        });
        return category;
    } catch (error) {
        throw error;
    } 
};

const getAllCategoriesRepo = async () => {
    try {
        const categories = await Category.findAll({
            atributes: ['id', 'name', 'description'],
        });

        return categories;
    } catch (error) {
        throw new Error('Erro no repository ao listar Categorias: ' + error.message);
    }
};

const getCategoryByIdRepo = async (id) => {
    try {
        const category = await Category.findByPk(id);
        return category;
    } catch (error) {
        throw new Error('Erro no repository ao buscar Categoria por ID: ' + error.message);
    }
};

const updateCategoryRepo = async (id, { name, description }) => {
    try {
        const category = await Category.findByPk(id);
        
        if (!category) {
            throw new Error('Categoria não encontrada');
        }

        await category.update({
            name,
            description
        });

        return category;
    } catch (error) {
        throw error;
    }
};


export default {
    createCategoryRepo,
    getAllCategoriesRepo,
    getCategoryByIdRepo,
    updateCategoryRepo,
};