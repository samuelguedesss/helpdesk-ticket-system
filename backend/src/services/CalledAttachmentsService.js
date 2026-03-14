import db from "../models/index.js";
import s3 from "../storage/s3Storage.js";
import CalledAttachmentsRepository from "../repositories/CalledAttachmentsRepository.js";
import CalledRepository from "../repositories/CalledRepository.js";

const uploadCalledAttachmentService = async (id_called, file) => {
    const transaction = await db.sequelize.transaction();
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id_called);
        if (!called) throw new Error("Chamado não encontrado");

        const categoryName = called.category?.name;
        if (!categoryName) throw new Error("Categoria do chamado não encontrada");

        const categoryFolder = s3.normalizeFolderName(categoryName);
        const ext = file.originalname.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const key = `called-attachments/${categoryFolder}/${uniqueName}`;

        const fullKey = await s3.uploadBuffer({
            buffer: file.buffer,
            key,
            contentType: file.mimetype,
        });

        const attachment = await CalledAttachmentsRepository.createCalledAttachmentRepo(
            { id_called, filename: file.originalname, path: fullKey },
            transaction
        );

        await transaction.commit();
        return attachment;
    } catch (error) {
        await transaction.rollback();
        throw new Error("Erro ao fazer upload do anexo: " + error.message);
    }
};

const getCalledAttachmentsService = async (id_called) => {
    const attachments = await CalledAttachmentsRepository.findByCalledIdRepo(id_called);

    const result = await Promise.all(
        attachments.map(async (att) => ({
            id: att.id,
            filename: att.filename,
            data_upload: att.data_upload,
            url: await s3.getPresignedUrl({ key: att.path }),
        }))
    );

    return result;
};

const deleteCalledAttachmentService = async (id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const attachment = await CalledAttachmentsRepository.findByIdRepo(id);
        if (!attachment) throw new Error("Anexo não encontrado");

        await s3.deleteFile(attachment.path);
        await CalledAttachmentsRepository.deleteByIdRepo(id, transaction);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new Error("Erro ao deletar anexo: " + error.message);
    }
};

export default {
    uploadCalledAttachmentService,
    getCalledAttachmentsService,
    deleteCalledAttachmentService,
};