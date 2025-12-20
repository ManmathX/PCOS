import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Droplet, Activity, Pill, Save } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CycleEntryForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        flowIntensity: 'MODERATE',
        painLevel: 5,
        notes: '',
        medications: '',
    });

    const queryClient = useQueryClient();

    const createCycleMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/cycles`, {
                ...data,
                medications: data.medications ? data.medications.split(',').map(m => m.trim()) : [],
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cycles']);
            queryClient.invalidateQueries(['prediction']);
            if (onSuccess) onSuccess();
            // Reset form
            setFormData({
                startDate: format(new Date(), 'yyyy-MM-dd'),
                endDate: '',
                flowIntensity: 'MODERATE',
                painLevel: 5,
                notes: '',
                medications: '',
            });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createCycleMutation.mutate(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-soft-pink-500" />
                Log Cycle
            </h3>

            {createCycleMutation.isError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                    <p className="text-sm text-red-700">Failed to save cycle entry. Please try again.</p>
                </div>
            )}

            {createCycleMutation.isSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                    <p className="text-sm text-green-700">Cycle logged successfully!</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Start Date *
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        End Date (optional)
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Droplet className="w-4 h-4 inline mr-1" />
                        Flow Intensity
                    </label>
                    <select
                        name="flowIntensity"
                        value={formData.flowIntensity}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="LIGHT">Light</option>
                        <option value="MODERATE">Moderate</option>
                        <option value="HEAVY">Heavy</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Activity className="w-4 h-4 inline mr-1" />
                        Pain Level (0-10)
                    </label>
                    <input
                        type="range"
                        name="painLevel"
                        min="0"
                        max="10"
                        value={formData.painLevel}
                        onChange={handleChange}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>No pain</span>
                        <span className="font-bold text-soft-pink-600">{formData.painLevel}</span>
                        <span>Severe</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Pill className="w-4 h-4 inline mr-1" />
                    Medications (comma-separated)
                </label>
                <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Ibuprofen, Birth control"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Any additional notes about this cycle..."
                />
            </div>

            <button
                type="submit"
                disabled={createCycleMutation.isPending}
                className="btn-primary w-full flex items-center justify-center"
            >
                <Save className="w-4 h-4 mr-2" />
                {createCycleMutation.isPending ? 'Saving...' : 'Save Cycle Entry'}
            </button>
        </form>
    );
};
