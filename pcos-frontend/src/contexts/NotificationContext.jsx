import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState(null);

    // Fetch notifications
    const fetchNotifications = useCallback(async (options = {}) => {
        if (!user) return;

        try {
            setLoading(true);
            const { page = 1, limit = 20, unreadOnly = false, type = null } = options;

            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(unreadOnly && { unreadOnly: 'true' }),
                ...(type && { type }),
            });

            const response = await axios.get(`${API_URL}/notifications?${params}`);
            setNotifications(response.data.notifications);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return { notifications: [], pagination: {} };
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const response = await axios.get(`${API_URL}/notifications/unread-count`);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [user]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await axios.post(`${API_URL}/notifications/mark-read/${notificationId}`);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await axios.post(`${API_URL}/notifications/mark-all-read`);

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await axios.delete(`${API_URL}/notifications/${notificationId}`);

            // Update local state
            const notification = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }, [notifications]);

    // Fetch preferences
    const fetchPreferences = useCallback(async () => {
        if (!user) return;

        try {
            const response = await axios.get(`${API_URL}/notifications/preferences`);
            setPreferences(response.data);
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    }, [user]);

    // Update preferences
    const updatePreferences = useCallback(async (updates) => {
        try {
            const response = await axios.put(`${API_URL}/notifications/preferences`, updates);
            setPreferences(response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }, []);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!user) return;

        fetchNotifications({ limit: 10 });
        fetchUnreadCount();
        fetchPreferences();

        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user, fetchNotifications, fetchUnreadCount, fetchPreferences]);

    const value = {
        notifications,
        unreadCount,
        loading,
        preferences,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchPreferences,
        updatePreferences,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
