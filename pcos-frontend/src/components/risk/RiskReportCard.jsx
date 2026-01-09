import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Target, AlertCircle, CheckCircle, TrendingUp, RefreshCw, FileText } from 'lucide-react';
import { AppointmentPrepModal } from './AppointmentPrepModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RiskGauge = ({ score, riskLevel }) => {
    const getColor = () => {
        if (riskLevel === 'LOW') return 'text-green-600';
        if (riskLevel === 'MODERATE') return 'text-orange-500';
        return 'text-red-600';
    };

    // Circular progress calculation
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center mb-6">
            <div className="relative w-40 h-40 mb-2">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${getColor()} transition-all duration-1000 ease-out`}
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getColor()}`}>{Math.round(score)}</span>
                    <span className="text-xs text-gray-500 font-medium">{riskLevel} RISK</span>
                </div>
            </div>
        </div>
    );
};

const TrendIndicator = ({ trend }) => {
    if (!trend) return null;

    const isGood = (trend.direction === 'decreased');
    const color = isGood ? 'text-green-600' : (trend.direction === 'increased' ? 'text-red-600' : 'text-gray-600');
    const icon = trend.direction === 'decreased' ? '↓' : (trend.direction === 'increased' ? '↑' : '→');

    return (
        <div className={`flex items-center justify-center text-sm font-medium ${color} bg-gray-50 py-2 px-4 rounded-full mb-6 mx-auto w-max`}>
            <span className="mr-1 text-lg">{icon}</span>
            <span>
                {trend.direction === 'stable'
                    ? 'Risk score is stable'
                    : `Risk ${trend.direction} by ${Math.round(trend.value)} points`}
            </span>
            {trend.daysSince > 0 && <span className="text-gray-400 text-xs ml-2">({trend.daysSince} days ago)</span>}
        </div>
    );
};

const FactorBreakdown = ({ breakdown }) => {
    if (!breakdown) return null;

    const maxVals = { cycleScore: 35, symptomScore: 30, metabolicScore: 20, painScore: 15 };

    const getWidth = (val, max) => `${Math.min((val / max) * 100, 100)}%`;
    const getColor = (val, max) => {
        const ratio = val / max;
        if (ratio < 0.3) return 'bg-green-400';
        if (ratio < 0.7) return 'bg-orange-400';
        return 'bg-red-500';
    };

    return (
        <div className="mb-6 space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Risk Factor Breakdown</h4>

            {/* Cycle Score */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Cycle Irregularity</span>
                    <span className="font-medium">{breakdown.cycleScore}/{maxVals.cycleScore} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getColor(breakdown.cycleScore, maxVals.cycleScore)}`} style={{ width: getWidth(breakdown.cycleScore, maxVals.cycleScore) }}></div>
                </div>
            </div>

            {/* Symptom Score */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Symptoms (Acne, Hair)</span>
                    <span className="font-medium">{breakdown.symptomScore}/{maxVals.symptomScore} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getColor(breakdown.symptomScore, maxVals.symptomScore)}`} style={{ width: getWidth(breakdown.symptomScore, maxVals.symptomScore) }}></div>
                </div>
            </div>

            {/* Metabolic Score */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Metabolic Risks (BMI)</span>
                    <span className="font-medium">{breakdown.metabolicScore}/{maxVals.metabolicScore} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getColor(breakdown.metabolicScore, maxVals.metabolicScore)}`} style={{ width: getWidth(breakdown.metabolicScore, maxVals.metabolicScore) }}></div>
                </div>
            </div>

            {/* Pain Score */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Pain & Inflammation</span>
                    <span className="font-medium">{breakdown.painScore}/{maxVals.painScore} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getColor(breakdown.painScore, maxVals.painScore)}`} style={{ width: getWidth(breakdown.painScore, maxVals.painScore) }}></div>
                </div>
            </div>
        </div>
    );
};

export const RiskReportCard = () => {
    const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
    // ... (RiskGauge, TrendIndicator, FactorBreakdown components remain unchanged) ...
    // Note: To avoid re-pasting huge chunks, I'm assuming the helper components are above line 143 or in the file.
    // Wait, I need to keep the file valid. The previous tool call showed lines 1-164.
    // I will just modify the RiskReportCard component itself.

    // Re-defining internal components to ensure file integrity if I'm replacing the whole file or just the export.
    // Actually, I can use replace_file_content to inject the import and the component usage.

    // Since I have multi-replace availability, I'll use that to precise target.
    // But wait, "replace_file_content" is what I have selected. 
    // I will just add the import at the top, and the button/modal in the render.

    // Let's assume the Helper components (RiskGauge, etc) are there. I will target the `RiskReportCard` function start and return.


    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
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
                        Unable to calculate risk score. Please allow us a moment or try again later.
                    </p>
                    <button onClick={() => refetch()} className="text-xs text-soft-pink-600 font-semibold mt-2">Retry</button>
                </div>
            </div>
        );
    }

    const { risk, breakdown, trend, insights } = data || {};

    // Safety check: if data exists but risk is invalid, don't crash
    if (!risk) {
        return (
            <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-soft-pink-500" />
                    PCOS Risk Assessment
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm text-blue-700">
                        No risk assessment data available yet. Please log your first symptom or cycle to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-soft-pink-500" />
                    PCOS Risk Assessment
                </h3>
                <button
                    onClick={() => refetch()}
                    className="p-2 text-gray-400 hover:text-soft-pink-600 rounded-full hover:bg-soft-pink-50 transition-colors"
                    title="Recalculate Risk"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="medical-disclaimer mb-6">
                <p className="text-xs font-medium">
                    ⚕️ Not a diagnosis. This tool assesses risk based on tracked symptoms and cycles.
                </p>
            </div>

            <RiskGauge score={risk.score} riskLevel={risk.riskLevel} />

            <TrendIndicator trend={trend} />

            <FactorBreakdown breakdown={breakdown} />

            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Key Factors Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                    {risk.reasons && risk.reasons.length > 0 ? (
                        risk.reasons.map((reason, idx) => (
                            <span key={idx} className="bg-soft-pink-50 text-gray-700 text-xs px-3 py-1.5 rounded-full border border-soft-pink-100">
                                {reason}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No specific risk factors detected.</p>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-3">Actionable Insights</h5>
                {risk.riskLevel === 'HIGH' ? (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-start"><span className="mr-2 text-red-500">●</span> Schedule a gynecologist appointment for a formal checkup.</p>
                        <p className="flex items-start"><span className="mr-2 text-red-500">●</span> Request standard PCOS panel: FSH, LH, Free Testosterone, Insulin.</p>
                    </div>
                ) : risk.riskLevel === 'MODERATE' ? (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-start"><span className="mr-2 text-orange-500">●</span> Monitor symptoms closely for next 2 months.</p>
                        <p className="flex items-start"><span className="mr-2 text-orange-500">●</span> Focus on sleep and stress reduction to rule out lifestyle factors.</p>
                    </div>
                ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-start"><span className="mr-2 text-green-500">●</span> Continue regular tracking to maintain a good health history.</p>
                        <p className="flex items-start"><span className="mr-2 text-green-500">●</span> No immediate action needed.</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <button
                    onClick={() => setIsPrepModalOpen(true)}
                    className="flex items-center text-sm font-medium text-soft-pink-600 hover:text-soft-pink-700 transition-colors"
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Appointment Prep Pack
                </button>
            </div>

            <AppointmentPrepModal
                isOpen={isPrepModalOpen}
                onClose={() => setIsPrepModalOpen(false)}
            />
        </div>
    );
};
