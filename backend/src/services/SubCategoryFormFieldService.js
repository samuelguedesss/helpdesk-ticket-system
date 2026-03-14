import SubcategoryFormFieldRepository from '../repositories/SubCategoryFormFieldRepository.js';

const getFormFieldsBySubcategorySrv = async (id_subcategory) => {
    try {
        return await SubcategoryFormFieldRepository.getFormFieldsBySubcategoryRepo(
            id_subcategory
        );
    } catch (error) {
        console.error(
            'Erro no service em recuperar os campos do formulário da subcategoria: ',
            error
        );
        throw error;
    }
};

const createFormFieldsSrv = async (id_subcategory, formFields) => {
    try {
        // Adiciona o id_subcategory e order_index em cada campo
        const fieldsWithSubcategory = formFields.map((field, index) => ({
            id_subcategory,
            label: field.label,
            type: field.type,
            required: field.required || false,
            placeholder: field.placeholder || null,
            order_index: field.order_index || index,
        }));

        return await SubcategoryFormFieldRepository.createFormFieldsRepo(
            fieldsWithSubcategory
        );
    } catch (error) {
        console.error('Erro no service ao criar campos do formulário: ', error);
        throw error;
    }
};

const deleteFormFieldsBySubcategoryId = async (id_subcategory) => {
    try {
        return await SubcategoryFormFieldRepository.deleteFormFieldsBySubcategoryRepo(
            id_subcategory
        );
    } catch (error) {
        console.error('Erro no service ao deletar campos do formulário: ', error);
        throw error;
    }
};

export default {
    getFormFieldsBySubcategorySrv,
    createFormFieldsSrv,
    deleteFormFieldsBySubcategoryId,
};
