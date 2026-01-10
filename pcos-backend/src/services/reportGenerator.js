import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Generate Appointment Preparation Pack content
 * @param {string} userId 
 * @returns {Promise<Object>} - { summary, questions, timeline }
 */
export const generateAppointmentPrep = async (userId) => {
    // 1. Fetch User Data
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Recent Risk Scores
    const latestRisk = await prisma.riskScore.findFirst({
        where: { userId },
        orderBy: { calculatedAt: 'desc' },
    });

    // Recent Symptoms (Last 30 days)
    const symptoms = await prisma.symptomLog.findMany({
        where: {
            userId,
            date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        orderBy: { date: 'desc' }
    });

    // Recent Cycles
    const cycles = await prisma.cycleEntry.findMany({
        where: { userId },
        orderBy: { startDate: 'desc' },
        take: 3
    });

    // 2. Aggregate Data for Prompt
    const symptomList = symptoms.map(s => `${s.date.toISOString().split('T')[0]}: ${s.symptomType} (${s.severity}/10)`).join('\n');
    const cycleSummary = cycles.map(c =>
        `Start: ${c.startDate.toISOString().split('T')[0]}, Length: ${c.endDate ? Math.floor((new Date(c.endDate) - new Date(c.startDate)) / (1000 * 60 * 60 * 24)) + ' days' : 'Ongoing'}`
    ).join('\n');

    const prompt = `
    Act as an expert medical assistant for a PCOS patient.
    Generate a concise "Appointment Preparation Pack" for their upcoming doctor visit.
    
    Patient Data:
    - Name: ${user.firstName}
    - Age/Profile: (Check user details if available, else omit)
    - Latest PCOS Risk Score: ${latestRisk ? `${latestRisk.score}/100 (${latestRisk.riskLevel})` : 'Not assessed'}
    - Key Risk Factors: ${latestRisk ? latestRisk.reasons.join(', ') : 'N/A'}
    
    Recent Symptoms (Last 30 Days):
    ${symptomList || "No symptoms logged."}

    Recent Cycles:
    ${cycleSummary || "No cycles tracked."}

    Output must be valid JSON with the following structure:
    {
        "patientSummary": "A professional 3-4 sentence medical summary of the patient's current status, cycle regularity, and primary symptom burden.",
        "symptomTimeline": "A bulleted list of significant symptom patterns (e.g., 'Frequent acne flare-ups in luteal phase', 'High pain reported on day 1').",
        "keyConcerns": ["Concern 1", "Concern 2"],
        "questionsForDoctor": [
            "Question 1 (specific to their data)", 
            "Question 2", 
            "Question 3", 
            "Question 4", 
            "Question 5"
        ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Generation Failed:", error);
        // Fallback data
        return {
            patientSummary: "Unable to generate summary at this time.",
            symptomTimeline: "Please discuss your symptom log directly with your doctor.",
            keyConcerns: ["Irregular cycles", "Symptom management"],
            questionsForDoctor: [
                "What typically causes my specific symptoms?",
                "Are there lifestyle changes I should prioritize?",
                "Do I need further testing (bloodwork/ultrasound)?",
                "What are my treatment options?",
                "When should I follow up next?"
            ]
        };
    }
};
