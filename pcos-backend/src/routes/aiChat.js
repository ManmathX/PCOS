import express from 'express';
import mediSearchService from '../services/mediSearchService.js';

const router = express.Router();

/**
 * POST /ai-chat/ask
 * Ask a medical question to the AI
 */
router.post('/ask', async (req, res) => {
    try {
        const { question, settings } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Set response headers for Server-Sent Events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        // Get response from MediSearch
        const apiResponse = await mediSearchService.askQuestion(question, settings);

        // Stream the response
        apiResponse.body.on('data', (chunk) => {
            const text = chunk.toString();
            res.write(text);
        });

        apiResponse.body.on('end', () => {
            res.end();
        });

        apiResponse.body.on('error', (error) => {
            console.error('Stream error:', error);
            res.write(`data: ${JSON.stringify({ event: 'error', data: error.message })}\n\n`);
            res.end();
        });

    } catch (error) {
        console.error('AI chat error:', error);

        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process AI request' });
        } else {
            res.write(`data: ${JSON.stringify({ event: 'error', data: error.message })}\n\n`);
            res.end();
        }
    }
});

export default router;
