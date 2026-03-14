import NotificationRepository from '../repositories/NotificationRepository.js';

const createNotification = async ({ user_id, title, message, type }) => {
    return await NotificationRepository.create({ user_id, title, message, type });
};

const getNotifications = async (user_id) => {
    return await NotificationRepository.findByUserId(user_id);
};

const getUnreadCount = async (user_id) => {
    return await NotificationRepository.countUnread(user_id);
};

const markAllAsRead = async (user_id) => {
    return await NotificationRepository.markAllAsRead(user_id);
};

const markAsRead = async (id) => {
    return await NotificationRepository.markAsRead(id);
};

const deleteOne = async (id) => {
    return await NotificationRepository.deleteOne(id);
};

const deleteAll = async (user_id) => {
    return await NotificationRepository.deleteAllByUserId(user_id);
};

export default { createNotification, getNotifications, getUnreadCount, markAllAsRead, markAsRead, deleteOne, deleteAll };