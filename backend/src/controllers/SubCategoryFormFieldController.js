import SubcategoryFormFieldService from '../services/SubCategoryFormFieldService.js';

const getFormFieldsBySubcategory = async (req, res) => {
    const { id } = req.params;

    try {
        const fields = await SubcategoryFormFieldService.getFormFieldsBySubcategorySrv(id);
        res.json(fields).status(200);
    } catch (error) {
        console.error('Erro no controller ao recuperar os campos do formulário: ', error);
        res.status(500).json({
            message: error.message || 'Erro ao recuperar os campos do formulário'
        });
    }
};

export default {
    getFormFieldsBySubcategory,
};