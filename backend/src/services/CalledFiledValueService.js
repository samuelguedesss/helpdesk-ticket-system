import CalledFieldValueRepository from "../repositories/CalledFiledValueRepository.js";
import db from '../models/index.js';

const createCalledFieldValueService = async ({
    id_called,
    fields,
    id_user,
}) => {

    if (!id_called) {
        throw new Error("Chamado não informado");
    }

    if (!fields || !Array.isArray(fields)) {
        throw new Error("Campos inválidos");
    }

    const alreadyExists = await CalledFieldValueRepository.existsByCalledRepo(id_called);

    if (alreadyExists) {
        throw new Error("Os campos deste chamado já foram preenchidos");
    }


    const transaction = await db.sequelize.transaction();

    try {

        for (const field of fields) {

            if (!field.id_field) {
                throw new Error("Campo inválido");
            }

            await CalledFieldValueRepository.createCalledFieldValueRepo(
                {
                    id_called,
                    id_field: field.id_field,
                    value: field.value,
                },
                transaction
            );
        }

        await transaction.commit();

        return {
            message: "Valores dos campos salvos com sucesso",
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export default {
    createCalledFieldValueService,
};
