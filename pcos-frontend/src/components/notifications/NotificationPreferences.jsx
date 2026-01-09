import React, { useState, useEffect } from 'react';
import { Save, Bell, Moon, Clock, Calendar } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

export const NotificationPreferences = () => {
    const { preferences, updatePreferences } = useNotifications();
    const [formData, setFormData] = useState({
        enableCycleReminders: true,
        enableMedicationReminders: true,
        enableSymptomReminders: true,
        enableAppointmentReminders: true,
        enableMilestones: true,
        enableRiskUpdates: true,
        enableDailyLogReminders: true,
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        symptomLogReminderTime: '20:00',
        dailyLogReminderTime: '21:00',
        appointmentAdvanceNotice: 3,
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (preferences) {
            setFormData(prev => ({
                ...prev,
                ...preferences
            }));
        }
    }, [preferences]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await updatePreferences(formData);
            setMessage({ type: 'success', text: 'Preferences saved successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save preferences' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const Toggle = ({ name, label, description }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
                <label htmlFor={name} className="font-medium text-gray-800 cursor-pointer">
                    {label}
                </label>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    checked={formData[name]}
                    onChange={handleChange}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-purple-600" />
                    Notification Settings
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Customize how and when you want to be notified
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Notification Types */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Notification Types
                    </h3>
                    <div className="space-y-1">
                        <Toggle
                            name="enableCycleReminders"
                            label="Cycle Reminders"
                            description="Get notified about upcoming periods and ovulation"
                        />
                        <Toggle
                            name="enableMedicationReminders"
                            label="Medication Reminders"
                            description="Reminders to take your medications and supplements"
                        />
                        <Toggle
                            name="enableSymptomReminders"
                            label="Symptom Logging"
                            description="Daily reminders to log your symptoms"
                        />
                        <Toggle
                            name="enableDailyLogReminders"
                            label="Daily Check-in"
                            description="Reminders for mood and general health logging"
                        />
                        <Toggle
                            name="enableAppointmentReminders"
                            label="Appointment Prep"
                            description="Reminders to prepare for upcoming doctor visits"
                        />
                        <Toggle
                            name="enableRiskUpdates"
                            label="Risk Updates"
                            description="Alerts when your PCOS risk level changes"
                        />
                        <Toggle
                            name="enableMilestones"
                            label="Milestones & Achievements"
                            description="Celebrate your health tracking streaks"
                        />
                    </div>
                </div>

                {/* Schedule & Timing */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Timing & Schedule
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Daily Check-in Time
                            </label>
                            <input
                                type="time"
                                name="dailyLogReminderTime"
                                value={formData.dailyLogReminderTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Symptom Log Time
                            </label>
                            <input
                                type="time"
                                name="symptomLogReminderTime"
                                value={formData.symptomLogReminderTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Moon className="w-5 h-5 text-indigo-600 mr-2" />
                                <div>
                                    <h4 className="font-medium text-gray-800">Quiet Hours</h4>
                                    <p className="text-xs text-gray-500">Pause notifications during sleep</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="quietHoursEnabled"
                                    checked={formData.quietHoursEnabled}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {formData.quietHoursEnabled && (
                            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Start Time</label>
                                    <input
                                        type="time"
                                        name="quietHoursStart"
                                        value={formData.quietHoursStart}
                                        onChange={handleChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">End Time</label>
                                    <input
                                        type="time"
                                        name="quietHoursEnd"
                                        value={formData.quietHoursEnd}
                                        onChange={handleChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Advanced
                    </h3>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <label className="font-medium text-gray-800">Appointment Notice</label>
                            <p className="text-sm text-gray-500">Days before appointment to get prep reminder</p>
                        </div>
                        <select
                            name="appointmentAdvanceNotice"
                            value={formData.appointmentAdvanceNotice}
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                            <option value={1}>1 Day Before</option>
                            <option value={3}>3 Days Before</option>
                            <option value={7}>1 Week Before</option>
                        </select>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Submit */}
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium ${saving ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </form>
        </div>
    );
};
