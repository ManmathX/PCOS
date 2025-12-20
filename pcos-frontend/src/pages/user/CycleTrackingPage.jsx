import React from 'react';
import { CycleEntryForm } from '../../components/tracking/CycleEntryForm';
import { CycleHistory } from '../../components/tracking/CycleHistory';
import { NextCyclePrediction } from '../../components/prediction/NextCyclePrediction';

export const CycleTrackingPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cycle Tracking</h2>
                <p className="text-gray-600">Log your menstrual cycles and view patterns over time</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    ⚕️ This app does not diagnose. It supports early awareness and doctor consultation.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <CycleEntryForm />
                    <CycleHistory />
                </div>

                <div>
                    <NextCyclePrediction />
                </div>
            </div>
        </div>
    );
};
