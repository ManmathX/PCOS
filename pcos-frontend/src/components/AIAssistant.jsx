import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, FileText, Activity } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SYSTEM_PROMPT = `
You are "Gemmi", a super cool, friendly, and supportive AI assistant for a PCOS tracking app. 
You are NOT a boring medical bot. You are like a knowledgeable, empathetic best friend who knows a lot about PCOS.

Your vibe:
- Use Gen Z slang occasionally (slay, queen, vibe check, bet), but don't overdo it.
- Be super encouraging and positive.
- Use emojis 💖✨💅.
- Keep answers concise and easiest to read.

If provided with USER HEALTH DATA (cycles, symptoms, risk score):
- Analyze their patterns.
- If the risk is HIGH, gently suggest seeing a doctor, but don't scare them. Use phrases like "might be worth a check-up" or "just to be safe".
- If symptoms are frequent, suggest specific lifestyle tips (e.g., "Drinking spearmint tea might help with that acne, bestie! 🍵").
- Always remind them you aren't a doctor.

If asked about medical advice without data, give general wellness tips but ALWAYS remind them to check with their doctor.
`;

export function AIAssistant() {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hey bestie! ✨ I'm Gemmi, your PCOS pal. How are we feeling today? 💖" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isAuthenticated) return null;

    const generateHealthReport = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', text: "Generate my health report 📝" }]);
        console.log("Starting health report generation...");

        try {
            console.log("Fetching health data...");
            // 1. Fetch all health data in parallel
            const [userRes, cyclesRes, symptomsRes, riskRes] = await Promise.allSettled([
                axios.get(`${API_URL}/auth/me`),
                axios.get(`${API_URL}/cycles`),
                axios.get(`${API_URL}/symptoms`),
                axios.get(`${API_URL}/risk/latest`)
            ]);

            console.log("Fetch results summary:", {
                userStatus: userRes.status,
                cyclesStatus: cyclesRes.status,
                symptomsStatus: symptomsRes.status,
                riskStatus: riskRes.status
            });

            const userData = userRes.status === 'fulfilled' ? userRes.value.data : null;

            // Fixed: Extract array from response object
            const cyclesData = cyclesRes.status === 'fulfilled' ? cyclesRes.value.data : {};
            const cycles = Array.isArray(cyclesData.cycles) ? cyclesData.cycles : [];

            const symptomsData = symptomsRes.status === 'fulfilled' ? symptomsRes.value.data : {};
            const symptoms = Array.isArray(symptomsData.symptoms) ? symptomsData.symptoms : [];

            const risk = riskRes.status === 'fulfilled' ? riskRes.value.data : null;

            console.log("Extracted Data:", {
                user: userData?.user?.email,
                cyclesCount: cycles.length,
                symptomsCount: symptoms.length,
                riskLevel: risk?.risk?.riskLevel
            });

            if (!userData) {
                console.warn("User data fetch failed or missing.");
                setMessages(prev => [...prev, { role: 'model', text: "Oop! I need you to be logged in to see your data, bestie! 🙅‍♀️ Login and try again!" }]);
                setIsLoading(false);
                return;
            }

            // 2. Format data for the AI
            const dataSummary = `
        USER CHECK-IN DATA:
        Name: ${userData.user?.firstName}
        Risk Level: ${risk?.risk?.riskLevel || 'Unknown'} (Score: ${risk?.risk?.score || 0})
        
        Recent Cycles: ${cycles.length} recorded.
        Last Period: ${cycles[0] ? new Date(cycles[0].startDate).toLocaleDateString() : 'N/A'}
        
        Recent Symptoms (Last 5):
        ${symptoms.slice(0, 5).map(s => `- ${s.symptomType} (${s.severity}/10) on ${new Date(s.date).toLocaleDateString()}`).join('\n')}
      `;
            console.log("Data summary prepared for Gemini:", dataSummary);

            // 3. Send to Gemini
            console.log("Initializing Gemini model: gemini-2.5-flash");
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using safe model

            const prompt = `${SYSTEM_PROMPT}\n\nTask: Analyze this user's health data and provide a friendly, supportive health report with 3 key actionable tips. If risk is high, recommend a doctor visit gently.\n\n${dataSummary}`;

            console.log("Sending prompt to Gemini...");
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log("Gemini response received:", text);

            setMessages(prev => [...prev, { role: 'model', text: text }]);

            // 4. Save report to backend
            try {
                console.log("Saving report to backend...");
                await axios.post(`${API_URL}/ai-reports`, { content: text });
                setMessages(prev => [...prev, { role: 'model', text: "✅ I've saved this report to your profile so your doctor can see it too, bestie! 👩‍⚕️" }]);
                console.log("Report saved.");
            } catch (saveError) {
                console.error("Failed to save report:", saveError);
            }

        } catch (error) {
            console.error("Report Generation Error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            setMessages(prev => [...prev, { role: 'model', text: `My brain fog is real right now! ☁️ Error: ${error.message || 'Unknown'}. Try again later?` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);
        console.log("Processing user message in chat...");

        try {
            console.log("Initializing Gemini model: gemini-2.5-flash");
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT
            });

            // Filter out the initial greeting if it's from 'model' to comply with API rules (History must start with User)
            // Also ensure roles are mapped correctly ('user' -> 'user', 'model' -> 'model')
            const history = messages
                .filter((_, index) => index > 0 || messages[0].role !== 'model')
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 350,
                },
            });

            console.log("Sending chat message...");
            const result = await chat.sendMessage(userMessage);
            const response = result.response;
            const text = response.text();
            console.log("Chat response received:", text);

            setMessages(prev => [...prev, { role: 'model', text: text }]);
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            setMessages(prev => [...prev, { role: 'model', text: `Oof, my brain glitched! 😵‍💫 Error: ${error.message || 'Unknown'}. Try asking me that again?` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 md:w-96 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans mb-4"
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Gemmi AI</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Actions */}
                        <div className="px-4 py-2 bg-white/50 flex gap-2 overflow-x-auto">
                            <button
                                onClick={generateHealthReport}
                                disabled={isLoading}
                                className="flex-shrink-0 flex items-center gap-1 text-xs bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full hover:bg-pink-200 transition-colors"
                            >
                                <Activity size={12} /> Health Report
                            </button>
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none text-gray-700"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform active:scale-95 transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-full shadow-lg shadow-pink-500/30 text-white relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-spin-slow" />
                        <Bot size={28} />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
