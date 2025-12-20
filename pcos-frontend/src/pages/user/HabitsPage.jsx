import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, Coffee, Moon, Footprints, Heart, CheckCircle2, Flame } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HABIT_TYPES = [
    { id: 'walk_10k', label: '10k Steps Daily', icon: Footprints, color: 'soft-pink', pcosHelp: 'Improves insulin sensitivity' },
    { id: 'sleep_7h', label: '7+ Hours Sleep', icon: Moon, color: 'sage', pcosHelp: 'Regulates hormones' },
    { id: 'no_sugar', label: 'No Sugary Drinks', icon: Coffee, color: 'warm-beige', pcosHelp: 'Reduces insulin resistance' },
    { id: 'mindful_eating', label: 'Mindful Eating', icon: Heart, color: 'soft-pink', pcosHelp: 'Supports weight management' },
];

const HabitCard = ({ habit, streak, onToggle }) => {
    const [isChecked, setIsChecked] = useState(false);
    const Icon = habit.icon;
    const today = format(new Date(), 'yyyy-MM-dd');

    const toggleHabit = async () => {
        const newState = !isChecked;
        setIsChecked(newState);
        await onToggle(habit.id, today, newState);
    };

    return (
        <div className={`card border-2 ${isChecked ? 'border-green-400 bg-green-50' : 'border-gray-200'} transition-all`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-${habit.color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${habit.color}-600`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{habit.label}</h3>
                        <p className="text-xs text-gray-600">{habit.pcosHelp}</p>
                    </div>
                </div>
                <button
                    onClick={toggleHabit}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                >
                    <CheckCircle2 className="w-6 h-6" />
                </button>
            </div>

            {streak > 0 && (
                <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700">
                        {streak} day streak! 🔥
                    </span>
                </div>
            )}
        </div>
    );
};

export const HabitsPage = () => {
    const queryClient = useQueryClient();

    const { data: streaksData } = useQuery({
        queryKey: ['habits', 'streaks'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/habits/streaks`);
            return response.data;
        },
    });

    const logHabitMutation = useMutation({
        mutationFn: async ({ habitType, date, completed }) => {
            const response = await axios.post(`${API_URL}/habits`, {
                habitType,
                date,
                completed,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['habits']);
        },
    });

    const handleToggleHabit = async (habitType, date, completed) => {
        await logHabitMutation.mutateAsync({ habitType, date, completed });
    };

    const streaks = streaksData?.streaks || {};

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Habits</h2>
                <p className="text-gray-600">Build healthy habits that support PCOS management</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    💡 Small daily habits create lasting change. Each action supports your hormonal health!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {HABIT_TYPES.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        streak={streaks[habit.id] || 0}
                        onToggle={handleToggleHabit}
                    />
                ))}
            </div>

            <div className="card bg-gradient-to-r from-soft-pink-50 to-sage-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Why These Habits Matter for PCOS</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                        <span className="text-sage-600 font-bold">•</span>
                        <p><span className="font-semibold">Regular Exercise</span> improves insulin sensitivity and helps regulate hormones</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-sage-600 font-bold">•</span>
                        <p><span className="font-semibold">Quality Sleep</span> is crucial for hormone balance and stress management</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-sage-600 font-bold">•</span>
                        <p><span className="font-semibold">Reducing Sugar</span> helps manage insulin levels and reduce inflammation</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-sage-600 font-bold">•</span>
                        <p><span className="font-semibold">Mindful Eating</span> supports healthy weight management and reduces stress</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
