import db from "../models/index.js";

const { CalledAttachments } = db;

const createCalledAttachmentRepo = async (
    { id_called, filename, path },
    transaction
) => {
    try {
        return await CalledAttachments.create(
            { id_called, filename, path },
            { transaction }
        );
    } catch (error) {
        throw new Error("Erro ao salvar anexo do chamado: " + error.message);
    }
};

const findByCalledIdRepo = async (id_called) => {
    return await CalledAttachments.findAll({
        where: { id_called },
        attributes: ['id', 'filename', 'path', 'data_upload'],
        order: [['data_upload', 'ASC']],
    });
};

const findByIdRepo = async (id) => {
    return await CalledAttachments.findOne({
        where: { id },
        attributes: ['id', 'id_called', 'filename', 'path'],
    });
};

const deleteByIdRepo = async (id, transaction) => {
    return await CalledAttachments.destroy({
        where: { id },
        transaction,
    });
};

export default {
    createCalledAttachmentRepo,
    findByCalledIdRepo,
    findByIdRepo,
    deleteByIdRepo,
};