import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SymptomLogger } from '../../components/tracking/SymptomLogger';
import { Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SymptomList = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['symptoms'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/symptoms`);
            return response.data;
        },
    });

    if (isLoading) {
        return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
    }

    const symptoms = data?.symptoms || [];

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-sage-600" />
                Recent Symptoms
            </h3>

            {symptoms.length === 0 ? (
                <p className="text-gray-500 text-sm">No symptoms logged yet</p>
            ) : (
                <div className="space-y-3">
                    {symptoms.slice(0, 10).map((symptom) => (
                        <div key={symptom.id} className="border-l-4 border-sage-300 pl-3 py-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-800 capitalize text-sm">
                                    {symptom.symptomType.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {format(parseISO(symptom.date), 'MMM dd')}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-sage-500 h-1.5 rounded-full"
                                        style={{ width: `${(symptom.severity / 10) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-600">{symptom.severity}/10</span>
                            </div>
                            {symptom.notes && (
                                <p className="text-xs text-gray-600 mt-1">{symptom.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const SymptomLogPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Symptom Tracking</h2>
                <p className="text-gray-600">Log and monitor your symptoms over time</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    ⚕️ This app does not diagnose. It supports early awareness and doctor consultation.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <SymptomLogger />
                </div>

                <div className="lg:col-span-2">
                    <SymptomList />
                </div>
            </div>
        </div>
    );
};
