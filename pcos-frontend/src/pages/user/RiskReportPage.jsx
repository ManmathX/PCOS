import React from 'react';
import { RiskReportCard } from '../../components/risk/RiskReportCard';

export const RiskReportPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">PCOS Risk Assessment</h2>
                <p className="text-gray-600">Understand your risk factors with explainable insights</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    ⚕️ This app does not diagnose. It supports early awareness and doctor consultation.
                </p>
            </div>

            <div className="max-w-2xl">
                <RiskReportCard />
            </div>

            <div className="card max-w-2xl">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Understanding Risk Levels</h3>
                <div className="space-y-3 text-sm">
                    <div className="border-l-4 border-green-500 pl-3">
                        <p className="font-semibold text-green-700">LOW RISK (0-29)</p>
                        <p className="text-gray-600">No immediate concerns. Continue regular monitoring.</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                        <p className="font-semibold text-orange-700">MODERATE RISK (30-59)</p>
                        <p className="text-gray-600">Some indicators present. Monitor closely, consider checkup.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3">
                        <p className="font-semibold text-red-700">HIGH RISK (60-100)</p>
                        <p className="text-gray-600">Multiple indicators present. Schedule gynecologist appointment soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
