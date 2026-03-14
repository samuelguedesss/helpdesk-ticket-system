import db from "../models/index.js";

const { CalledFieldValue, SubcategoryFormField } = db;

const createCalledFieldValueRepo = async (
    { id_called, id_field, value },
    transaction
) => {
    try {
        return await CalledFieldValue.create( // salvar valor do campo do chamado
            {
                id_called,
                id_field,
                value,
            },
            { transaction }
        );
    } catch (error) {
        throw new Error(
            "Erro ao salvar campo do chamado: " + error.message
        );
    }
};

const existsByCalledRepo = async (id_called) => { // verificar se já existe um campo salvo para o chamado
    return await CalledFieldValue.findOne({
        where: { id_called },
    });
};

const findByCalledIdWithFieldsRepo = async (id_called) => {
   return await CalledFieldValue.findAll({
    where: { id_called },
    attributes: ['value'],
    include: [
      {
        model: SubcategoryFormField,
        as: 'field',
        attributes: ['label', 'type', 'order_index']
      }
    ],
    order: [[{ model: SubcategoryFormField, as: 'field' }, 'order_index', 'ASC']]
  });
};

export default {
    createCalledFieldValueRepo,
    existsByCalledRepo,
    findByCalledIdWithFieldsRepo,
};
