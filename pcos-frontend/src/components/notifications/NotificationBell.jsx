import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationPanel } from './NotificationPanel';

export const NotificationBell = () => {
    const { unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                bellRef.current &&
                !bellRef.current.contains(event.target) &&
                panelRef.current &&
                !panelRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell className={`w-6 h-6 text-gray-700 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div ref={panelRef}>
                    <NotificationPanel onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
};
