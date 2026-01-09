import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Pill, Activity, FileText, TrendingUp, Award, ClipboardList } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const NOTIFICATION_ICONS = {
    CYCLE_REMINDER: Calendar,
    MEDICATION_REMINDER: Pill,
    SYMPTOM_LOG_REMINDER: Activity,
    APPOINTMENT_PREP: FileText,
    RISK_UPDATE: TrendingUp,
    HEALTH_MILESTONE: Award,
    DAILY_LOG_REMINDER: ClipboardList,
    GENERAL: FileText,
};

const NOTIFICATION_COLORS = {
    CYCLE_REMINDER: 'text-pink-600 bg-pink-50',
    MEDICATION_REMINDER: 'text-purple-600 bg-purple-50',
    SYMPTOM_LOG_REMINDER: 'text-green-600 bg-green-50',
    APPOINTMENT_PREP: 'text-blue-600 bg-blue-50',
    RISK_UPDATE: 'text-orange-600 bg-orange-50',
    HEALTH_MILESTONE: 'text-yellow-600 bg-yellow-50',
    DAILY_LOG_REMINDER: 'text-indigo-600 bg-indigo-50',
    GENERAL: 'text-gray-600 bg-gray-50',
};

export const NotificationPanel = ({ onClose }) => {
    const navigate = useNavigate();
    const { notifications, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications({ limit: 10 });
    }, [fetchNotifications]);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            onClose();
        }
    };

    const groupNotificationsByDate = (notifications) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups = {
            today: [],
            yesterday: [],
            earlier: [],
        };

        notifications.forEach(notification => {
            const notifDate = new Date(notification.createdAt);
            notifDate.setHours(0, 0, 0, 0);

            if (notifDate.getTime() === today.getTime()) {
                groups.today.push(notification);
            } else if (notifDate.getTime() === yesterday.getTime()) {
                groups.yesterday.push(notification);
            } else {
                groups.earlier.push(notification);
            }
        });

        return groups;
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

    const renderNotificationGroup = (title, notifications) => {
        if (notifications.length === 0) return null;

        return (
            <div key={title} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">{title}</h4>
                {notifications.map(notification => {
                    const Icon = NOTIFICATION_ICONS[notification.type] || FileText;
                    const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.GENERAL;
                    const time = new Date(notification.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                    });

                    return (
                        <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${notification.isRead ? 'border-transparent' : 'border-purple-500 bg-purple-50/30'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{time}</p>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Bell className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-center">No notifications yet</p>
                        <p className="text-gray-400 text-sm text-center mt-1">
                            We'll notify you about important updates
                        </p>
                    </div>
                ) : (
                    <div className="py-2">
                        {renderNotificationGroup('Today', groupedNotifications.today)}
                        {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
                        {renderNotificationGroup('Earlier', groupedNotifications.earlier)}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={() => {
                            navigate('/user/notifications');
                            onClose();
                        }}
                        className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                        View All Notifications
                    </button>
                </div>
            )}
        </div>
    );
};
