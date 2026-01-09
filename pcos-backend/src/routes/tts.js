import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/tts - Proxy ElevenLabs TTS requests
router.post('/', async (req, res) => {
    try {
        const { text, voiceId } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID = voiceId || 'pNInz6obpgDQGcFmaJgB'; // Default voice ID

        if (!ELEVENLABS_API_KEY) {
            return res.status(500).json({ error: 'ElevenLabs API key not configured' });
        }

        // Make request to ElevenLabs API
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text,
                model_id: 'eleven_turbo_v2_5',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        // Send audio back to frontend
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data));

    } catch (error) {
        console.error('TTS Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to generate speech',
            details: error.response?.data || error.message
        });
    }
});

export default router;
