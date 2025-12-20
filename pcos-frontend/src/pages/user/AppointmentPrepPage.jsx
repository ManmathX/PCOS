import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Download, Calendar, Activity, Target, AlertCircle } from 'lucide-react';
import { generateAppointmentPDF } from '../../services/pdfGenerator';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AppointmentPrepPage = () => {
    const { user } = useAuth();
    const [generating, setGenerating] = useState(false);

    // Fetch all data needed for PDF
    const { data: cyclesData } = useQuery({
        queryKey: ['cycles'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/cycles`);
            return response.data;
        },
    });

    const { data: symptomsData } = useQuery({
        queryKey: ['symptoms'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/symptoms`);
            return response.data;
        },
    });

    const { data: riskData } = useQuery({
        queryKey: ['risk', 'latest'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${API_URL}/risk/latest`);
                return response.data;
            } catch {
                return null;
            }
        },
        retry: false,
    });

    const handleGeneratePDF = async () => {
        setGenerating(true);
        try {
            // Calculate avg cycle length
            const cycles = cyclesData?.cycles || [];
            let avgCycleLength = null;
            if (cycles.length >= 2) {
                const lengths = [];
                for (let i = 0; i < cycles.length - 1; i++) {
                    const diffDays = Math.abs(
                        (new Date(cycles[i].startDate) - new Date(cycles[i + 1].startDate)) / (1000 * 60 * 60 * 24)
                    );
                    lengths.push(diffDays);
                }
                avgCycleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
            }

            const pdfData = {
                user,
                cycles: cycles.slice(0, 6), // Last 6 cycles
                symptoms: symptomsData?.symptoms || [],
                riskScore: riskData?.risk,
                avgCycleLength,
            };

            const pdfBlob = generateAppointmentPDF(pdfData);

            // Create download link
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PCOS-Appointment-Summary-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const cycles = cyclesData?.cycles || [];
    const symptoms = symptomsData?.symptoms || [];
    const hasData = cycles.length > 0 || symptoms.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Preparation</h2>
                <p className="text-gray-600">Generate a comprehensive summary for your doctor visit</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    📋 This summary helps your doctor understand your PCOS journey quickly and accurately
                </p>
            </div>

            <div className="card bg-gradient-to-r from-soft-pink-50 to-sage-50">
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-soft-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Appointment Summary</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This PDF includes your cycle history, symptom timeline, PCOS risk assessment with explanations,
                            and suggested questions to ask your doctor.
                        </p>

                        {!hasData ? (
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg mb-4">
                                <p className="text-sm text-orange-700">
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    Please log some cycle or symptom data first to generate a meaningful summary.
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleGeneratePDF}
                                disabled={generating}
                                className="btn-primary flex items-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {generating ? 'Generating PDF...' : 'Download PDF Summary'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="card">
                    <Calendar className="w-8 h-8 text-soft-pink-500 mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-1">Cycle Data</h4>
                    <p className="text-2xl font-bold text-soft-pink-600">{cycles.length}</p>
                    <p className="text-xs text-gray-600">cycles logged</p>
                </div>

                <div className="card">
                    <Activity className="w-8 h-8 text-sage-600 mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-1">Symptoms</h4>
                    <p className="text-2xl font-bold text-sage-600">{symptoms.length}</p>
                    <p className="text-xs text-gray-600">entries logged</p>
                </div>

                <div className="card">
                    <Target className="w-8 h-8 text-warm-beige-700 mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-1">Risk Level</h4>
                    <p className="text-lg font-bold text-warm-beige-700">
                        {riskData?.risk?.riskLevel || 'Not calculated'}
                    </p>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">What's Included in Your Summary</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                        <span className="text-soft-pink-600 font-bold">✓</span>
                        <p><span className="font-semibold">Cycle History:</span> Last 6 cycles with dates, flow, and pain levels</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-soft-pink-600 font-bold">✓</span>
                        <p><span className="font-semibold">Symptom Timeline:</span> Recent symptoms with severity ratings</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-soft-pink-600 font-bold">✓</span>
                        <p><span className="font-semibold">Risk Assessment:</span> Current PCOS risk score with explainable factors</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-soft-pink-600 font-bold">✓</span>
                        <p><span className="font-semibold">Questions to Ask:</span> Customized questions based on your risk level</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-soft-pink-600 font-bold">✓</span>
                        <p><span className="font-semibold">Medical Disclaimer:</span> Clear statement that this is informational only</p>
                    </div>
                </div>
            </div>

            <div className="card bg-sage-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Tips for Your Appointment</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>• <span className="font-medium">Bring this summary</span> - It helps your doctor review your history quickly</p>
                    <p>• <span className="font-medium">Be honest</span> - Share all symptoms, even if they seem unrelated</p>
                    <p>• <span className="font-medium">Ask questions</span> - Use the suggested questions as a starting point</p>
                    <p>• <span className="font-medium">Take notes</span> - Write down your doctor's recommendations</p>
                    <p>• <span className="font-medium">Follow up</span> - Schedule your next appointment before leaving</p>
                </div>
            </div>
        </div>
    );
};
