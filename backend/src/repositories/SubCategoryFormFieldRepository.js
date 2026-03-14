import db from "../models/index.js";

const { SubcategoryFormField } = db;

const getFormFieldsBySubcategoryRepo = async (id_subcategory) => {
    try {
        const fields = await SubcategoryFormField.findAll({
            where: { id_subcategory },
            attributes: [
                "id",
                "label",
                "type",
                "required",
                "order_index",
                "placeholder",

            ],
            order: [["order_index", "ASC"]],
        });

        return fields;

    } catch (error) {
        throw new Error(
            `Erro no repository ao listar os campos do formulário: ${error.message}`
        );
    }
};

const createFormFieldsRepo = async (formFields) => {
    try {
        const createdFields = await SubcategoryFormField.bulkCreate(formFields);
        return createdFields;
    } catch (error) {
        throw new Error(
            `Erro no repository ao criar campos do formulário: ${error.message}`
        );
    }
};

const deleteFormFieldsBySubcategoryRepo = async (id_subcategory) => {
    try {
        const deletedCount = await SubcategoryFormField.destroy({
            where: { id_subcategory }
        });

        return deletedCount;
        
    } catch (error) {
        throw new Error(
            `Erro no repository ao deletar campos do formulário: ${error.message}`
        );
    }
};

export default {
    getFormFieldsBySubcategoryRepo,
    createFormFieldsRepo,
    deleteFormFieldsBySubcategoryRepo,
};

