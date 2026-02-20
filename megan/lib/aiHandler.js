const axios = require('axios');

class AIHandler {
    constructor(bot) {
        this.bot = bot;
        
        // EliteProTech API base
        this.eliteProTechBase = "https://eliteprotech-apis.zone.id";
        
        // Megan chat history storage (auto-clear after 10 minutes)
        this.meganHistory = new Map();
        this.maxHistory = 10;
        
        // Start cleanup interval
        this.startCleanupInterval();
    }
    
    // Start auto-cleanup for Megan history (every 10 minutes)
    startCleanupInterval() {
        setInterval(() => {
            this.cleanupOldHistory();
        }, 10 * 60 * 1000);
    }
    
    // Cleanup old history
    cleanupOldHistory() {
        const now = Date.now();
        const tenMinutesAgo = now - (10 * 60 * 1000);
        
        for (const [userId, history] of this.meganHistory.entries()) {
            const filtered = history.filter(msg => msg.timestamp > tenMinutesAgo);
            if (filtered.length === 0) {
                this.meganHistory.delete(userId);
            } else {
                this.meganHistory.set(userId, filtered);
            }
        }
    }
    
    // ==================== MEGAN AI (Cloudflare - with memory) ====================
    
    async meganAI(message, userId) {
        try {
            const url = "https://late-salad-9d56.youngwanga254.workers.dev";
            
            // Create context-aware prompt with history
            const contextPrompt = this.createMeganPrompt(userId, message);
            
            const response = await axios({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: { prompt: contextPrompt, model: '@cf/meta/llama-3.1-8b-instruct' },
                timeout: 20000
            });
            
            let result = response.data?.data?.response || response.data || "I'm here to help!";
            
            // Add to Megan history
            this.addToMeganHistory(userId, 'assistant', result);
            
            return result;
        } catch (error) {
            console.error("Megan AI error:", error.message);
            return "I'm here to help! Please try again.";
        }
    }
    
    createMeganPrompt(userId, message) {
        const history = this.getMeganHistory(userId);
        
        if (history.length === 0) {
            return `You are Megan AI, a helpful assistant. Be friendly, helpful, and concise.\n\nUser: ${message}`;
        }
        
        let context = "Conversation history:\n\n";
        history.forEach(msg => {
            const role = msg.role === 'user' ? 'User' : 'Megan';
            context += `${role}: ${msg.content}\n`;
        });
        
        context += `\nUser: ${message}`;
        return context;
    }
    
    // ==================== ELITEPROTECH AI ENDPOINTS ====================
    
    // 1. Copilot - Fast auto response (WORKING)
    async copilotAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/copilot`,
                params: { q: message },
                timeout: 15000
            });
            
            return response.data?.text || "Hello! How can I help you?";
        } catch (error) {
            console.error("Copilot error:", error.message);
            return "I'm here to help! Please try again.";
        }
    }
    
    // 2. ChatGPT - Standard GPT (WORKING)
    async chatgptAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/chatgpt`,
                params: { prompt: message },
                timeout: 15000
            });
            
            return response.data?.response || "Hello! How can I assist you today?";
        } catch (error) {
            console.error("ChatGPT error:", error.message);
            return "ChatGPT service unavailable. Please try again.";
        }
    }
    
    // 3. GPT Fast - Using talk-ai endpoint (FIXED)
    async gptfastAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/talk-ai`,
                params: { prompt: message },
                timeout: 15000
            });
            
            return response.data?.response || "Hi there! How can I help?";
        } catch (error) {
            console.error("GPT Fast error:", error.message);
            return "Fast AI service unavailable. Please try again.";
        }
    }
    
    // 4. Gemini - Standard Gemini (FIXED timeout)
    async geminiAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/gemini`,
                params: { prompt: message },
                timeout: 30000 // Increased timeout for Gemini
            });
            
            return response.data?.text || "Hello! How can I assist you?";
        } catch (error) {
            console.error("Gemini error:", error.message);
            return "Gemini AI is currently busy. Please try again in a moment.";
        }
    }
    
    // 5. Gemini Fast - Same as gemini (FIXED timeout)
    async geminifastAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/gemini`,
                params: { prompt: message },
                timeout: 30000 // Increased timeout
            });
            
            return response.data?.text || "Hey there! How can I help?";
        } catch (error) {
            console.error("Gemini Fast error:", error.message);
            return "Gemini Fast is currently busy. Please try again.";
        }
    }
    
    // 6. Story Generator (FIXED endpoint)
    async storygenAI(prompt) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eliteProTechBase}/story`,
                params: { prompt: prompt },
                timeout: 20000
            });
            
            // Check different response formats
            return response.data?.response || 
                   response.data?.story || 
                   response.data?.text || 
                   "Once upon a time...";
        } catch (error) {
            console.error("StoryGen error:", error.message);
            return "Story generator is currently busy. Please try again.";
        }
    }
    
    // 7. Llama AI (keep existing)
    async llamaAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: "https://api.gurusensei.workers.dev/llama",
                params: { prompt: message },
                timeout: 15000
            });
            
            return response.data?.response?.response || response.data?.text || "Hello from Llama!";
        } catch (error) {
            console.error("Llama error:", error.message);
            return "Llama AI is resting. Try again!";
        }
    }
    
    // ==================== MEGAN HISTORY MANAGEMENT ====================
    
    getMeganHistory(userId) {
        if (!this.meganHistory.has(userId)) {
            this.meganHistory.set(userId, []);
        }
        return this.meganHistory.get(userId);
    }
    
    addToMeganHistory(userId, role, content) {
        const history = this.getMeganHistory(userId);
        history.push({ role, content, timestamp: Date.now() });
        
        if (history.length > this.maxHistory) {
            this.meganHistory.set(userId, history.slice(-this.maxHistory));
        }
    }
    
    clearMeganHistory(userId) {
        this.meganHistory.delete(userId);
    }
    
    setMeganModel(model) {
        this.meganModel = model;
        return true;
    }
    
    getMeganModel() {
        return this.meganModel || '@cf/meta/llama-3.1-8b-instruct';
    }
}

module.exports = AIHandler;
