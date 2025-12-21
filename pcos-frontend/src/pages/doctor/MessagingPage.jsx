import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MessageCircle, Send, User, Wifi, WifiOff, Search } from 'lucide-react';
import { formatDistance } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

export const MessagingPage = () => {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [wsConnected, setWsConnected] = useState(false);
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const currentUserId = localStorage.getItem('userId') || localStorage.getItem('token')?.split('.')[1];

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // WebSocket setup
    useEffect(() => {
        if (!WS_URL) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setWsConnected(true);

            // Subscribe to user's personal channel
            ws.send(JSON.stringify({
                type: 'subscribe',
                channel: `doctor-${currentUserId}`,
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Handle incoming messages
                if (data.type === 'message' && data.message) {
                    const msg = data.message;

                    // Refetch messages if it's for current conversation
                    if (selectedUser && (msg.senderId === selectedUser || msg.receiverId === selectedUser)) {
                        queryClient.invalidateQueries(['messages', selectedUser]);
                    }

                    // Always refetch conversations to update unread counts
                    queryClient.invalidateQueries(['conversations']);
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setWsConnected(false);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setWsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, [currentUserId, selectedUser, queryClient]);

    // Fetch conversations
    const { data: conversationsData } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
    });

    // Fetch messages with selected user
    const { data: messagesData } = useQuery({
        queryKey: ['messages', selectedUser],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/messages/${selectedUser}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        enabled: !!selectedUser,
    });

    // Scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messagesData]);

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: async ({ receiverId, content }) => {
            const response = await axios.post(`${API_URL}/messages`, { receiverId, content }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Broadcast message via WebSocket
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'message',
                    channel: `doctor-${selectedUser}`,
                    message: data.data,
                }));
            }

            queryClient.invalidateQueries(['messages', selectedUser]);
            queryClient.invalidateQueries(['conversations']);
            setNewMessage('');
        },
    });

    const conversations = conversationsData?.conversations || [];
    const messages = messagesData?.messages || [];

    // Filter conversations based on search query
    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const fullName = `${conv.partner.firstName} ${conv.partner.lastName}`.toLowerCase();
        const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || '';
        return fullName.includes(query) || lastMessageContent.includes(query);
    });

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return;
        sendMessageMutation.mutate({ receiverId: selectedUser, content: newMessage });
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
            {/* Connection Status */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                <div className={`flex items-center text-sm ${wsConnected ? 'text-green-600' : 'text-gray-400'}`}>
                    {wsConnected ? (
                        <>
                            <Wifi className="w-4 h-4 mr-1" />
                            <span>Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4 mr-1" />
                            <span>Offline</span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Conversations List */}
                <div className="md:col-span-1 flex flex-col">
                    {/* Search Input */}
                    <div className="mb-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 text-sm"
                        />
                    </div>

                    {/* Conversations */}
                    <div className="space-y-2 flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 && searchQuery ? (
                            <div className="card p-6 text-center">
                                <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-600">No conversations found</p>
                                <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.partner.id}
                                    onClick={() => setSelectedUser(conv.partner.id)}
                                    className={`card p-3 cursor-pointer transition-colors ${selectedUser === conv.partner.id ? 'bg-soft-pink-100 border-soft-pink-300' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-sage-600" />
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm truncate">
                                                    Dr. {conv.partner.firstName} {conv.partner.lastName}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-soft-pink-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            {conv.lastMessage && (
                                                <>
                                                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDistance(new Date(conv.lastMessage.createdAt), new Date(), { addSuffix: true })}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {conversations.length === 0 && !searchQuery && (
                            <div className="card p-6 text-center">
                                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-600">No conversations yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-2 flex flex-col min-h-0">
                    {selectedUser ? (
                        <>
                            <div className="card p-4 mb-4 flex-shrink-0">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-sage-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            Dr. {conversations.find(c => c.partner.id === selectedUser)?.partner.firstName}{' '}
                                            {conversations.find(c => c.partner.id === selectedUser)?.partner.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3 min-h-0">
                                {messages.map((msg) => {
                                    const isSent = msg.senderId === currentUserId || msg.senderId !== selectedUser;
                                    return (
                                        <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSent ? 'bg-sage-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="card p-4 flex items-center space-x-2 flex-shrink-0">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && newMessage.trim()) {
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                                    className="btn-primary px-4 py-2 disabled:opacity-50 flex items-center"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="card p-12 text-center flex-1 flex items-center justify-center">
                            <div>
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-600">Select a conversation to start messaging</p>
                                <p className="text-sm text-gray-500 mt-2">Messages are delivered in real-time</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
