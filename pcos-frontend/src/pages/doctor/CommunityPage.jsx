import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Plus, MessageSquare, Lock, Unlock, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CommunityPage = () => {
    const queryClient = useQueryClient();
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCommunity, setNewCommunity] = useState({ name: '', description: '', isPrivate: false });
    const [newPost, setNewPost] = useState('');

    // Fetch communities
    const { data: communitiesData } = useQuery({
        queryKey: ['communities'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/communities`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
    });

    // Fetch community details
    const { data: communityData } = useQuery({
        queryKey: ['community', selectedCommunity],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/communities/${selectedCommunity}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        enabled: !!selectedCommunity,
    });

    // Create community mutation
    const createCommunityMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/communities`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['communities']);
            setShowCreateForm(false);
            setNewCommunity({ name: '', description: '', isPrivate: false });
        },
    });

    // Join community mutation
    const joinCommunityMutation = useMutation({
        mutationFn: async (communityId) => {
            const response = await axios.post(`${API_URL}/communities/${communityId}/join`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['communities']);
            queryClient.invalidateQueries(['community', selectedCommunity]);
        },
    });

    // Post mutation
    const createPostMutation = useMutation({
        mutationFn: async ({ communityId, content }) => {
            const response = await axios.post(`${API_URL}/communities/${communityId}/posts`, { content }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['community', selectedCommunity]);
            setNewPost('');
        },
    });

    const communities = communitiesData?.communities || [];
    const community = communityData?.community;

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full max-h-[calc(100vh-200px)]">
            {/* Communities List */}
            <div className="md:col-span-1 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Communities</h3>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn-secondary px-3 py-1 text-sm flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        New
                    </button>
                </div>

                {showCreateForm && (
                    <div className="card p-4">
                        <input
                            type="text"
                            placeholder="Community Name"
                            value={newCommunity.name}
                            onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded mb-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={newCommunity.description}
                            onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded mb-2"
                            rows="2"
                        />
                        <label className="flex items-center text-sm mb-2">
                            <input
                                type="checkbox"
                                checked={newCommunity.isPrivate}
                                onChange={(e) => setNewCommunity({ ...newCommunity, isPrivate: e.target.checked })}
                                className="mr-2"
                            />
                            Private Community
                        </label>
                        <button
                            onClick={() => createCommunityMutation.mutate(newCommunity)}
                            className="btn-primary w-full text-sm"
                            disabled={!newCommunity.name}
                        >
                            Create Community
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {communities.map((comm) => (
                        <div
                            key={comm.id}
                            onClick={() => setSelectedCommunity(comm.id)}
                            className={`card p-3 cursor-pointer transition-colors ${selectedCommunity === comm.id ? 'bg-sage-100 border-sage-300' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <h4 className="font-semibold text-sm">{comm.name}</h4>
                                        {comm.isPrivate && <Lock className="w-3 h-3 ml-1 text-gray-500" />}
                                    </div>
                                    {comm.description && <p className="text-xs text-gray-600">{comm.description}</p>}
                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                        <Users className="w-3 h-3 mr-1" />
                                        {comm._count.members} members
                                        <MessageSquare className="w-3 h-3 ml-2 mr-1" />
                                        {comm._count.posts} posts
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community Detail */}
            <div className="md:col-span-2 flex flex-col">
                {selectedCommunity && community ? (
                    <>
                        <div className="card p-4 mb-4">
                            <h2 className="text-xl font-bold mb-2">{community.name}</h2>
                            {community.description && <p className="text-sm text-gray-600 mb-3">{community.description}</p>}
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-1" />
                                {community.members?.length || 0} members
                            </div>
                        </div>

                        {/* New Post */}
                        <div className="card p-4 mb-4">
                            <textarea
                                placeholder="Share something with the community..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="w-full px-3 py-2 border rounded mb-2"
                                rows="3"
                            />
                            <button
                                onClick={() => createPostMutation.mutate({ communityId: selectedCommunity, content: newPost })}
                                className="btn-primary flex items-center"
                                disabled={!newPost.trim()}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Post
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {community.posts?.map((post) => (
                                <div key={post.id} className="card p-4">
                                    <div className="flex items-start mb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">
                                                Dr. {post.author.firstName} {post.author.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {post._count.replies} {post._count.replies === 1 ? 'reply' : 'replies'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="card p-12 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600">Select a community to view posts and discussions</p>
                    </div>
                )}
            </div>
        </div>
    );
};
