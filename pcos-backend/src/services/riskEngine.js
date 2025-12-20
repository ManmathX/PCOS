/**
 * PCOS Risk Scoring Engine
 * Rule-based algorithm with explainable outputs
 */

/**
 * Calculate PCOS risk score for a user
 * @param {Object} userData - User health data
 * @returns {Object} - { score, riskLevel, reasons }
 */
export const calculateRiskScore = (userData) => {
    let score = 0;
    const reasons = [];
    const maxScore = 100;

    // Factor 1: Cycle Irregularity (30 points max)
    if (userData.avgCycleLength) {
        if (userData.avgCycleLength > 45) {
            score += 30;
            reasons.push('Cycle length >45 days (irregular)');
        } else if (userData.avgCycleLength > 35) {
            score += 20;
            reasons.push('Cycle length 35-45 days (slightly irregular)');
        }
    }

    // Factor 2: BMI Trends (20 points max)
    if (userData.bmiTrend === 'increasing' && userData.currentBMI > 25) {
        score += 20;
        reasons.push('BMI increasing trend (>25)');
    } else if (userData.currentBMI > 30) {
        score += 15;
        reasons.push('BMI >30');
    }

    // Factor 3: Symptom Clustering (25 points max)
    const symptomCount = userData.symptoms ? userData.symptoms.length : 0;
    const hasAcne = userData.symptoms?.includes('acne');
    const hasHairLoss = userData.symptoms?.includes('hair_loss');
    const hasMoodSwings = userData.symptoms?.includes('mood_swings');

    if (hasAcne && hasHairLoss) {
        score += 15;
        reasons.push('Acne + hair loss (hormonal indicators)');
    }

    if (symptomCount >= 4) {
        score += 10;
        reasons.push(`Multiple symptoms present (${symptomCount})`);
    }

    // Factor 4: Pain Spike Detection (15 points max)
    if (userData.painSpikeDetected) {
        score += 15;
        reasons.push('Sudden increase in pain levels');
    } else if (userData.avgPainLevel > 7) {
        score += 10;
        reasons.push('High average pain level (>7/10)');
    }

    // Factor 5: Family History (10 points max)
    if (userData.familyHistoryDiabetes) {
        score += 10;
        reasons.push('Family history of diabetes');
    }

    // Cap score at maxScore
    score = Math.min(score, maxScore);

    // Determine risk level
    let riskLevel;
    if (score < 30) {
        riskLevel = 'LOW';
    } else if (score < 60) {
        riskLevel = 'MODERATE';
    } else {
        riskLevel = 'HIGH';
    }

    return {
        score,
        riskLevel,
        reasons,
        calculatedAt: new Date(),
    };
};

/**
 * Calculate average cycle length from recent cycles
 * @param {Array} cycles - Array of cycle entries
 * @returns {number} - Average cycle length in days
 */
export const calculateAvgCycleLength = (cycles) => {
    if (!cycles || cycles.length < 2) return null;

    const sortedCycles = cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentCycles = sortedCycles.slice(0, 6); // Last 6 cycles

    let totalLength = 0;
    let count = 0;

    for (let i = 0; i < recentCycles.length - 1; i++) {
        const current = new Date(recentCycles[i].startDate);
        const next = new Date(recentCycles[i + 1].startDate);
        const diffDays = Math.abs((current - next) / (1000 * 60 * 60 * 24));
        totalLength += diffDays;
        count++;
    }

    return count > 0 ? Math.round(totalLength / count) : null;
};

/**
 * Detect pain spike in recent data
 * @param {Array} cycles - Recent cycle entries
 * @returns {boolean}
 */
export const detectPainSpike = (cycles) => {
    if (!cycles || cycles.length < 3) return false;

    const sortedCycles = cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentPain = sortedCycles.slice(0, 3).map(c => c.painLevel || 0);
    const olderPain = sortedCycles.slice(3, 6).map(c => c.painLevel || 0);

    if (olderPain.length === 0) return false;

    const recentAvg = recentPain.reduce((a, b) => a + b, 0) / recentPain.length;
    const olderAvg = olderPain.reduce((a, b) => a + b, 0) / olderPain.length;

    return recentAvg - olderAvg >= 3; // Spike if increase by 3+ points
};
