import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-warm-beige-50 via-soft-pink-50 to-warm-beige-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-soft-pink-400 to-soft-pink-600 rounded-full flex items-center justify-center shadow-lg">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-soft-pink-500 to-soft-pink-700 bg-clip-text text-transparent">
                            PCOS Wellness
                        </span>
                        <br />
                        <span className="text-gray-800">Your Early Awareness Partner</span>
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Track your cycle, understand your symptoms, and get personalized guidance
                        for PCOS risk awareness – all in a safe, privacy-first platform.
                    </p>

                    <div className="medical-disclaimer inline-block mb-8">
                        <p className="text-sm font-medium">
                            ⚕️ This app does not diagnose. It supports early awareness and doctor consultation.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-soft-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-soft-pink-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Cycle Tracking</h3>
                        <p className="text-gray-600">
                            Accurately predict your next period with intelligent pattern recognition.
                            Get timely PMS care tips and personalized insights.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-sage-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Explainable Risk Detection</h3>
                        <p className="text-gray-600">
                            Understand your PCOS risk with transparent, evidence-based scoring.
                            See exactly why each factor matters.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="w-16 h-16 bg-warm-beige-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-warm-beige-700" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Actionable Guidance</h3>
                        <p className="text-gray-600">
                            Get clear next steps, doctor appointment prep packs, and lifestyle
                            challenges that actually help with PCOS.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="card max-w-3xl mx-auto bg-gradient-to-r from-soft-pink-50 to-sage-50 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to take control?</h2>
                    <p className="text-gray-700 mb-6">
                        Join thousands of women using our platform to better understand their health.
                    </p>
                    <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                        Start Your Journey
                        <Heart className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
