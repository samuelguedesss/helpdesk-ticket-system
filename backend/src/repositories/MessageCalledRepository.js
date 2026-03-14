import db from "../models/index.js";
import { Op } from "sequelize";

const { MessageCalled, User } = db;

const createMessageRepo = async ({ id_called, id_user, message }, transaction) => {
    try {
        return await MessageCalled.create(
            {
                id_called,
                id_user,
                message,
                internal: 0,
                shipping_date: new Date(),
            },
            { transaction }
        );
    } catch (error) {
        throw new Error("Erro ao salvar mensagem: " + error.message);
    }
};

const findByCalledIdRepo = async (id_called) => {
    return await MessageCalled.findAll({
        where: { id_called },
        attributes: ["id", "id_user", "message", "internal", "shipping_date"],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name"],
            },
        ],
        order: [["shipping_date", "ASC"]],
    });
};

const findNewMessagesRepo = async (id_called, lastId) => {
    return await MessageCalled.findAll({
        where: {
            id_called,
            id: { [Op.gt]: lastId },
        },
        attributes: ["id", "id_user", "message", "internal", "shipping_date"],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name"],
            },
        ],
        order: [["shipping_date", "ASC"]],
    });
};

export default {
    createMessageRepo,
    findByCalledIdRepo,
    findNewMessagesRepo,
};