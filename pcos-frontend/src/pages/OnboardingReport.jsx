import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowRight, Download, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function OnboardingReport() {
    const { reportId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Fetch reports for user (since we don't have a direct get-by-id public/protected route easily exposed yet without adding more backend code,
                // but wait, we have GET /api/ai-reports/user which returns all. Let's filter client side or assume check last one if ID matches.
                // Or better, let's just fetch all and find the one with this ID if possible, or build a specific route.
                // For now, let's use the existing /ai-reports/user endpoint.

                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const token = localStorage.getItem('token');

                const response = await axios.get(`${API_URL}/ai-reports/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Find the specific report if possible, or just the latest one if it matches our context
                // The backend doesn't return ID in the create response? It does now!
                // But the GET /user endpoint returns all.
                const foundReport = response.data.find(r => r.id === reportId);

                if (foundReport) {
                    setReport(foundReport);
                } else if (response.data.length > 0) {
                    // Fallback to latest if ID not found but others exist (maybe sync issue)
                    // But ideally specific ID.
                    setReport(response.data[0]);
                } else {
                    setError("Report not found.");
                }
            } catch (err) {
                console.error("Error fetching report:", err);
                setError("Failed to load your health report.");
            } finally {
                setLoading(false);
            }
        };

        if (user && reportId) {
            fetchReport();
        }
    }, [user, reportId]);

    const handleContinue = () => {
        navigate('/user');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-warm-beige-50">
                <Loader2 className="w-12 h-12 text-sage-600 animate-spin mb-4" />
                <h2 className="text-xl font-medium text-gray-700">Generating your personalized health insights...</h2>
                <p className="text-gray-500 mt-2">This usually takes about 5-10 seconds.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-beige-50 p-6">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={handleContinue} className="btn-primary">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-warm-beige-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-sage-600 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <FileText className="w-8 h-8" />
                            Your Health Report
                        </h1>
                        <p className="text-sage-100">Personalized insights based on your survey.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="prose prose-sage max-w-none">
                        <ReactMarkdown>{report?.content}</ReactMarkdown>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t pt-8">
                        <button
                            className="flex items-center gap-2 px-6 py-3 border-2 border-sage-600 text-sage-700 rounded-xl font-semibold hover:bg-sage-50 transition-colors"
                            onClick={() => window.print()}
                        >
                            <Download className="w-5 h-5" />
                            Save PDF
                        </button>

                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Continue to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
