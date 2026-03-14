import NotificationService from '../services/NotificationService.js';

const getNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const notifications = await NotificationService.getNotifications(user_id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const user_id = req.user.id;
        const count = await NotificationService.getUnreadCount(user_id);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const user_id = req.user.id;
        await NotificationService.markAllAsRead(user_id);
        res.status(200).json({ message: 'Todas as notificações marcadas como lidas.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await NotificationService.markAsRead(id);
        res.status(200).json({ message: 'Notificação marcada como lida.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOne = async (req, res) => {
    try {
        await NotificationService.deleteOne(req.params.id);
        res.status(200).json({ message: 'Notificação removida.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAll = async (req, res) => {
    try {
        await NotificationService.deleteAll(req.user.id);
        res.status(200).json({ message: 'Todas as notificações removidas.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { getNotifications, getUnreadCount, markAllAsRead, markAsRead, deleteOne, deleteAll};