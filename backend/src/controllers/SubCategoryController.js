import subCategoryService from '../services/SubCategoryService.js';

const createSubCategory = async (req, res) => {
    try {
        const subCategory = await subCategoryService.createSubCategoryService(req.body);
        return res.status(201).json(subCategory);

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

const getSubCategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({
                mensagem: 'id_category é obrigatório'
            });
        }

        const subCategories =
            await subCategoryService.getSubCategoriesByCategoryIdService(
                Number(categoryId)
            );

        return res.status(200).json(subCategories);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

//BUSCAR UMA SUBCATEGORIA POR ID (COM CAMPOS DINÂMICOS)
const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID da subcategoria é obrigatório'
            });
        }

        const subcategory = await subCategoryService.getSubcategoryByIdService(
            Number(id)
        );

        return res.status(200).json(subcategory);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

//ATUALIZAR APENAS STATUS (ativo/inativo)
const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID da subcategoria é obrigatório'
            });
        }

        const subcategory = await subCategoryService.updateSubCategoryService(
            Number(id),
            { ativo }
        );

        return res.status(200).json({
            mensagem: 'Subcategoria atualizada com sucesso',
            subcategoria: subcategory
        });

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

//ATUALIZAR SUBCATEGORIA COMPLETA (nome, descrição, campos)
const updateSubcategoryComplete = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, formFields } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID da subcategoria é obrigatório'
            });
        }

        const subcategory = await subCategoryService.updateSubcategoryCompleteService(
            Number(id),
            { name, description, formFields }
        );

        return res.status(200).json({
            mensagem: 'Subcategoria atualizada com sucesso',
            subcategoria: subcategory
        });

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

export default {
    createSubCategory,
    getSubCategoriesByCategory,
    getSubcategoryById, 
    updateSubCategory,
    updateSubcategoryComplete, 
};