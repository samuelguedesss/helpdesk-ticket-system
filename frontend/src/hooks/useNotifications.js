import { useState, useEffect, useCallback } from 'react';
import apiBackend from '../services/apiBackend';

export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await apiBackend.get('/notifications');
            setNotifications(data);
        } catch (err) {
            console.error('Erro ao buscar notificações:', err.message);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const { data } = await apiBackend.get('/notifications/unread-count');
            setUnreadCount(data.count);
        } catch (err) {
            console.error('Erro ao buscar contagem:', err.message);
        }
    }, []);

    const markAllAsRead = async () => {
        try {
            await apiBackend.patch('/notifications/mark-all-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
        } catch (err) {
            console.error('Erro ao marcar como lidas:', err.message);
        }
    };

    const markAsRead = async (id) => {
        try {
            await apiBackend.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Erro ao marcar notificação como lida:', err.message);
        }
    };

    const deleteOne = async (id) => {
        try {
            await apiBackend.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => {
                const wasUnread = notifications.find(n => n.id === id)?.read === 0;
                return wasUnread ? Math.max(0, prev - 1) : prev;
            });
        } catch (err) {
            console.error('Erro ao deletar notificação:', err.message);
        }
    };

    const deleteAll = async () => {
        try {
            await apiBackend.delete('/notifications');
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error('Erro ao deletar todas as notificações:', err.message);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();

        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications, fetchUnreadCount]);

    return { notifications, unreadCount, markAllAsRead, markAsRead, deleteOne, deleteAll };
}