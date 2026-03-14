import db from "../models/index.js";
import MessageCalledRepository from "../repositories/MessageCalledRepository.js";
import CalledRepository from "../repositories/CalledRepository.js";
import NotificationRepository from "../repositories/NotificationRepository.js";

const sendMessageService = async (id_called, id_user, message) => {
    const transaction = await db.sequelize.transaction();
    try {
        const called = await CalledRepository.findByIdWithDetailsRepo(id_called);
        if (!called) throw new Error("Chamado não encontrado");

        const isResponsible = called.id_responsible === id_user;
        const isRequester = called.id_user === id_user;

        if (!isResponsible && !isRequester) {
            throw new Error("Você não tem permissão para enviar mensagens neste chamado");
        }

        if (called.status === "finalizado") {
            throw new Error("Não é possível enviar mensagens em um chamado finalizado");
        }

        const newMessage = await MessageCalledRepository.createMessageRepo(
            { id_called, id_user, message },
            transaction
        );

        // Notifica o outro lado
        const notifyUserId = isResponsible ? called.id_user : called.id_responsible;

        if (notifyUserId) {
            await NotificationRepository.create({
                user_id: notifyUserId,
                title: `Chamado #${id_called}`,
                message: `Nova mensagem no chamado #${id_called}`,
                type: "new_called",
            });
        }

        await transaction.commit();
        return newMessage;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error.message);
    }
};

const getMessagesService = async (id_called, id_user) => {
    const called = await CalledRepository.findByIdWithDetailsRepo(id_called);
    if (!called) throw new Error("Chamado não encontrado");

    const isResponsible = called.id_responsible === id_user;
    const isRequester = called.id_user === id_user;
    const isAdmin = false; // admin é tratado no controller via req.user.role

    if (!isResponsible && !isRequester && !isAdmin) {
        throw new Error("Você não tem permissão para visualizar mensagens deste chamado");
    }

    return await MessageCalledRepository.findByCalledIdRepo(id_called);
};

const pollNewMessagesService = async (id_called, id_user, lastId) => {
    const called = await CalledRepository.findByIdWithDetailsRepo(id_called);
    if (!called) throw new Error("Chamado não encontrado");

    const isResponsible = called.id_responsible === id_user;
    const isRequester = called.id_user === id_user;

    if (!isResponsible && !isRequester) {
        throw new Error("Você não tem permissão para visualizar mensagens deste chamado");
    }

    return await MessageCalledRepository.findNewMessagesRepo(id_called, lastId);
};

export default {
    sendMessageService,
    getMessagesService,
    pollNewMessagesService,
};