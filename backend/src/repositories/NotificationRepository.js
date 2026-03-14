import db from '../models/index.js';

const { Notification } = db;

const create = async ({ user_id, title, message, type }) => {
    return await Notification.create({ user_id, title, message, type, read: 0 });
};

const findByUserId = async (user_id) => {
    return await Notification.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']],
        limit: 20,
    });
};

const countUnread = async (user_id) => {
    return await Notification.count({ where: { user_id, read: 0 } });
};

const markAllAsRead = async (user_id) => {
    return await Notification.update({ read: 1 }, { where: { user_id } });
};

const markAsRead = async (id) => {
    return await Notification.update({ read: 1 }, { where: { id } });
};

const deleteOne = async (id) => {
    return await Notification.destroy({ where: { id } });
};

const deleteAllByUserId = async (user_id) => {
    return await Notification.destroy({ where: { user_id } });
};

export default { create, findByUserId, countUnread, markAllAsRead, markAsRead, deleteOne, deleteAllByUserId };