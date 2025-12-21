import fetch from 'node-fetch';

class MediSearchService {
    constructor() {
        this.apiKey = process.env.MEDISEARCH_API_KEY;
        this.baseUrl = 'https://api.backend.medisearch.io';
        this.sseEndpoint = `${this.baseUrl}/sse/medichat`;
    }

    generateConversationId() {
        return Array(32)
            .fill(0)
            .map(() => Math.floor(Math.random() * 36).toString(36))
            .join('');
    }

    async askQuestion(question, settings = {}) {
        const defaultSettings = {
            language: 'English',
            model_type: 'pro',
            filters: {
                sources: ['scientificArticles', 'internationalHealthGuidelines', 'medicineGuidelines'],
                article_types: ['metaAnalysis', 'reviews', 'clinicalTrials'],
                only_high_quality: true,
            },
        };

        const finalSettings = { ...defaultSettings, ...settings };
        const conversationId = this.generateConversationId();

        const payload = {
            event: 'user_message',
            conversation: [question],
            key: this.apiKey,
            id: conversationId,
            settings: finalSettings,
        };

        try {
            const response = await fetch(this.sseEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Connection': 'keep-alive',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`MediSearch API error: ${response.status} - ${errorText}`);
            }

            return response;
        } catch (error) {
            console.error('MediSearch service error:', error);
            throw error;
        }
    }
}

export default new MediSearchService();
