/**
 * Cycle Prediction Engine
 * Predicts next menstrual cycle date and PMS window
 */

/**
 * Predict next cycle start date
 * @param {Array} cycles - Array of cycle entries (sorted by startDate desc)
 * @returns {Object} - { nextCycleDate, pmsWindowStart, confidence, pattern }
 */
export const predictNextCycle = (cycles) => {
    if (!cycles || cycles.length < 2) {
        return {
            nextCycleDate: null,
            pmsWindowStart: null,
            confidence: 'low',
            pattern: 'insufficient_data',
            message: 'Need at least 2 cycles for prediction',
        };
    }

    const sortedCycles = cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentCycles = sortedCycles.slice(0, 6);

    // Calculate cycle lengths
    const cycleLengths = [];
    for (let i = 0; i < recentCycles.length - 1; i++) {
        const current = new Date(recentCycles[i].startDate);
        const next = new Date(recentCycles[i + 1].startDate);
        const diffDays = Math.abs((current - next) / (1000 * 60 * 60 * 24));
        cycleLengths.push(diffDays);
    }

    // Calculate average and standard deviation
    const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);

    // Determine pattern regularity
    let pattern;
    let confidence;

    if (stdDev < 3) {
        pattern = 'regular';
        confidence = 'high';
    } else if (stdDev < 7) {
        pattern = 'fairly_regular';
        confidence = 'medium';
    } else {
        pattern = 'irregular';
        confidence = 'low';
    }

    // Predict next cycle date
    const lastCycleDate = new Date(recentCycles[0].startDate);
    const nextCycleDate = new Date(lastCycleDate);
    nextCycleDate.setDate(nextCycleDate.getDate() + Math.round(avgLength));

    // PMS window: 2-3 days before predicted start
    const pmsWindowStart = new Date(nextCycleDate);
    pmsWindowStart.setDate(pmsWindowStart.getDate() - 3);

    return {
        nextCycleDate: nextCycleDate.toISOString(),
        pmsWindowStart: pmsWindowStart.toISOString(),
        avgCycleLength: Math.round(avgLength),
        stdDeviation: Math.round(stdDev * 10) / 10,
        pattern,
        confidence,
        basedOnCycles: cycleLengths.length,
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
