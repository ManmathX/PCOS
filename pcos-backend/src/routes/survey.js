import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Response normalization mappings - convert UI-friendly text to database values
const RESPONSE_MAPPINGS = {
    periodImpact: {
        "Completely normal": "normal",
        "A little disturbed but manageable": "manageable",
        "Quite irregular or difficult": "irregular",
        "Very problematic and affecting my daily life": "problematic"
    },
    activityLevel: {
        "0": "0",
        "1–2": "1-2",
        "3–4": "3-4",
        "5 or more": "5+"
    },
    sleepDuration: {
        "Less than 6 hours": "<6",
        "6–8 hours": "6-8",
        "More than 8 hours": ">8",
        "Very irregular": "irregular"
    },
    stressLevel: {
        "Low": "low",
        "Moderate": "moderate",
        "High": "high",
        "Very high": "very_high"
    },
    supplements: {
        "Rarely": "rarely",
        "1–2 times per week": "1-2",
        "3–4 times per week": "3-4",
        "Almost every day": "daily"
    },
    periodFrequency: {
        "Every 21–35 days": "21-35",
        "Often earlier than 21 days": "<21",
        "Often later than 35 days": ">35",
        "Sometimes skip for 2–3 months or more": "skip",
        "Not sure": "unsure"
    },
    bleedingDuration: {
        "1–3 days": "1-3",
        "4–7 days": "4-7",
        "More than 7 days": ">7"
    },
    flowIntensity: {
        "Very light": "light",
        "Normal": "normal",
        "Heavy": "heavy",
        "Very heavy with clots": "clots"
    },
    painLevel: {
        "No pain": "none",
        "Mild": "mild",
        "Moderate": "moderate",
        "Severe": "severe"
    },
    hirsutism: {
        "No": "no",
        "A little": "little",
        "Quite a lot": "lot"
    },
    pcosAwareness: {
        "Yes": "yes",
        "I have heard the name only": "heard_only",
        "No": "no"
    },
    confidence: {
        "Very confident": "very",
        "Somewhat confident": "somewhat",
        "Not very confident": "not_very",
        "Not at all confident": "not_at_all"
    },
    workshops: {
        "Yes, about menstrual health": "menstrual",
        "Yes, about PCOS": "pcos",
        "Yes, about both": "both",
        "No": "none"
    }
};

// Array field mappings for checkbox questions
const ARRAY_MAPPINGS = {
    reasons: {
        "Stress": "stress",
        "Sleep problems": "sleep",
        "Food / diet habits": "diet",
        "Weight changes": "weight",
        "Hormonal issues": "hormonal",
        "Family/genetic reasons": "genetic",
        "I don't know": "unknown",
        "Other": "other"
    },
    pmsCoping: {
        "Do nothing, just tolerate it": "tolerate",
        "Home remedies": "home_remedies",
        "Painkillers": "painkillers",
        "Visit a doctor": "doctor",
        "Take rest / skip activities": "rest",
        "Other": "other"
    },
    infoSource: {
        "Friends or family": "family",
        "Social media": "social_media",
        "School / college": "school",
        "Doctor or nurse": "doctor",
        "TV / newspapers": "news",
        "I have not heard about it": "none",
        "Other": "other"
    },
    symptomKnowledge: {
        "Irregular periods": "irregular_periods",
        "Unwanted thick hair": "hirsutism",
        "Acne": "acne",
        "Weight gain": "weight_gain",
        "Difficulty getting pregnant": "infertility",
        "I am not sure": "unsure"
    }
};

// Helper function to normalize a single response
function normalizeResponse(questionId, value) {
    if (!value) return value;

    // Handle array responses (checkbox questions)
    if (Array.isArray(value)) {
        const mapping = ARRAY_MAPPINGS[questionId];
        if (!mapping) return value;
        return value.map(v => mapping[v] || v);
    }

    // Handle single responses
    const mapping = RESPONSE_MAPPINGS[questionId];
    if (!mapping) return value;
    return mapping[value] || value;
}

// POST /api/survey
// Submit onboarding survey responses
router.post('/', async (req, res) => {
    try {
        const { userId, responses } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Normalize all responses before saving
        const normalizedResponses = {};
        for (const [key, value] of Object.entries(responses)) {
            normalizedResponses[key] = normalizeResponse(key, value);
        }

        // Map frontend response object to database schema
        const surveyData = {
            userId,
            periodImpact: normalizedResponses.periodImpact,
            reasons: normalizedResponses.reasons || [],
            pmsCoping: normalizedResponses.pmsCoping || [],
            activityLevel: normalizedResponses.activityLevel,
            sleepDuration: normalizedResponses.sleepDuration,
            stressLevel: normalizedResponses.stressLevel,
            supplements: normalizedResponses.supplements,
            periodFrequency: normalizedResponses.periodFrequency,
            bleedingDuration: normalizedResponses.bleedingDuration,
            flowIntensity: normalizedResponses.flowIntensity,
            painLevel: normalizedResponses.painLevel,
            hirsutism: normalizedResponses.hirsutism,
            pcosAwareness: normalizedResponses.pcosAwareness,
            infoSource: normalizedResponses.infoSource || [],
            symptomKnowledge: normalizedResponses.symptomKnowledge || [],
            confidence: normalizedResponses.confidence,
            workshops: normalizedResponses.workshops
        };

        const result = await prisma.onboardingSurvey.upsert({
            where: { userId },
            update: surveyData,
            create: surveyData
        });

        // Generate AI Report
        console.log("Generating AI Report for survey...");
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            // Use API Key from env (checking multiple sources)
            const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.ELEVENLABS_API_KEY;
            if (!apiKey) throw new Error("GEMINI_API_KEY not found in env");

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = headingPrompt(responses);
            const aiResult = await model.generateContent(prompt);
            const reportContent = aiResult.response.text();

            // Save Report
            const report = await prisma.aIReport.create({
                data: {
                    userId,
                    content: reportContent
                }
            });

            res.status(201).json({
                message: "Survey saved and report generated",
                data: result,
                reportId: report.id
            });

        } catch (aiError) {
            console.error("AI Generation Error:", aiError);
            res.status(201).json({
                message: "Survey saved but report generation failed",
                data: result,
                reportError: true
            });
        }

    } catch (error) {
        console.error("Survey Submission Error:", error);
        res.status(500).json({ error: "Failed to save survey", details: error.message });
    }
});

function headingPrompt(r) {
    return `
    You are an expert PCOS and women's health assistant. Analyze this user's onboarding survey data and provide a personalized "PCOS Health & Risk Report".

    User Data:
    - Period Impact: ${r.periodImpact}
    - Reasons: ${r.reasons?.join(', ')}
    - PMS Coping: ${r.pmsCoping?.join(', ')}
    - Activity Level: ${r.activityLevel} days/week
    - Sleep: ${r.sleepDuration}
    - Stress: ${r.stressLevel}
    - Supplements: ${r.supplements}
    - Cycle: ${r.periodFrequency}, Flow: ${r.flowIntensity}, Pain: ${r.painLevel}
    - Hirsutism: ${r.hirsutism}
    - Knowledge CONFIDENCE: ${r.confidence}

    Output Format (Markdown):
    # Your Personalized PCOS Health Report
    
    ## 🔍 Risk Assessment
    [Analyze their risk based on Hirsutism, Cycle Regularity, and Symptoms. valid values: Low, Moderate, High. Explain why.]

    ## 🩺 Key Insights
    - [Insight 1]
    - [Insight 2]
    - [Insight 3]

    ## 💡 Actionable Recommendations
    1. **Lifestyle**: [Specific tip based on activity/sleep]
    2. **Diet/Nutrition**: [Tip based on supplements/symptoms]
    3. **Medical**: [When to see a doctor based on pain/irregularity]

    ## 🌟 Next Steps using App
    [Suggest app features like "Log your cycle", "Try the diet tracker"]

    Tone: Empathetic, professional, encouraging, clear.
    `;
}

// GET /api/survey/:userId
// Check if user has completed survey
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const survey = await prisma.onboardingSurvey.findUnique({
            where: { userId }
        });
        res.json({ completed: !!survey, data: survey });
    } catch (error) {
        console.error("Survey Check Error:", error);
        res.status(500).json({ error: "Failed to check survey status" });
    }
});

// GET /api/survey/:userId/full
// Get complete survey data with AI report for dashboard
router.get('/:userId/full', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch survey data
        const survey = await prisma.onboardingSurvey.findUnique({
            where: { userId }
        });

        if (!survey) {
            return res.status(404).json({ error: "Survey not found" });
        }

        // Fetch latest AI report
        const latestReport = await prisma.aIReport.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            survey,
            report: latestReport,
            completed: true
        });
    } catch (error) {
        console.error("Survey Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch survey data" });
    }
});

export default router;
