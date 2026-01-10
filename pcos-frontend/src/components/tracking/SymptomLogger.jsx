import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, Save } from 'lucide-react';
import { format } from 'date-fns';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SYMPTOM_TYPES = [
    { value: 'acne', label: 'Acne / Skin Issues' },
    { value: 'hair_loss', label: 'Hair Loss / Thinning' },
    { value: 'mood_swings', label: 'Mood Swings' },
    { value: 'bloating', label: 'Bloating' },
    { value: 'fatigue', label: 'Fatigue / Low Energy' },
    { value: 'cramping', label: 'Cramping' },
    { value: 'headache', label: 'Headache' },
    { value: 'breast_tenderness', label: 'Breast Tenderness' },
    { value: 'weight_gain', label: 'Weight Gain' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'insomnia', label: 'Insomnia / Sleep Issues' },
];

export const SymptomLogger = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        symptomType: 'acne',
        severity: 5,
        notes: '',
    });
    const [aiErrorMessage, setAiErrorMessage] = useState('');

    const queryClient = useQueryClient();

    const logSymptomMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            console.log('Logging symptom to:', `${API_URL}/symptoms`);
            if (!token) throw new Error('No authentication token found. Please login again.');

            const response = await axios.post(`${API_URL}/symptoms`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['symptoms']);
            queryClient.invalidateQueries(['risk']);
            if (onSuccess) onSuccess();
            // Reset only notes
            setFormData(prev => ({ ...prev, notes: '', severity: 5 }));
            setAiErrorMessage(''); // Clear any error messages
        },
        onError: async (error) => {
            // Generate AI error message
            await generateAIErrorMessage(error);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        logSymptomMutation.mutate(formData);
    };

    const generateAIErrorMessage = async (error) => {
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const errorType = error.response?.status || 'unknown';
            const errorMessage = error.response?.data?.error || error.message;

            const prompt = `
            You are a helpful, empathetic health app assistant. A user tried to log a symptom but encountered an error.
            
            Error details:
            - Status: ${errorType}
            - Message: ${errorMessage}
            
            Generate a SHORT, friendly, and helpful error message (max 3-4 sentences) that:
            1. Acknowledges the issue empathetically
            2. Provides 2-3 specific troubleshooting steps
            3. Reassures the user their data is safe
            4. Uses a warm, supportive tone
            
            Format as plain text, no markdown. Include a heart emoji at the end.
            `;

            const result = await model.generateContent(prompt);
            const aiMessage = result.response.text();
            setAiErrorMessage(aiMessage);
        } catch (aiError) {
            console.error('AI error message generation failed:', aiError);
            console.log('Original Error:', error);
            // Fallback with specific error info
            const specificError = error.response?.data?.error || error.message;
            setAiErrorMessage(
                `We couldn't save your symptom log. \nError: ${specificError} \n\nPlease check your connection and try again. 💙`
            );
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-sage-600" />
                Log Symptom
            </h3>

            {logSymptomMutation.isError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                    {aiErrorMessage ? (
                        <p className="text-sm text-red-700 whitespace-pre-line">{aiErrorMessage}</p>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            <p className="text-sm text-red-700">Generating helpful message...</p>
                        </div>
                    )}
                </div>
            )}

            {logSymptomMutation.isSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                    <p className="text-sm text-green-700">Symptom logged successfully!</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptom Type *
                    </label>
                    <select
                        name="symptomType"
                        value={formData.symptomType}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        {SYMPTOM_TYPES.map(symptom => (
                            <option key={symptom.value} value={symptom.value}>
                                {symptom.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity (0-10)
                </label>
                <input
                    type="range"
                    name="severity"
                    min="0"
                    max="10"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Minimal</span>
                    <span className="font-bold text-sage-600">{formData.severity}</span>
                    <span>Severe</span>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field"
                    rows="2"
                    placeholder="Additional context about this symptom..."
                />
            </div>

            <button
                type="submit"
                disabled={logSymptomMutation.isPending}
                className="btn-secondary w-full flex items-center justify-center"
            >
                <Save className="w-4 h-4 mr-2" />
                {logSymptomMutation.isPending ? 'Logging...' : 'Log Symptom'}
            </button>
        </form>
    );
};
