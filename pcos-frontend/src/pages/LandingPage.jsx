import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Calendar, TrendingUp, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    return (
        <div className="min-h-screen gradient-bg-animated relative overflow-hidden font-sans">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-soft-pink-200/20 rounded-full blur-[120px] animate-float-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-vibrant-purple-200/20 rounded-full blur-[120px] animate-float-fast"></div>

            {/* Navigation Placeholder */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-soft-pink-500 to-vibrant-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">PCOS<span className="text-soft-pink-500">Wellness</span></span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <a href="#features" className="hover:text-soft-pink-500 transition-colors">Features</a>
                    <a href="#about" className="hover:text-soft-pink-500 transition-colors">About</a>
                    <Link to="/login" className="hover:text-soft-pink-500 transition-colors">Sign In</Link>
                    <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-12 pb-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-full mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4 text-vibrant-purple-500" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trusted by 5,000+ women</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                            Empowering Your <br />
                            <span className="text-gradient-purple">PCOS Journey</span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                            The most advanced early-awareness platform for PCOS. Track cycles, manage symptoms, and get AI-driven insights with a medical-grade privacy focus.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="btn-premium text-lg group px-10">
                                Start Free Assessment
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="flex items-center gap-4 px-6 text-slate-500">
                                <ShieldCheck className="w-5 h-5 text-sage-500" />
                                <span className="text-sm font-medium">100% HIPAA Compliant</span>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-slate-200/60 pt-8">
                            <div>
                                <p className="text-2xl font-bold text-slate-800">98%</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Accuracy</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">24/7</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">AI Support</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-20 glass-card p-4 rounded-[2.5rem] border-white/60 shadow-2xl">
                            <div className="bg-slate-50 rounded-[2rem] overflow-hidden aspect-[4/3] relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-soft-pink-100/50 to-vibrant-purple-100/50 flex items-center justify-center">
                                    <div className="w-3/4 h-3/4 glass-card-dark flex flex-col justify-center items-center gap-4 text-center">
                                        <Activity className="w-12 h-12 text-white animate-pulse" />
                                        <p className="text-white font-bold text-lg">Live Health Insights</p>
                                        <div className="w-2/3 h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-soft-pink-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 glass-card flex flex-col items-center justify-center gap-2 animate-float-slow z-30">
                            <Zap className="w-8 h-8 text-amber-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Pro Tips</span>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 glass-card flex flex-col items-start justify-center p-6 gap-3 animate-float-fast z-30">
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <Heart key={i} className="w-3 h-3 text-soft-pink-500" fill="currentColor" />)}
                            </div>
                            <p className="text-xs font-bold text-slate-700">"This app changed my perspective on my health!"</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container mx-auto px-6 py-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-xs font-bold text-soft-pink-600 uppercase tracking-[0.3em] mb-4">Core Capabilities</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">Designed for your wellness</h3>
                </div>

                <div className="bento-grid">
                    <div className="bento-item md:col-span-2 md:row-span-2 group">
                        <div className="p-8 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 bg-soft-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-7 h-7 text-soft-pink-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-slate-800 mb-4">Intelligent Cycle Prediction</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Advanced algorithms that learn from your unique data to predict cycles, ovulation, and symptoms with increasing accuracy over time.
                                </p>
                            </div>
                            <div className="mt-8">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-sage-500" />
                                        Irregular cycle detection
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-sage-500" />
                                        Ovulation tracking
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bento-item md:col-span-2 group">
                        <div className="p-8 flex gap-6 items-start">
                            <div className="w-12 h-12 bg-sage-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <Activity className="w-6 h-6 text-sage-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-800 mb-2">Transparent Risk Analysis</h4>
                                <p className="text-sm text-slate-600">
                                    See the factors contributing to your risk score with explainable AI insights.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bento-item md:col-span-1 group">
                        <div className="p-6 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-12 h-12 bg-vibrant-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-vibrant-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">AI Assistant</h4>
                        </div>
                    </div>

                    <div className="bento-item md:col-span-1 group">
                        <div className="p-6 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Trend Analysis</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* Medical Disclaimer Banner */}
            <div className="bg-slate-900 py-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-soft-pink-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold">Privacy First & Medical Compliance</p>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Encryption by default</p>
                        </div>
                    </div>
                    <div className="max-w-xl">
                        <p className="text-slate-400 text-sm leading-relaxed">
                            <span className="text-amber-400 font-bold">Important:</span> This platform is designed for awareness and health tracking. It is not a replacement for professional medical diagnosis or treatment. Always consult with a qualified healthcare provider.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-32 relative z-10 text-center">
                <div className="glass-card max-w-4xl mx-auto py-16 px-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-soft-pink-400/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-soft-pink-400/20 transition-colors"></div>
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Take the first step <br />
                        <span className="text-gradient-purple">towards clarity today.</span>
                    </h2>
                    <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto">
                        Join our community and start tracking your health journey with the most comprehensive PCOS toolkit available.
                    </p>
                    <Link to="/register" className="btn-premium text-lg px-12 group">
                        Get Started For Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-12 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm">
                    © 2026 PCOS Wellness. All rights reserved. 
                    <span className="mx-4 text-slate-300">|</span>
                    <a href="#" className="hover:text-soft-pink-500 transition-colors">Privacy Policy</a>
                    <span className="mx-4 text-slate-300">|</span>
                    <a href="#" className="hover:text-soft-pink-500 transition-colors">Terms of Service</a>
                </p>
            </footer>
        </div>
    );
};
