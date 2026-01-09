import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Calendar, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="min-h-screen gradient-bg-animated relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-soft-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-vibrant-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="text-center max-w-4xl mx-auto animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-soft-pink-400 to-vibrant-purple-500 rounded-full flex items-center justify-center shadow-glow-pink animate-float">
                            <Heart className="w-10 h-10 text-white" fill="white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-gradient-purple">
                            PCOS Wellness
                        </span>
                        <br />
                        <span className="text-gray-800">Your Early Awareness Partner</span>
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Track your cycle, understand your symptoms, and get personalized guidance
                        for PCOS risk awareness – all in a safe, privacy-first platform.
                    </p>

                    <div className="glass-card inline-block mb-8">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-sage-600" />
                            ⚕️ This app does not diagnose. It supports early awareness and doctor consultation.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-premium text-lg px-8 py-3 inline-flex items-center justify-center group">
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="glass-card text-center hover-lift animate-slide-up">
                        <div className="w-16 h-16 bg-gradient-to-br from-soft-pink-100 to-soft-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Calendar className="w-8 h-8 text-soft-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Cycle Tracking</h3>
                        <p className="text-gray-600">
                            Accurately predict your next period with intelligent pattern recognition.
                            Get timely PMS care tips and personalized insights.
                        </p>
                    </div>

                    <div className="glass-card text-center hover-lift animate-slide-up animate-delay-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Activity className="w-8 h-8 text-sage-700" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Explainable Risk Detection</h3>
                        <p className="text-gray-600">
                            Understand your PCOS risk with transparent, evidence-based scoring.
                            See exactly why each factor matters.
                        </p>
                    </div>

                    <div className="glass-card text-center hover-lift animate-slide-up animate-delay-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-vibrant-purple-100 to-vibrant-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                            <TrendingUp className="w-8 h-8 text-vibrant-purple-700" />
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
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="glass-card max-w-3xl mx-auto text-center hover-lift">
                    <h2 className="text-3xl font-bold mb-4 text-gradient-purple">Ready to take control?</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                        Join thousands of women using our platform to better understand their health.
                    </p>
                    <Link to="/register" className="btn-premium text-lg px-8 py-3 inline-flex items-center group">
                        Start Your Journey
                        <Heart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
