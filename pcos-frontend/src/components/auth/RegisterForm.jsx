import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Stethoscope, Sparkles } from 'lucide-react';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
        firstName: '',
        lastName: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate(result.user.role === 'DOCTOR' ? '/doctor' : '/onboarding');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg-animated p-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-soft-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-vibrant-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <div className="glass-card w-full max-w-2xl my-8 animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient-purple mb-2">Join Our Community</h1>
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-vibrant-purple-500" />
                        Start your journey to better health awareness
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-lg mb-6 animate-slide-up">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            I am a...
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'USER' })}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.role === 'USER'
                                        ? 'border-soft-pink-400 bg-gradient-to-br from-soft-pink-50 to-soft-pink-100 shadow-md scale-105'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <User className={`w-8 h-8 mx-auto mb-2 transition-colors ${formData.role === 'USER' ? 'text-soft-pink-600' : 'text-gray-400'
                                    }`} />
                                <p className="font-medium">Patient / User</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'DOCTOR' })}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.role === 'DOCTOR'
                                        ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 shadow-md scale-105'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <Stethoscope className={`w-8 h-8 mx-auto mb-2 transition-colors ${formData.role === 'DOCTOR' ? 'text-sage-700' : 'text-gray-400'
                                    }`} />
                                <p className="font-medium">Doctor / Professional</p>
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-modern"
                                placeholder="Jane"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-modern"
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-modern pl-10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number (for OTP login)
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-modern pl-10"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    {/* Doctor-specific fields */}
                    {formData.role === 'DOCTOR' && (
                        <div className="space-y-4 animate-slide-up">
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialization
                                </label>
                                <input
                                    id="specialization"
                                    name="specialization"
                                    type="text"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="input-modern"
                                    placeholder="Gynecology, Endocrinology, etc."
                                />
                            </div>
                            <div>
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    License Number
                                </label>
                                <input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    type="text"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="input-modern"
                                    placeholder="Medical License #"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-modern pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-modern pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-vibrant-purple-600 hover:text-vibrant-purple-700 font-medium transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div className="glass-card mt-8 bg-warm-beige-50/50">
                    <p className="text-xs font-medium text-gray-700 flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3 text-sage-600" />
                        This app does not diagnose. It supports early awareness and doctor consultation.
                    </p>
                </div>
            </div>
        </div>
    );
};
