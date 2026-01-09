/**
 * Cycle Prediction Engine
 * Predicts next menstrual cycle date and PMS window
 */

import { differenceInDays, addDays, parseISO } from 'date-fns';

/**
 * Predict next cycle start date
 * @param {Array} cycles - Array of cycle entries (sorted by startDate desc)
 * @returns {Object} - { nextCycleDate, pmsWindowStart, confidence, pattern }
 */
export const predictNextCycle = (cycles) => {
    if (!cycles || cycles.length < 3) {
        return {
            nextCycleDate: null,
            pmsWindowStart: null,
            confidence: 'low',
            pattern: 'insufficient_data',
            message: 'Need at least 3 cycles for accurate prediction',
            avgCycleLength: null,
            basedOnCycles: cycles?.length || 0,
        };
    }

    const sortedCycles = cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentCycles = sortedCycles.slice(0, 6); // Use up to 6 most recent cycles

    // Calculate cycle lengths using date-fns for accuracy
    const cycleLengths = [];
    for (let i = 0; i < recentCycles.length - 1; i++) {
        const current = parseISO(recentCycles[i].startDate);
        const next = parseISO(recentCycles[i + 1].startDate);
        const diffDays = differenceInDays(current, next);

        // Only include valid cycle lengths (21-45 days is normal range)
        if (diffDays >= 21 && diffDays <= 45) {
            cycleLengths.push(diffDays);
        }
    }

    if (cycleLengths.length < 2) {
        return {
            nextCycleDate: null,
            pmsWindowStart: null,
            confidence: 'low',
            pattern: 'insufficient_valid_data',
            message: 'Not enough valid cycle data (cycles should be 21-45 days)',
            avgCycleLength: null,
            basedOnCycles: cycleLengths.length,
        };
    }

    // Remove outliers using median absolute deviation
    const median = cycleLengths.sort((a, b) => a - b)[Math.floor(cycleLengths.length / 2)];
    const deviations = cycleLengths.map(len => Math.abs(len - median));
    const medianDeviation = deviations.sort((a, b) => a - b)[Math.floor(deviations.length / 2)];

    // Filter out cycles that are more than 2 MAD away from median
    const filteredLengths = cycleLengths.filter((len, i) =>
        deviations[i] <= 2 * medianDeviation || medianDeviation === 0
    );

    // Use weighted average (recent cycles weighted more heavily)
    const weights = filteredLengths.map((_, i) => Math.pow(0.85, i)); // Exponential decay
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const weightedAvg = filteredLengths.reduce((sum, len, i) =>
        sum + len * weights[i], 0) / totalWeight;

    // Calculate standard deviation for confidence
    const variance = filteredLengths.reduce((sum, len) =>
        sum + Math.pow(len - weightedAvg, 2), 0) / filteredLengths.length;
    const stdDev = Math.sqrt(variance);

    // Determine pattern regularity and confidence
    let pattern;
    let confidence;

    if (stdDev < 2 && filteredLengths.length >= 5) {
        pattern = 'very_regular';
        confidence = 'very_high';
    } else if (stdDev < 3 && filteredLengths.length >= 4) {
        pattern = 'regular';
        confidence = 'high';
    } else if (stdDev < 5) {
        pattern = 'fairly_regular';
        confidence = 'medium';
    } else if (stdDev < 8) {
        pattern = 'somewhat_irregular';
        confidence = 'low';
    } else {
        pattern = 'irregular';
        confidence = 'very_low';
    }

    // Predict next cycle date
    const lastCycleDate = parseISO(recentCycles[0].startDate);
    const nextCycleDate = addDays(lastCycleDate, Math.round(weightedAvg));

    // PMS window: 3-5 days before predicted start
    const pmsWindowStart = addDays(nextCycleDate, -4);

    return {
        nextCycleDate: nextCycleDate.toISOString(),
        pmsWindowStart: pmsWindowStart.toISOString(),
        avgCycleLength: Math.round(weightedAvg),
        stdDeviation: Math.round(stdDev * 10) / 10,
        pattern,
        confidence,
        basedOnCycles: filteredLengths.length,
        totalCyclesAnalyzed: cycleLengths.length,
        outliersRemoved: cycleLengths.length - filteredLengths.length,
    };
};

/**
 * Check if user is currently in PMS window
 * @param {Date} nextCycleDate 
 * @returns {boolean}
 */
export const isInPMSWindow = (nextCycleDate) => {
    if (!nextCycleDate) return false;

    const today = new Date();
    const cycleDate = new Date(nextCycleDate);
    const diffDays = (cycleDate - today) / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 3;
};

/**
 * Get personalized cycle insights
 * @param {Object} prediction 
 * @param {Array} symptomLogs 
 * @returns {Array} - Array of insight strings
 */
export const getCycleInsights = (prediction, symptomLogs) => {
    const insights = [];

    if (prediction.pattern === 'regular') {
        insights.push('Your cycle is very regular! This makes predictions more accurate.');
    } else if (prediction.pattern === 'irregular') {
        insights.push('Your cycle shows some irregularity. Consider tracking more factors to understand patterns.');
    }

    // Check symptom patterns around cycle
    const symptomTypes = {};
    symptomLogs?.forEach(log => {
        symptomTypes[log.symptomType] = (symptomTypes[log.symptomType] || 0) + 1;
    });

    const mostCommon = Object.entries(symptomTypes)
        .sort(([, a], [, b]) => b - a)[0];

    if (mostCommon && mostCommon[1] >= 3) {
        insights.push(`Your most frequent symptom is ${mostCommon[0].replace('_', ' ')}.`);
    }

    return insights;
};
