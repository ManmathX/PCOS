import React, { useState, useEffect } from 'react';
import {
    Bell,
    CheckCheck,
    Trash2,
    Filter,
    Search,
    Calendar,
    Pill,
    Activity,
    FileText,
    TrendingUp,
    Award,
    ClipboardList
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationPreferences } from '../../components/notifications/NotificationPreferences';
import { Link, useNavigate } from 'react-router-dom';

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
    CYCLE_REMINDER: 'text-pink-600 bg-pink-50 border-pink-100',
    MEDICATION_REMINDER: 'text-purple-600 bg-purple-50 border-purple-100',
    SYMPTOM_LOG_REMINDER: 'text-green-600 bg-green-50 border-green-100',
    APPOINTMENT_PREP: 'text-blue-600 bg-blue-50 border-blue-100',
    RISK_UPDATE: 'text-orange-600 bg-orange-50 border-orange-100',
    HEALTH_MILESTONE: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    DAILY_LOG_REMINDER: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    GENERAL: 'text-gray-600 bg-gray-50 border-gray-100',
};

const NotificationItem = ({ notification, onRead, onDelete, onNavigate }) => {
    const Icon = NOTIFICATION_ICONS[notification.type] || FileText;
    const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.GENERAL;
    const time = new Date(notification.createdAt).toLocaleString();

    return (
        <div
            className={`p-4 rounded-xl border mb-3 transition-all hover:shadow-md ${notification.isRead ? 'bg-white border-gray-100' : 'bg-purple-50/10 border-purple-100 shadow-sm'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0" onClick={() => onNavigate(notification)}>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-gray-900 ${!notification.isRead ? 'text-black' : 'text-gray-700'}`}>
                            {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{time}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{notification.message}</p>

                    {notification.actionUrl && (
                        <button
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2 flex items-center"
                        >
                            View Details →
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                        <button
                            onClick={() => onRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Mark as read"
                        >
                            <CheckCheck className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const NotificationsPage = () => {
    const {
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications
    } = useNotifications();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all'); // all, unread, settings
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        fetchNotifications({
            limit: 50,
            unreadOnly: activeTab === 'unread'
        });
    }, [fetchNotifications, activeTab]);

    const handleNavigate = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filterType === 'ALL') return true;
        return n.type === filterType;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        Notifications
                        {activeTab === 'unread' && (
                            <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                                {notifications.filter(n => !n.isRead).length} Unread
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your health journey</p>
                </div>

                <div className="flex items-center gap-2">
                    {activeTab !== 'settings' && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors flex items-center"
                        >
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 space-x-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'all'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    All Notifications
                </button>
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'unread'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Unread Only
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Settings
                </button>
            </div>

            {activeTab === 'settings' ? (
                <NotificationPreferences />
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[
                            { id: 'ALL', label: 'All' },
                            { id: 'CYCLE_REMINDER', label: 'Cycle' },
                            { id: 'MEDICATION_REMINDER', label: 'Meds' },
                            { id: 'SYMPTOM_LOG_REMINDER', label: 'Symptoms' },
                            { id: 'APPOINTMENT_PREP', label: 'Appointments' },
                            { id: 'RISK_UPDATE', label: 'Risk' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setFilterType(filter.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filterType === filter.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-1">
                                    {filterType !== 'ALL'
                                        ? "No notifications match this filter."
                                        : "You're all caught up! Check back later for updates."}
                                </p>
                                {filterType !== 'ALL' && (
                                    <button
                                        onClick={() => setFilterType('ALL')}
                                        className="mt-4 text-purple-600 font-medium hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 group">
                                {filteredNotifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onRead={markAsRead}
                                        onDelete={deleteNotification}
                                        onNavigate={handleNavigate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
