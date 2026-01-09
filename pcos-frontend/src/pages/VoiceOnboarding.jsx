import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mic, MicOff, Volume2, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY; // We'll add this to .env (frontend proxy) or fetch from backend acting as proxy.
// Ideally, frontend shouldn't have this key if it's production. 
// For this hackathon/demo context, we'll assume direct call or backend proxy. 
// Given the prompt "this api ... of check ... given all access", user provided key. 
// I will implement using direct call for simplicity as requested, but warn about security if needed.
// Actually, better to route TTS through backend to keep key safe, but I'll follow standard React pattern with .env

const QUESTIONS = [
    {
        id: 'periodImpact',
        text: "How do you think your periods are affected right now?",
        options: ["Completely normal", "A little disturbed but manageable", "Quite irregular or difficult", "Very problematic and affecting my daily life"]
    },
    {
        id: 'reasons',
        text: "What do you think are the main reasons your periods are like this?",
        type: 'checkbox',
        options: ["Stress", "Sleep problems", "Food / diet habits", "Weight changes", "Hormonal issues", "Family/genetic reasons", "I don’t know", "Other"]
    },
    {
        id: 'pmsCoping',
        text: "When your period or PMS is bad, what do you usually do?",
        type: 'checkbox',
        options: ["Do nothing, just tolerate it", "Home remedies", "Painkillers", "Visit a doctor", "Take rest / skip activities", "Other"]
    },
    {
        id: 'activityLevel',
        text: "On average, how many days per week do you do at least 30 minutes of physical activity?",
        options: ["0", "1–2", "3–4", "5 or more"]
    },
    {
        id: 'sleepDuration',
        text: "How would you describe your usual sleep?",
        options: ["Less than 6 hours", "6–8 hours", "More than 8 hours", "Very irregular"]
    },
    {
        id: 'stressLevel',
        text: "How is your everyday stress level right now?",
        options: ["Low", "Moderate", "High", "Very high"]
    },
    {
        id: 'supplements',
        text: "How often do you take any multivitamins or supplements?",
        options: ["Rarely", "1–2 times per week", "3–4 times per week", "Almost every day"]
    },
    {
        id: 'periodFrequency',
        text: "In the last 6 months, how often do your periods come?",
        options: ["Every 21–35 days", "Often earlier than 21 days", "Often later than 35 days", "Sometimes skip for 2–3 months or more", "Not sure"]
    },
    {
        id: 'bleedingDuration',
        text: "How many days does your bleeding usually last?",
        options: ["1–3 days", "4–7 days", "More than 7 days"]
    },
    {
        id: 'flowIntensity',
        text: "How would you describe your usual flow?",
        options: ["Very light", "Normal", "Heavy", "Very heavy with clots"]
    },
    {
        id: 'painLevel',
        text: "How painful are your periods usually?",
        options: ["No pain", "Mild", "Moderate", "Severe"]
    },
    {
        id: 'hirsutism',
        text: "Have you noticed unwanted thick hair growth on your face, chest, stomach, or back?",
        options: ["No", "A little", "Quite a lot"]
    },
    {
        id: 'pcosAwareness',
        text: "Have you ever heard of PCOS or PCOD?",
        options: ["Yes", "I have heard the name only", "No"]
    },
    {
        id: 'infoSource',
        text: "Where did you first hear about PCOS or PCOD?",
        type: 'checkbox',
        options: ["Friends or family", "Social media", "School / college", "Doctor or nurse", "TV / newspapers", "I have not heard about it", "Other"]
    },
    {
        id: 'symptomKnowledge',
        text: "In your opinion, which of these can be symptoms of PCOS? Check all that apply.",
        type: 'checkbox',
        options: ["Irregular periods", "Unwanted thick hair", "Acne", "Weight gain", "Difficulty getting pregnant", "I am not sure"]
    },
    {
        id: 'confidence',
        text: "How confident do you feel about your knowledge of periods and menstrual health?",
        options: ["Very confident", "Somewhat confident", "Not very confident", "Not at all confident"]
    },
    {
        id: 'workshops',
        text: "Have you ever attended any session workshop or class about menstrual health or PCOS?",
        options: ["Yes, about menstrual health", "Yes, about PCOS", "Yes, about both", "No"]
    }
];

export function VoiceOnboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processing, setProcessing] = useState(false);
    const [detectedOptions, setDetectedOptions] = useState([]);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const audioRef = useRef(new Audio());
    const recognitionRef = useRef(null);

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    useEffect(() => {
        // Initialize Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setTranscript(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                if (transcript.trim().length > 0) {
                    processAnswer(transcript);
                }
            };
        } else {
            console.warn("Web Speech API not supported");
        }

        // Clean up audio on unmount
        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, []);

    useEffect(() => {
        // Reset state when question changes
        setTranscript('');
        setDetectedOptions([]);

        // Speak only the question (not options)
        speakText(currentQuestion.text);
    }, [currentQuestion]);

    const speakText = async (text) => {
        if (!ttsEnabled) return;

        try {
            setIsSpeaking(true);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

            // Call backend TTS proxy
            const response = await axios.post(
                `${API_URL}/tts`,
                {
                    text: text,
                    voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
                },
                {
                    responseType: 'blob'
                }
            );

            const audioUrl = URL.createObjectURL(response.data);
            audioRef.current.src = audioUrl;

            // Return promise that resolves when audio finishes
            return new Promise((resolve) => {
                audioRef.current.onended = () => {
                    setIsSpeaking(false);
                    resolve();
                };
                audioRef.current.onerror = () => {
                    setIsSpeaking(false);
                    setTtsEnabled(false);
                    console.warn("TTS playback failed, disabling TTS");
                    resolve();
                };
                audioRef.current.play().catch(err => {
                    console.error("Audio play error:", err);
                    setIsSpeaking(false);
                    setTtsEnabled(false);
                    resolve();
                });
            });
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
            setTtsEnabled(false);
        }
    };

    const startListening = () => {
        setTranscript('');
        setIsListening(true);
        recognitionRef.current?.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    const processAnswer = async (userVoiceText) => {
        setProcessing(true);
        try {
            // Use Gemini to map voice text to options
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            Task: Map the user's spoken answer to the most appropriate option(s) from a list.
            Question: "${currentQuestion.text}"
            Options: ${JSON.stringify(currentQuestion.options)}
            User Answer: "${userVoiceText}"
            
            Requirements:
            1. Return ONLY a JSON object. No markdown.
            2. Format: { "selected": ["Option Text"] }
            3. If the user's answer is vague or implies "Other", map to "Other" or the closest match.
            4. If checkbox type (multiple), return all matching options.
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean markdown if present
            const cleanJson = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            setDetectedOptions(parsed.selected);
            handleSelectOption(parsed.selected);

            // Speak confirmation
            if (parsed.selected && parsed.selected.length > 0) {
                const confirmation = `I heard: ${parsed.selected.join(', ')}`;
                await speakText(confirmation);
            }
        } catch (error) {
            console.error("Answer Processing Error:", error);
            await speakText("Sorry, I didn't catch that. Please try again or select manually.");
        } finally {
            setProcessing(false);
        }
    };

    const handleSelectOption = (selectedOptions) => {
        // Update responses
        setResponses(prev => {
            const current = prev[currentQuestion.id] || [];
            // If checkbox, append or toggle. If radio, replace.
            if (currentQuestion.type === 'checkbox') {
                // Simple merge for voice: add new detected ones
                // Real UI might want toggle logic, but for voice, usually we just add what they said
                return { ...prev, [currentQuestion.id]: selectedOptions };
            } else {
                return { ...prev, [currentQuestion.id]: selectedOptions[0] };
            }
        });

        // Auto-advance after short delay if it's not a checkbox (since checkboxes might need multiple inputs)
        // Actually, for voice flow, usually confirm -> next is better.
    };

    const handleNext = async () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Finish
            await submitSurvey();
        }
    };

    const submitSurvey = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await axios.post(`${API_URL}/survey`, {
                userId: user.id,
                responses
            });

            if (response.data.reportId) {
                navigate(`/onboarding/report/${response.data.reportId}`);
            } else {
                navigate('/user'); // Fallback
            }
        } catch (error) {
            console.error("Submission Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-warm-beige-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-sage-100 w-full">
                    <div
                        className="h-full bg-sage-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <span className="inline-block px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-semibold tracking-wider uppercase">
                            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    {/* Microphone Interaction */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                                ? 'bg-red-500 shadow-lg shadow-red-200 scale-110'
                                : 'bg-sage-600 shadow-xl shadow-sage-200 hover:bg-sage-700'
                                }`}
                        >
                            {isListening ? (
                                <MicOff className="w-10 h-10 text-white" />
                            ) : (
                                <Mic className="w-10 h-10 text-white" />
                            )}

                            {/* Speaking Indicator Ring */}
                            {isSpeaking && (
                                <div className="absolute inset-0 rounded-full border-4 border-sage-300 animate-ping opacity-75" />
                            )}
                        </button>

                        <p className="text-sm font-medium text-gray-500 h-6">
                            {isSpeaking ? "Speaking..." : isListening ? "Listening..." : processing ? "Processing answer..." : "Tap to speak or select below"}
                        </p>

                        {transcript && (
                            <div className="bg-gray-50 px-4 py-2 rounded-lg text-gray-600 text-sm italic max-w-md text-center">
                                "{transcript}"
                            </div>
                        )}

                        {detectedOptions.length > 0 && (
                            <div className="bg-sage-50 px-4 py-2 rounded-lg text-sage-700 text-sm font-medium max-w-md text-center border border-sage-200">
                                ✓ Detected: {detectedOptions.join(', ')}
                            </div>
                        )}
                    </div>

                    {/* Manual Selection Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentQuestion.options.map((option) => {
                            const isSelected = Array.isArray(responses[currentQuestion.id])
                                ? responses[currentQuestion.id]?.includes(option)
                                : responses[currentQuestion.id] === option;

                            return (
                                <button
                                    key={option}
                                    onClick={() => {
                                        // Toggle logic for manual click
                                        if (currentQuestion.type === 'checkbox') {
                                            const current = responses[currentQuestion.id] || [];
                                            const newSelection = current.includes(option)
                                                ? current.filter(o => o !== option)
                                                : [...current, option];
                                            setResponses({ ...responses, [currentQuestion.id]: newSelection });
                                        } else {
                                            setResponses({ ...responses, [currentQuestion.id]: option });
                                        }
                                    }}
                                    className={`p-4 rounded-xl text-left transition-all border-2 ${isSelected
                                        ? 'border-sage-500 bg-sage-50 text-sage-800 font-medium'
                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {isSelected && <CheckCircle className="w-5 h-5 text-sage-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            onClick={handleNext}
                            disabled={!responses[currentQuestion.id] || (Array.isArray(responses[currentQuestion.id]) && responses[currentQuestion.id].length === 0)}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
