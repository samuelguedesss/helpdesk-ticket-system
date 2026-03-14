import subCategoryRepository from '../repositories/SubCategoryRepository.js';
import categoryRepository from '../repositories/CategoryRepository.js';
import SubcategoryFormFieldService from './SubCategoryFormFieldService.js';

const createSubCategoryService = async ({ id_category, name, description, formFields }) => {
    try {
        if (!name || !id_category) {
            throw new Error('Nome e ID da Categoria são obrigatórios para criar uma SubCategoria');
        }

        const categoryExists = await categoryRepository.getCategoryByIdRepo(id_category);
        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        // CRIAR SUBCATEGORIA
        const subCategory = await subCategoryRepository.createSubCategoryRepo({
            id_category,
            name,
            description
        });

        // SE TEM CAMPOS DO FORMULÁRIO, CRIAR TAMBÉM
        if (formFields && formFields.length > 0) {
            await SubcategoryFormFieldService.createFormFieldsSrv(
                subCategory.id,
                formFields
            );
        }

        return subCategory;

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("SubCategoria já existe");
        }

        throw error;
    }
};

const getSubCategoriesByCategoryIdService = async (id_category) => {
    return await subCategoryRepository.getSubCategoriesByCategoryIdRepo(id_category);
};

//BUSCAR UMA SUBCATEGORIA POR ID
const getSubcategoryByIdService = async (id) => {
    try {
        const subcategory = await subCategoryRepository.getSubcategoryByIdRepo(id);
        return subcategory;
    } catch (error) {
        throw error;
    }
};

//ATUALIZAR APENAS STATUS (ativo/inativo)
const updateSubCategoryService = async (id, { ativo }) => {
    try {
        if (ativo === undefined || ativo === null) {
            throw new Error('O campo "ativo" é obrigatório');
        }

        if (ativo !== 0 && ativo !== 1) {
            throw new Error('O campo "ativo" deve ser 0 (inativo) ou 1 (ativo)');
        }

        const subcategory = await subCategoryRepository.updateSubCategoryRepo(id, { ativo });

        return subcategory;

    } catch (error) {
        throw error;
    }
};

//ATUALIZAR SUBCATEGORIA COMPLETA (nome, descrição, campos dinâmicos)
const updateSubcategoryCompleteService = async (id, { name, description, formFields }) => {
    try {
        // Validar se subcategoria existe
        const subcategoryExists = await subCategoryRepository.getSubcategoryByIdRepo(id);
        if (!subcategoryExists) {
            throw new Error('Subcategoria não encontrada');
        }

        // Atualizar informações básicas (nome e descrição)
        if (name || description !== undefined) {
            await subCategoryRepository.updateSubcategoryCompleteRepo(id, {
                name,
                description,
            });
        }

        // Atualizar campos dinâmicos (se fornecidos)
        if (formFields && formFields.length > 0) {
            // Deletar campos antigos e criar novos
            await SubcategoryFormFieldService.deleteFormFieldsBySubcategoryId(id);
            await SubcategoryFormFieldService.createFormFieldsSrv(id, formFields);
        }

        // Buscar subcategoria atualizada com os novos campos
        const updatedSubcategory = await subCategoryRepository.getSubcategoryByIdRepo(id);

        return updatedSubcategory;

    } catch (error) {
        throw error;
    }
};

export default {
    createSubCategoryService,
    getSubCategoriesByCategoryIdService,
    getSubcategoryByIdService, 
    updateSubCategoryService,
    updateSubcategoryCompleteService, 
};