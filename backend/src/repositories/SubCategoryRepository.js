import db from '../models/index.js';

const { Subcategory, SubcategoryFormField } = db;

const createSubCategoryRepo = async ({ id_category, name, description }) => {
    try {
        const subCategory = await Subcategory.create({
            name,
            id_category,
            description
        });

        return subCategory;

    } catch (error) {
        throw error;
    }
};

const getSubCategoriesByCategoryIdRepo = async (id_category) => {
    try {
        const subcategories = await Subcategory.findAll({
            where: { id_category },
            attributes: ['id', 'name', 'description', 'id_category', 'ativo'],
        });
        return subcategories

    } catch (error) {
        throw new Error('Erro no repository ao listar SubCategorias por Categoria: ' + error.message);
    }
};

// BUSCAR UMA SUBCATEGORIA COM CAMPOS DINÂMICOS
const getSubcategoryByIdRepo = async (id) => {
    try {
        const subcategory = await Subcategory.findByPk(id, {
            attributes: ['id', 'name', 'description', 'id_category', 'ativo'],
            include: [
                {
                    model: SubcategoryFormField,
                    as: 'formFields', // Usar o alias definido no Model
                    attributes: ['id', 'label', 'placeholder', 'type', 'required', 'order_index'],
                    order: [['order_index', 'ASC']], // ⬅ Ordenar pelos campos
                }
            ]
        });

        if (!subcategory) {
            throw new Error('Subcategoria não encontrada');
        }

        return subcategory;

    } catch (error) {
        throw error;
    }
};

const updateSubCategoryRepo = async (id, { ativo }) => {
    try {
        const subcategory = await Subcategory.findByPk(id);

        if (!subcategory) {
            throw new Error('Subcategoria não encontrada');
        }

        await subcategory.update({ ativo });

        return subcategory;
    } catch (error) {
        throw error;
    }
};

//ATUALIZAR SUBCATEGORIA COMPLETA (nome, descrição, campos)
const updateSubcategoryCompleteRepo = async (id, { name, description, ativo }) => {
    try {
        const subcategory = await Subcategory.findByPk(id);

        if (!subcategory) {
            throw new Error('Subcategoria não encontrada');
        }

        // Atualizar os campos básicos
        await subcategory.update({
            name: name !== undefined ? name : subcategory.name,
            description: description !== undefined ? description : subcategory.description,
            ativo: ativo !== undefined ? ativo : subcategory.ativo,
        });

        return subcategory;
    } catch (error) {
        throw error;
    }
};

export default {
    createSubCategoryRepo,
    getSubCategoriesByCategoryIdRepo,
    getSubcategoryByIdRepo, 
    updateSubCategoryRepo,
    updateSubcategoryCompleteRepo, 
};