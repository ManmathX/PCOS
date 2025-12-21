import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AIChatPage = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Hello! I\'m your AI medical research assistant. Ask me evidence-based questions about PCOS, treatments, or related medical conditions.',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [currentResponse, setCurrentResponse] = useState('');
    const [articles, setArticles] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);
        setCurrentResponse('');
        setArticles([]);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/ai-chat/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ question: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                buffer += text;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ')) {
                        try {
                            const content = trimmedLine.substring(6);
                            const message = JSON.parse(content);

                            if (message.event === 'llm_response') {
                                fullResponse = message.data || fullResponse;
                                setCurrentResponse(fullResponse);
                            } else if (message.event === 'articles') {
                                setArticles(message.data || []);
                            } else if (message.event === 'error') {
                                setError(message.data || 'Unknown error');
                            }
                        } catch (parseError) {
                            console.error('Parse error:', parseError);
                        }
                    }
                }
            }

            // Add final response
            if (fullResponse) {
                setMessages(prev => [...prev, { role: 'assistant', content: fullResponse, articles }]);
            }
            setCurrentResponse('');
        } catch (error) {
            console.error('AI chat error:', error);
            setError('Failed to get AI response. Please try again.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        'What are the latest treatments for PCOS?',
        'How does insulin resistance relate to PCOS?',
        'What lifestyle changes help manage PCOS symptoms?',
        'Latest research on PCOS and fertility',
    ];

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Medical Assistant</h2>
                <p className="text-gray-600 text-sm">Evidence-based medical information powered by MediSearch</p>
            </div>

            <div className="medical-disclaimer mb-4">
                <p className="text-xs font-medium">
                    🤖 AI-generated responses are for informational purposes only. Always verify with current medical literature.
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-soft-pink-100' : 'bg-sage-100'}`}>
                                {msg.role === 'user' ? (
                                    <User className="w-5 h-5 text-soft-pink-600" />
                                ) : (
                                    <Bot className="w-5 h-5 text-sage-600" />
                                )}
                            </div>
                            <div className={`flex-1 ${msg.role === 'user' ? 'bg-soft-pink-50' : 'bg-sage-50'} rounded-lg p-3`}>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                                {msg.articles && msg.articles.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-sage-200">
                                        <p className="text-xs font-semibold text-sage-700 mb-2">📚 Sources:</p>
                                        <div className="space-y-2">
                                            {msg.articles.map((article, i) => (
                                                <div key={i} className="text-xs text-gray-700">
                                                    <p className="font-medium">{i + 1}. {article.title}</p>
                                                    {article.authors && <p className="text-gray-600">Authors: {article.authors.join(', ')}</p>}
                                                    {article.journal && <p className="text-gray-600">Journal: {article.journal}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Current streaming response */}
                {currentResponse && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-3xl">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-sage-100">
                                <Bot className="w-5 h-5 text-sage-600" />
                            </div>
                            <div className="flex-1 bg-sage-50 rounded-lg p-3">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{currentResponse}</p>
                                <Loader2 className="w-4 h-4 mt-2 text-sage-600 animate-spin" />
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && !currentResponse && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-sage-100">
                                <Bot className="w-5 h-5 text-sage-600" />
                            </div>
                            <div className="bg-sage-50 rounded-lg p-3">
                                <Loader2 className="w-5 h-5 text-sage-600 animate-spin" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Suggested questions */}
            {messages.length === 1 && (
                <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(q)}
                                className="text-xs px-3 py-1 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-full transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input form */}
            <form onSubmit={handleAsk} className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a medical question..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Ask
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
