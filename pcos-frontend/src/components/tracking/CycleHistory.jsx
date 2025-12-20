import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CycleHistory = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['cycles'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/cycles`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <p className="text-red-600">Failed to load cycle history</p>
            </div>
        );
    }

    const cycles = data?.cycles || [];

    // Calculate cycle lengths for chart
    const chartData = cycles
        .slice(0, 10)
        .reverse()
        .map((cycle, idx, arr) => {
            const cycleLength = idx < arr.length - 1
                ? Math.round((new Date(cycle.startDate) - new Date(arr[idx + 1].startDate)) / (1000 * 60 * 60 * 24))
                : null;

            return {
                date: format(parseISO(cycle.startDate), 'MMM dd'),
                cycleLength,
                painLevel: cycle.painLevel || 0,
            };
        })
        .filter(d => d.cycleLength !== null);

    return (
        <div className="card">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-soft-pink-500" />
                Cycle Length Trends
            </h3>

            {chartData.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Log at least 2 cycles to see trends</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888" style={{ fontSize: '0.75rem' }} />
                        <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cycleLength"
                            stroke="#FFB6C1"
                            strokeWidth={2}
                            name="Cycle Length (days)"
                            dot={{ fill: '#FFB6C1', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="painLevel"
                            stroke="#9CAF88"
                            strokeWidth={2}
                            name="Pain Level"
                            dot={{ fill: '#9CAF88', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-soft-pink-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Cycles Logged</p>
                    <p className="text-2xl font-bold text-soft-pink-600">{cycles.length}</p>
                </div>
                <div className="bg-sage-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Avg Cycle Length</p>
                    <p className="text-2xl font-bold text-sage-600">
                        {chartData.length > 0
                            ? Math.round(chartData.reduce((sum, d) => sum + d.cycleLength, 0) / chartData.length)
                            : '-'} <span className="text-sm">days</span>
                    </p>
                </div>
                <div className="bg-warm-beige-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Avg Pain Level</p>
                    <p className="text-2xl font-bold text-warm-beige-700">
                        {cycles.length > 0
                            ? (cycles.reduce((sum, c) => sum + (c.painLevel || 0), 0) / cycles.length).toFixed(1)
                            : '-'}
                    </p>
                </div>
                <div className="bg-soft-pink-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Last Logged</p>
                    <p className="text-sm font-bold text-soft-pink-600">
                        {cycles.length > 0 ? format(parseISO(cycles[0].startDate), 'MMM dd') : '-'}
                    </p>
                </div>
            </div>
        </div>
    );
};
