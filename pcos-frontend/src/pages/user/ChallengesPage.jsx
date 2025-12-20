import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Trophy, Target, Calendar, Zap } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChallengeCard = ({ challenge, userChallenge, onJoin }) => {
    const isActive = !!userChallenge;
    const isCompleted = userChallenge?.completed;

    const daysRemaining = userChallenge
        ? Math.max(0, differenceInDays(new Date(userChallenge.endDate), new Date()))
        : challenge.duration;

    return (
        <div className={`card ${isCompleted ? 'bg-green-50 border-2 border-green-400' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{challenge.name}</h3>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                {isCompleted && <Trophy className="w-8 h-8 text-yellow-500" />}
            </div>

            <div className="bg-sage-50 p-3 rounded-lg mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">💡 PCOS Benefit</p>
                <p className="text-sm text-gray-700">{challenge.pcosConnection}</p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{challenge.duration} days</span>
                    </div>
                    {isActive && !isCompleted && (
                        <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-semibold">{daysRemaining} days left</span>
                        </div>
                    )}
                </div>

                {!isActive && (
                    <button
                        onClick={() => onJoin(challenge.id)}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Join Challenge
                    </button>
                )}

                {isActive && !isCompleted && (
                    <span className="text-sm font-medium text-sage-600">In Progress...</span>
                )}

                {isCompleted && (
                    <span className="text-sm font-bold text-green-600">✓ Completed!</span>
                )}
            </div>
        </div>
    );
};

export const ChallengesPage = () => {
    const queryClient = useQueryClient();

    const { data: challengesData } = useQuery({
        queryKey: ['challenges'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/challenges`);
            return response.data;
        },
    });

    const { data: myChallengesData } = useQuery({
        queryKey: ['challenges', 'my'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/challenges/my`);
            return response.data;
        },
    });

    const joinChallengeMutation = useMutation({
        mutationFn: async (challengeId) => {
            const response = await axios.post(`${API_URL}/challenges/join`, { challengeId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['challenges']);
        },
    });

    const challenges = challengesData?.challenges || [];
    const myChallenges = myChallengesData?.userChallenges || [];

    // Map challenges to user challenges
    const challengesWithStatus = challenges.map(challenge => ({
        ...challenge,
        userChallenge: myChallenges.find(uc => uc.challengeId === challenge.id),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">PCOS Challenges</h2>
                <p className="text-gray-600">Join healthy lifestyle challenges designed for PCOS management</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    🎯 Challenges help build sustainable habits. Start small and stay consistent!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {challengesWithStatus.length === 0 && (
                    <div className="col-span-2 card text-center py-8">
                        <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No challenges available yet. Check back soon!</p>
                    </div>
                )}

                {challengesWithStatus.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userChallenge={challenge.userChallenge}
                        onJoin={(id) => joinChallengeMutation.mutate(id)}
                    />
                ))}
            </div>
        </div>
    );
};
