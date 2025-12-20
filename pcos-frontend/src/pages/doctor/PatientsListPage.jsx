import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PatientCard = ({ patient }) => {
    const getRiskColor = (level) => {
        if (level === 'LOW') return 'text-green-600 bg-green-100';
        if (level === 'MODERATE') return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <Link to={`/doctor/patients/${patient.id}`} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                {patient.latestRisk && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(patient.latestRisk.riskLevel)}`}>
                        {patient.latestRisk.riskLevel}
                    </span>
                )}
            </div>

            {patient.latestRisk && (
                <div className="bg-sage-50 p-2 rounded-lg text-sm">
                    <p className="text-gray-700">
                        Risk Score: <span className="font-semibold">{Math.round(patient.latestRisk.score)}/100</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        Last calculated: {new Date(patient.latestRisk.calculatedAt).toLocaleDateString()}
                    </p>
                </div>
            )}
        </Link>
    );
};

export const PatientsListPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['doctor', 'patients'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/doctor/patients`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <p className="text-red-600">Failed to load patients</p>
            </div>
        );
    }

    const patients = data?.patients || [];
    const highRiskPatients = patients.filter(p => p.latestRisk?.riskLevel === 'HIGH');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Patients</h2>
                <p className="text-gray-600">Consented patients you can monitor and support</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    👨‍⚕️ Patient data is only visible with explicit consent. Respect privacy and confidentiality.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="card bg-sage-50">
                    <Users className="w-8 h-8 text-sage-600 mb-2" />
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-3xl font-bold text-sage-700">{patients.length}</p>
                </div>
                <div className="card bg-red-50">
                    <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                    <p className="text-sm text-gray-600">High Risk</p>
                    <p className="text-3xl font-bold text-red-700">{highRiskPatients.length}</p>
                </div>
                <div className="card bg-soft-pink-50">
                    <TrendingUp className="w-8 h-8 text-soft-pink-600 mb-2" />
                    <p className="text-sm text-gray-600">Needs Review</p>
                    <p className="text-3xl font-bold text-soft-pink-700">{highRiskPatients.length}</p>
                </div>
            </div>

            {patients.length === 0 ? (
                <div className="card text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Patients Yet</h3>
                    <p className="text-gray-600">Patients will appear here once they grant you access to their data.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {patients.map(patient => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </div>
            )}
        </div>
    );
};
