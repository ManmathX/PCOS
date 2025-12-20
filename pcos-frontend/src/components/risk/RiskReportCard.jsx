import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Target, AlertCircle, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RiskGauge = ({ score, riskLevel }) => {
    const getColor = () => {
        if (riskLevel === 'LOW') return 'text-green-600';
        if (riskLevel === 'MODERATE') return 'text-orange-500';
        return 'text-red-600';
    };

    const getIcon = () => {
        if (riskLevel === 'LOW') return <CheckCircle className="w-12 h-12" />;
        if (riskLevel === 'MODERATE') return <AlertCircle className="w-12 h-12" />;
        return <AlertCircle className="w-12 h-12" />;
    };

    return (
        <div className="text-center mb-6">
            <div className={`${getColor()} mb-3`}>{getIcon()}</div>
            <div className="mb-2">
                <span className="text-5xl font-bold text-gray-800">{Math.round(score)}</span>
                <span className="text-gray-500 ml-2">/ 100</span>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${riskLevel === 'LOW' ? 'bg-green-100 text-green-700' :
                    riskLevel === 'MODERATE' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                }`}>
                {riskLevel} RISK
            </div>
        </div>
    );
};

const ReasonChip = ({ reason }) => (
    <div className="bg-soft-pink-50 border border-soft-pink-200 rounded-lg px-4 py-2 flex items-start space-x-2">
        <div className="w-2 h-2 bg-soft-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
        <span className="text-sm text-gray-700">{reason}</span>
    </div>
);

export const RiskReportCard = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['risk', 'calculate'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/risk/calculate`);
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-soft-pink-500" />
                    PCOS Risk Assessment
                </h3>
                <div className="bg-warm-beige-100 border-l-4 border-sage-500 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                        Unable to calculate risk score. Please log at least 2 cycle entries first.
                    </p>
                </div>
            </div>
        );
    }

    const { risk, insights } = data || {};

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-soft-pink-500" />
                    PCOS Risk Assessment
                </h3>
                <button
                    onClick={() => refetch()}
                    className="text-sm text-soft-pink-600 hover:text-soft-pink-700 flex items-center"
                >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Recalculate
                </button>
            </div>

            <div className="medical-disclaimer mb-6">
                <p className="text-xs font-medium">
                    ⚕️ This is not a diagnosis. Consult a gynecologist for professional medical advice.
                </p>
            </div>

            <RiskGauge score={risk.score} riskLevel={risk.riskLevel} />

            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Why this score?
                </h4>
                <div className="space-y-2">
                    {risk.reasons && risk.reasons.length > 0 ? (
                        risk.reasons.map((reason, idx) => (
                            <ReasonChip key={idx} reason={reason} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No specific risk factors detected.</p>
                    )}
                </div>
            </div>

            {insights && (
                <div className="bg-sage-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2 text-sm">Your Data Summary</h5>
                    <div className="text-sm text-gray-700 space-y-1">
                        {insights.avgCycleLength && (
                            <p>• Average cycle length: <span className="font-medium">{insights.avgCycleLength} days</span></p>
                        )}
                        <p>• Symptoms tracked: <span className="font-medium">{insights.symptomCount || 0}</span></p>
                        {insights.painSpikeDetected && (
                            <p className="text-orange-600">• ⚠️ Pain spike detected in recent cycles</p>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-3">What to do next</h5>
                {risk.riskLevel === 'HIGH' ? (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>• <span className="font-medium">Schedule an appointment</span> with a gynecologist soon</p>
                        <p>• Request tests: Ultrasound, Hormone panel (FSH, LH, Testosterone)</p>
                        <p>• Continue tracking cycles and symptoms daily</p>
                        <p>• Download your appointment prep pack (coming soon)</p>
                    </div>
                ) : risk.riskLevel === 'MODERATE' ? (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>• <span className="font-medium">Monitor your symptoms</span> for the next 2-3 cycles</p>
                        <p>• Consider scheduling a checkup within 3-6 months</p>
                        <p>• Focus on lifestyle: Regular exercise, balanced diet</p>
                    </div>
                ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>• <span className="font-medium">Great! Keep up the good work</span></p>
                        <p>• Continue tracking to maintain awareness</p>
                        <p>• Annual gynecologist checkups recommended</p>
                    </div>
                )}
            </div>
        </div>
    );
};
