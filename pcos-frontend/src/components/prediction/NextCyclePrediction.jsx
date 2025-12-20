import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Activity, AlertCircle } from 'lucide-react';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const NextCyclePrediction = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['prediction'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/predictions/next-cycle`);
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-soft-pink-500" />
                    Next Period Prediction
                </h3>
                <div className="bg-warm-beige-100 border-l-4 border-sage-500 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                        Log at least 2 cycles to get predictions
                    </p>
                </div>
            </div>
        );
    }

    const { prediction, insights } = data || {};
    const nextDate = prediction?.nextCycleDate ? parseISO(prediction.nextCycleDate) : null;
    const pmsDate = prediction?.pmsWindowStart ? parseISO(prediction.pmsWindowStart) : null;
    const daysUntil = nextDate ? differenceInDays(nextDate, new Date()) : null;

    const getConfidenceBadge = () => {
        const { confidence } = prediction;
        if (confidence === 'high') return 'bg-green-100 text-green-700';
        if (confidence === 'medium') return 'bg-orange-100 text-orange-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-soft-pink-500" />
                Next Period Prediction
            </h3>

            {nextDate && (
                <div className="bg-gradient-to-r from-soft-pink-50 to-sage-50 p-6 rounded-lg mb-4">
                    <div className="text-center mb-3">
                        <p className="text-sm text-gray-600 mb-1">Expected to start on</p>
                        <p className="text-3xl font-bold text-soft-pink-600">
                            {format(nextDate, 'MMM dd, yyyy')}
                        </p>
                        {daysUntil !== null && (
                            <p className="text-sm text-gray-600 mt-2">
                                {daysUntil > 0 ? `in ${daysUntil} days` : daysUntil === 0 ? 'Today!' : `${Math.abs(daysUntil)} days ago`}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge()}`}>
                            {prediction.confidence.toUpperCase()} CONFIDENCE
                        </span>
                    </div>
                </div>
            )}

            {pmsDate && daysUntil && daysUntil > 0 && daysUntil <= 7 && (
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mb-4">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-orange-800 text-sm">PMS Window Approaching</p>
                            <p className="text-xs text-orange-700 mt-1">
                                Starts around {format(pmsDate, 'MMM dd')}. Take care of yourself! 💙
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span className="text-gray-600">Pattern</span>
                    <span className="font-medium capitalize">{prediction.pattern?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Avg Cycle Length</span>
                    <span className="font-medium">{prediction.avgCycleLength} days</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Based on</span>
                    <span className="font-medium">{prediction.basedOnCycles} cycles</span>
                </div>
            </div>

            {insights && insights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">💡 Insights</p>
                    {insights.map((insight, idx) => (
                        <p key={idx} className="text-xs text-gray-600 mb-1">• {insight}</p>
                    ))}
                </div>
            )}
        </div>
    );
};
