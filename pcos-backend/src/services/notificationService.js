import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Notification Service
 * Handles creation, scheduling, and management of user notifications
 */

class NotificationService {
    /**
     * Create a notification for a user
     */
    async createNotification({ userId, type, title, message, priority = 'MEDIUM', actionUrl, scheduledFor, metadata }) {
        try {
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    priority,
                    actionUrl,
                    scheduledFor,
                    metadata,
                },
            });
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Get user notifications with pagination
     */
    async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false, type = null }) {
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(unreadOnly && { isRead: false }),
            ...(type && { type }),
        };

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where }),
        ]);

        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId) {
        return await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        return await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId, // Ensure user owns the notification
            },
            data: {
                isRead: true,
            },
        });
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId, userId) {
        return await prisma.notification.deleteMany({
            where: {
                id: notificationId,
                userId,
            },
        });
    }

    /**
     * Delete all read notifications older than 30 days
     */
    async cleanupOldNotifications(userId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await prisma.notification.deleteMany({
            where: {
                userId,
                isRead: true,
                createdAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });
    }

    /**
     * Create cycle reminder notification
     */
    async createCycleReminder(userId, predictedDate, cycleDay) {
        const daysUntil = Math.ceil((new Date(predictedDate) - new Date()) / (1000 * 60 * 60 * 24));

        let title, message;
        if (daysUntil <= 3) {
            title = '🩸 Period Starting Soon';
            message = `Your period is predicted to start in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}. Make sure you're prepared!`;
        } else if (daysUntil <= 7) {
            title = '📅 Period Reminder';
            message = `Your next period is expected in about ${daysUntil} days.`;
        } else {
            title = '🔮 Cycle Prediction Updated';
            message = `Your next period is predicted for ${new Date(predictedDate).toLocaleDateString()}.`;
        }

        return await this.createNotification({
            userId,
            type: 'CYCLE_REMINDER',
            title,
            message,
            priority: daysUntil <= 3 ? 'HIGH' : 'MEDIUM',
            actionUrl: '/user/cycle',
            metadata: { predictedDate, cycleDay, daysUntil },
        });
    }

    /**
     * Create medication reminder
     */
    async createMedicationReminder(userId, medicationName, time) {
        return await this.createNotification({
            userId,
            type: 'MEDICATION_REMINDER',
            title: '💊 Medication Reminder',
            message: `Time to take your ${medicationName}`,
            priority: 'HIGH',
            actionUrl: '/user/health',
            metadata: { medicationName, time },
        });
    }

    /**
     * Create daily log reminder
     */
    async createDailyLogReminder(userId) {
        return await this.createNotification({
            userId,
            type: 'DAILY_LOG_REMINDER',
            title: '📝 Daily Check-In',
            message: "Don't forget to log your daily health and mood!",
            priority: 'MEDIUM',
            actionUrl: '/user/daily-log',
        });
    }

    /**
     * Create symptom log reminder
     */
    async createSymptomLogReminder(userId) {
        return await this.createNotification({
            userId,
            type: 'SYMPTOM_LOG_REMINDER',
            title: '🩺 Symptom Tracking',
            message: 'How are you feeling today? Log your symptoms.',
            priority: 'MEDIUM',
            actionUrl: '/user/symptoms',
        });
    }

    /**
     * Create appointment prep notification
     */
    async createAppointmentPrepNotification(userId, appointmentDate, daysAdvance) {
        return await this.createNotification({
            userId,
            type: 'APPOINTMENT_PREP',
            title: '🏥 Appointment Preparation',
            message: `Your appointment is in ${daysAdvance} days. Prepare your health summary now!`,
            priority: 'HIGH',
            actionUrl: '/user/appointment',
            metadata: { appointmentDate, daysAdvance },
        });
    }

    /**
     * Create risk update notification
     */
    async createRiskUpdateNotification(userId, oldRiskLevel, newRiskLevel, score) {
        const isIncrease = ['LOW', 'MODERATE', 'HIGH'].indexOf(newRiskLevel) > ['LOW', 'MODERATE', 'HIGH'].indexOf(oldRiskLevel);

        return await this.createNotification({
            userId,
            type: 'RISK_UPDATE',
            title: isIncrease ? '⚠️ Risk Level Changed' : '✅ Risk Level Improved',
            message: `Your PCOS risk has ${isIncrease ? 'increased' : 'decreased'} from ${oldRiskLevel} to ${newRiskLevel}. View details for more information.`,
            priority: isIncrease ? 'HIGH' : 'MEDIUM',
            actionUrl: '/user/risk',
            metadata: { oldRiskLevel, newRiskLevel, score },
        });
    }

    /**
     * Create health milestone notification
     */
    async createMilestoneNotification(userId, milestone, description) {
        return await this.createNotification({
            userId,
            type: 'HEALTH_MILESTONE',
            title: `🎉 ${milestone}`,
            message: description,
            priority: 'LOW',
            metadata: { milestone },
        });
    }

    /**
     * Get or create user notification preferences
     */
    async getUserPreferences(userId) {
        let preferences = await prisma.notificationPreferences.findUnique({
            where: { userId },
        });

        if (!preferences) {
            preferences = await prisma.notificationPreferences.create({
                data: { userId },
            });
        }

        return preferences;
    }

    /**
     * Update user notification preferences
     */
    async updateUserPreferences(userId, updates) {
        return await prisma.notificationPreferences.upsert({
            where: { userId },
            update: updates,
            create: {
                userId,
                ...updates,
            },
        });
    }

    /**
     * Check if notification should be sent based on user preferences
     */
    async shouldSendNotification(userId, type) {
        const preferences = await this.getUserPreferences(userId);

        // Check if notification type is enabled
        const typeMapping = {
            CYCLE_REMINDER: 'enableCycleReminders',
            MEDICATION_REMINDER: 'enableMedicationReminders',
            SYMPTOM_LOG_REMINDER: 'enableSymptomReminders',
            APPOINTMENT_PREP: 'enableAppointmentReminders',
            HEALTH_MILESTONE: 'enableMilestones',
            RISK_UPDATE: 'enableRiskUpdates',
            DAILY_LOG_REMINDER: 'enableDailyLogReminders',
        };

        if (!preferences[typeMapping[type]]) {
            return false;
        }

        // Check quiet hours
        if (preferences.quietHoursEnabled && preferences.quietHoursStart && preferences.quietHoursEnd) {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            if (currentTime >= preferences.quietHoursStart || currentTime <= preferences.quietHoursEnd) {
                return false;
            }
        }

        return true;
    }
}

export default new NotificationService();
