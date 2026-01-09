import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, FileText, TrendingUp, Calendar, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SurveyInsightsCard = () => {
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['survey', 'full', user?.id],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/survey/${user.id}/full`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        },
        enabled: !!user?.id,
        retry: false
    });

    if (isLoading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                <div className="flex items-start gap-4">
                    <FileText className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="font-bold text-purple-900 mb-2">
                            Complete Your Health Survey
                        </h3>
                        <p className="text-sm text-purple-700 mb-4">
                            Get a personalized PCOS health report by completing our voice-guided onboarding survey.
                        </p>
                        <Link
                            to="/onboarding"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                        >
                            Start Survey →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { survey, report } = data;

    // Extract key insights from survey
    const keyInsights = [
        { label: 'Period Impact', value: survey.periodImpact, icon: Calendar },
        { label: 'Activity Level', value: `${survey.activityLevel} days/week`, icon: TrendingUp },
        { label: 'Stress Level', value: survey.stressLevel, icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            {/* Survey Completion Badge */}
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                        <h3 className="font-bold text-green-900">Health Survey Completed</h3>
                        <p className="text-sm text-green-700">
                            Completed on {new Date(survey.completedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Your Health Snapshot</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {keyInsights.map((insight, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <insight.icon className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-medium text-gray-600">{insight.label}</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 capitalize">
                                {insight.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Health Report */}
            {report && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Your Personalized Health Report</h3>
                        <Link
                            to={`/onboarding/report/${report.id}`}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                        >
                            <LinkIcon className="w-4 h-4" />
                            View Full Report
                        </Link>
                    </div>
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                            {report.content.slice(0, 500)}...
                        </ReactMarkdown>
                    </div>
                    <Link
                        to={`/onboarding/report/${report.id}`}
                        className="mt-4 inline-block text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                        Read More →
                    </Link>
                </div>
            )}
        </div>
    );
};
