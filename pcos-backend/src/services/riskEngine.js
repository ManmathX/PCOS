/**
 * PCOS Risk Scoring Engine
 * Rule-based algorithm with explainable outputs
 * Includes photo analysis metrics for comprehensive assessment
 */

import {
  calculatePhotoRiskScore,
  getPhotoMetricsTrend,
} from "./imageAnalysis.js";

/**
 * Calculate PCOS risk score for a user
 * @param {Object} userData - User health data
 * @returns {Object} - { score, riskLevel, reasons }
 */
/**
 * Calculate PCOS risk score for a user
 * @param {Object} userData - User health data
 * @returns {Object} - { score, riskLevel, reasons, breakdown }
 */
export const calculateRiskScore = (userData) => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const reasons = [];

  // Breakdown of score by category
  const breakdown = {
    cycleScore: 0,
    symptomScore: 0,
    painScore: 0,
    metabolicScore: 0,
    photoScore: 0,
  };

  // Factor 1: Cycle Irregularity (Max 35 points)
  maxPossibleScore += 35;
  if (userData.avgCycleLength) {
    if (userData.avgCycleLength > 45 || userData.avgCycleLength < 21) {
      breakdown.cycleScore = 35;
      reasons.push("Significantly irregular cycles (>45 or <21 days)");
    } else if (userData.avgCycleLength > 35) {
      breakdown.cycleScore = 20;
      reasons.push("Long cycles (35-45 days)");
    } else {
      // Regular cycle gets 0 risk points
    }
  } else {
    // No cycle data yet, assume neutral/partial risk or scale later
    // For now, we don't add to score, but it effectively lowers the "confidence"
    // In a strict percentage model, we might exclude this from maxPosibleScore if we want "risk per available data"
    // Let's stick to additive for now but handle "no data" in the route
    maxPossibleScore -= 35; // Remove from total if no data, to calculate percentage
  }

  // Factor 2: Symptoms & Hyperandrogenism (Max 30 points)
  // Acne, Hair Loss, Hirsutism
  maxPossibleScore += 30;
  const symptoms = userData.symptoms || [];

  if (symptoms.includes('hirsutism') || (userData.photoAnalysis?.facialHairScore > 4)) {
    breakdown.symptomScore += 15;
    reasons.push("Signs of hirsutism (excess hair growth)");
  }

  if (symptoms.includes('acne') || (userData.photoAnalysis?.acneSeverity > 4)) {
    breakdown.symptomScore += 10;
    if (!reasons.includes("Acne indications")) reasons.push("Acne indications");
  }

  if (symptoms.includes('hair_loss')) {
    breakdown.symptomScore += 10;
    reasons.push("Hair loss/thinning reported");
  }

  // Cap symptom score
  breakdown.symptomScore = Math.min(breakdown.symptomScore, 30);


  // Factor 3: Metabolic & BMI (Max 20 points)
  if (userData.currentBMI !== null) {
    maxPossibleScore += 20;
    if (userData.currentBMI > 30) {
      breakdown.metabolicScore += 20;
      reasons.push("BMI indicates obesity (>30)");
    } else if (userData.currentBMI > 25) {
      breakdown.metabolicScore += 10;
      reasons.push("BMI indicates overweight (>25)");
    }

    if (userData.familyHistoryDiabetes) {
      breakdown.metabolicScore += 5; // Bonus points (cap check needed if we were strict)
      reasons.push("Family history of diabetes");
    }
    breakdown.metabolicScore = Math.min(breakdown.metabolicScore, 20);
  } else if (userData.familyHistoryDiabetes) {
    // Only partial data available
    maxPossibleScore += 10;
    breakdown.metabolicScore += 10;
    reasons.push("Family history of diabetes");
  }


  // Factor 4: Pain & Inflammation (Max 15 points)
  maxPossibleScore += 15;
  if (userData.painSpikeDetected) {
    breakdown.painScore += 15;
    reasons.push("Significant menstrual pain spikes");
  } else if (userData.avgPainLevel > 7) {
    breakdown.painScore += 10;
    reasons.push("High average menstrual pain");
  } else if (userData.avgPainLevel > 4) {
    breakdown.painScore += 5;
  }

  // Calculate Total & Percentage
  totalScore = breakdown.cycleScore + breakdown.symptomScore + breakdown.metabolicScore + breakdown.painScore;

  // Normalize to 0-100 scale based on available data
  let normalizedScore = 0;
  if (maxPossibleScore > 0) {
    normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
  }

  // Determine risk level based on normalized percentage
  let riskLevel;
  if (normalizedScore < 30) {
    riskLevel = "LOW";
  } else if (normalizedScore < 60) {
    riskLevel = "MODERATE";
  } else {
    riskLevel = "HIGH";
  }

  return {
    score: normalizedScore, // 0-100
    riskLevel,
    reasons,
    breakdown,
    confidence: maxPossibleScore > 60 ? 'high' : 'medium', // Simple confidence metric
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

  const sortedCycles = cycles.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
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

  const sortedCycles = cycles.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  const recentPain = sortedCycles.slice(0, 3).map((c) => c.painLevel || 0);
  const olderPain = sortedCycles.slice(3, 6).map((c) => c.painLevel || 0);

  if (olderPain.length === 0) return false;

  const recentAvg = recentPain.reduce((a, b) => a + b, 0) / recentPain.length;
  const olderAvg = olderPain.reduce((a, b) => a + b, 0) / olderPain.length;

  return recentAvg - olderAvg >= 3; // Spike if increase by 3+ points
};
