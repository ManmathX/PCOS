import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Download, X, Loader, MessageSquare } from 'lucide-react';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AppointmentPrepModal = ({ isOpen, onClose }) => {
    const [reportData, setReportData] = useState(null);

    const generateMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/ai-reports/prepare`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: (data) => {
            setReportData(data);
        }
    });

    const handleDownloadPDF = () => {
        if (!reportData) return;

        const doc = new jsPDF();
        const margin = 20;
        let yPos = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(219, 39, 119); // Pink-600
        doc.text("PCOS Care - Doctor Appointment Guide", margin, yPos);
        yPos += 15;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 20;

        // Section: Patient Summary
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Patient Summary", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setTextColor(50);
        const splitSummary = doc.splitTextToSize(reportData.patientSummary, 170);
        doc.text(splitSummary, margin, yPos);
        yPos += splitSummary.length * 7 + 10;

        // Section: Symptom Timeline
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Symptom Insights", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setTextColor(50);
        const splitTimeline = doc.splitTextToSize(reportData.symptomTimeline, 170);
        doc.text(splitTimeline, margin, yPos);
        yPos += splitTimeline.length * 7 + 10;

        // Section: Questions to Ask
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Recommended Questions for Your Doctor", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        reportData.questionsForDoctor.forEach((q, i) => {
            const questionText = `${i + 1}. ${q}`;
            const splitQ = doc.splitTextToSize(questionText, 170);

            // Check page break
            if (yPos + splitQ.length * 7 > 280) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(splitQ, margin, yPos);
            yPos += splitQ.length * 7 + 5;
        });

        // Current Concerns
        if (reportData.keyConcerns && reportData.keyConcerns.length > 0) {
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Key Concerns Noted", margin, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setTextColor(50);
            reportData.keyConcerns.forEach(c => {
                doc.text(`• ${c}`, margin, yPos);
                yPos += 7;
            });
        }

        doc.save("PCOS_Appointment_Guide.pdf");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-soft-pink-500" />
                        Appointment Prep Pack
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {!reportData && !generateMutation.isPending && (
                        <div className="text-center py-8">
                            <div className="bg-soft-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-soft-pink-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ready to generate your guide?</h4>
                            <p className="text-gray-600 mb-6">
                                We'll analyze your latest symptoms and cycles to create a personalized specific summary and question list for your doctor.
                            </p>
                            <button
                                onClick={() => generateMutation.mutate()}
                                className="btn-primary"
                            >
                                Generate Guide with AI
                            </button>
                        </div>
                    )}

                    {generateMutation.isPending && (
                        <div className="text-center py-12">
                            <Loader className="w-10 h-10 text-soft-pink-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Analyzing your health data...</p>
                            <p className="text-sm text-gray-400 mt-2">This may take a few seconds.</p>
                        </div>
                    )}

                    {generateMutation.isError && (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-4">Failed to generate guide. Please try again.</p>
                            <button
                                onClick={() => generateMutation.mutate()}
                                className="text-soft-pink-600 hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {reportData && (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-1">Guide Generated Successfully!</h4>
                                <p className="text-sm text-green-700">Your personalized appointment guide is ready to review and download.</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Preview: Doctor Questions</h5>
                                <ul className="space-y-2">
                                    {reportData.questionsForDoctor.slice(0, 3).map((q, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-600">
                                            <span className="mr-2">•</span>
                                            {q}
                                        </li>
                                    ))}
                                    {reportData.questionsForDoctor.length > 3 && (
                                        <li className="text-xs text-gray-400 italic pl-3">+ {reportData.questionsForDoctor.length - 3} more questions in PDF</li>
                                    )}
                                </ul>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="btn-primary flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF Guide
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
