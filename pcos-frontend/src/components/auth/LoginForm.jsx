import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role
            navigate(result.user.role === 'DOCTOR' ? '/doctor' : '/user');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg-animated p-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-soft-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-vibrant-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="glass-card w-full max-w-md animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-soft-pink-400 to-vibrant-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-pink animate-float">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient-purple mb-2">Welcome Back</h1>
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-vibrant-purple-500" />
                        Sign in to your PCOS wellness journey
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-lg mb-6 animate-slide-up">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-modern pl-10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-modern pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-vibrant-purple-600 hover:text-vibrant-purple-700 font-medium transition-colors">
                            Register here
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
