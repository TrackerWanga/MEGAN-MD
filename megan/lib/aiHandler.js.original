// MEGAN-MD AI Handler - Clean version with fallbacks

const axios = require('axios');

class AIHandler {
    constructor(bot) {
        this.bot = bot;

        // API Base URLs
        this.siputzxBase = "https://api.siputzx.my.id/api/ai";
        this.xwolfBase = "https://apis.xwolf.space/api/ai";
        this.meganWorker = "https://late-salad-9d56.youngwanga254.workers.dev";

        // Default Bible version
        this.defaultBibleVersion = 'ESV';

        // Timeout
        this.timeout = 30000;
    }

    // ==================== MEGAN AI (Primary) ====================
    async meganAI(message, retryCount = 0) {
        try {
            const response = await axios({
                method: 'POST',
                url: this.meganWorker,
                headers: { 'Content-Type': 'application/json' },
                data: {
                    prompt: message,
                    model: '@cf/meta/llama-3.1-8b-instruct'
                },
                timeout: this.timeout
            });

            const result = response.data?.data?.response || response.data?.response;
            if (result && result.trim()) {
                return result;
            }
            
            // Fallback to Mistral if no response
            if (retryCount === 0) {
                return await this.mistralAI(message, "You are a helpful assistant.");
            }
            return "I'm here to help! Please try again.";

        } catch (error) {
            console.error("Megan AI error:", error.message);
            
            // Try fallback on first failure
            if (retryCount === 0) {
                try {
                    return await this.mistralAI(message, "You are a helpful assistant.");
                } catch (fallbackError) {
                    console.error("Fallback error:", fallbackError.message);
                    return "I'm having trouble connecting. Please try again in a moment. 🙏";
                }
            }
            return "I'm here to help! Please try again.";
        }
    }

    // ==================== MEGAN PRO (Removed - using fallback) ====================
    // Now uses Mistral as primary for pro features

    // ==================== BIBLE AI ====================

    async bibleAI(question, translation = null) {
        try {
            const version = translation || this.defaultBibleVersion;
            
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/bibleai`,
                params: {
                    question: question,
                    translation: version
                },
                timeout: this.timeout
            });
            
            if (response.data?.status && response.data.data) {
                return {
                    answer: response.data.data.response || "I couldn't find an answer to that question.",
                    version: version
                };
            }
            
            return {
                answer: "I'm sorry, I couldn't find an answer to that Bible question.",
                version: version
            };
            
        } catch (error) {
            console.error("Bible AI error:", error.message);
            return {
                answer: "I'm having trouble connecting to the Bible service. Please try again later.",
                version: translation || this.defaultBibleVersion
            };
        }
    }

    getBibleVersions() {
        return ['ESV', 'KJV', 'NASB20', 'ASV14', 'LSG', 'LUT', 'IRV', 'RVR09'];
    }

    setBibleVersion(version) {
        const validVersions = this.getBibleVersions();
        if (validVersions.includes(version)) {
            this.defaultBibleVersion = version;
            return true;
        }
        return false;
    }

    // ==================== GITA AI ====================

    async gitaAI(question) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/gita`,
                params: { q: question },
                timeout: this.timeout
            });
            
            return response.data?.data || "I couldn't find an answer to that Gita question.";
        } catch (error) {
            console.error("Gita AI error:", error.message);
            return "I'm having trouble connecting to the Gita service. Please try again later.";
        }
    }

    // ==================== SIPUTZX AI METHODS ====================

    async deepseekAI(message, systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/deepseekr1`,
                params: {
                    prompt: message,
                    system: systemPrompt,
                    temperature: 0.7
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "DeepSeek is thinking...";
        } catch (error) {
            console.error("DeepSeek error:", error.message);
            return "I'm having trouble connecting to DeepSeek. Please try again.";
        }
    }

    async gptAI(message, systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/gptoss120b`,
                params: {
                    prompt: message,
                    system: systemPrompt,
                    temperature: 0.7
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "GPT is thinking...";
        } catch (error) {
            console.error("GPT error:", error.message);
            return "I'm having trouble connecting to GPT. Please try again.";
        }
    }

    async glmAI(message, systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/glm47flash`,
                params: {
                    prompt: message,
                    system: systemPrompt,
                    temperature: 0.7
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "GLM is thinking...";
        } catch (error) {
            console.error("GLM error:", error.message);
            return "I'm having trouble connecting to GLM. Please try again.";
        }
    }

    async phiAI(message, systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/phi2`,
                params: {
                    prompt: message,
                    system: systemPrompt,
                    temperature: 0.7
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "Phi-2 is thinking...";
        } catch (error) {
            console.error("Phi-2 error:", error.message);
            return "I'm having trouble connecting to Phi-2. Please try again.";
        }
    }

    async qwenAI(message, systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/qwq32b`,
                params: {
                    prompt: message,
                    system: systemPrompt,
                    temperature: 0.7
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "Qwen is thinking...";
        } catch (error) {
            console.error("Qwen error:", error.message);
            return "I'm having trouble connecting to Qwen. Please try again.";
        }
    }

    async duckAI(message, model = 'gpt-4o-mini', systemPrompt = 'You are a helpful assistant.') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/duckai`,
                params: {
                    message: message,
                    model: model,
                    systemPrompt: systemPrompt
                },
                timeout: this.timeout
            });

            return response.data?.data?.message || "DuckAI is thinking...";
        } catch (error) {
            console.error("DuckAI error:", error.message);
            return "I'm having trouble connecting to DuckAI. Please try again.";
        }
    }

    // ==================== XWOLF API METHODS ====================

    async callXWolf(model, prompt, systemPrompt = null) {
        try {
            const payload = { prompt };
            if (systemPrompt) {
                payload.system = systemPrompt;
            }

            const response = await axios({
                method: 'POST',
                url: `${this.xwolfBase}/${model}`,
                headers: { 'Content-Type': 'application/json' },
                data: payload,
                timeout: this.timeout
            });

            if (response.data?.success) {
                return response.data.response;
            }

            return response.data?.response ||
                   response.data?.data?.response ||
                   response.data?.message ||
                   `${model} response received`;

        } catch (error) {
            console.error(`XWolf ${model} error:`, error.message);
            throw error;
        }
    }

    async mistralAI(prompt, systemPrompt = null) {
        return this.callXWolf('mistral', prompt, systemPrompt);
    }

    async replitAI(prompt, systemPrompt = null) {
        return this.callXWolf('replit', prompt, systemPrompt);
    }

    async wormGPT(prompt, systemPrompt = null) {
        return this.callXWolf('wormgpt', prompt, systemPrompt);
    }

    async chatGLM(prompt, systemPrompt = null) {
        return this.callXWolf('chatglm', prompt, systemPrompt);
    }

    async nemotronAI(prompt, systemPrompt = null) {
        return this.callXWolf('nemotron', prompt, systemPrompt);
    }

    async commandAI(prompt, systemPrompt = null) {
        return this.callXWolf('command', prompt, systemPrompt);
    }

    async orcaAI(prompt, systemPrompt = null) {
        return this.callXWolf('orca', prompt, systemPrompt);
    }

    async tinyLlamaAI(prompt, systemPrompt = null) {
        return this.callXWolf('tinyllama', prompt, systemPrompt);
    }

    async yiAI(prompt, systemPrompt = null) {
        return this.callXWolf('yi', prompt, systemPrompt);
    }

    async openHermesAI(prompt, systemPrompt = null) {
        return this.callXWolf('openhermes', prompt, systemPrompt);
    }

    async nousAI(prompt, systemPrompt = null) {
        return this.callXWolf('nous', prompt, systemPrompt);
    }

    async dolphinAI(prompt, systemPrompt = null) {
        return this.callXWolf('dolphin', prompt, systemPrompt);
    }

    async codeLlamaAI(prompt, systemPrompt = 'You are a coding expert. Provide code examples and explanations.') {
        return this.callXWolf('codellama', prompt, systemPrompt);
    }

    async zephyrAI(prompt, systemPrompt = null) {
        return this.callXWolf('zephyr', prompt, systemPrompt);
    }

    async groqAI(prompt, systemPrompt = null) {
        return this.callXWolf('groq', prompt, systemPrompt);
    }

    async xwolfGemini(prompt, systemPrompt = null) {
        return this.callXWolf('gemini', prompt, systemPrompt);
    }

    // ==================== GEMINI METHODS ====================

    async geminiAI(message, systemPrompt = 'You are a helpful assistant.', imageUrl = null) {
        try {
            const fullPrompt = imageUrl ? `${message} (Image: ${imageUrl})` : message;
            
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/gemini`,
                params: {
                    text: fullPrompt,
                    cookie: 'How are you',
                    promptSystem: systemPrompt
                },
                timeout: this.timeout
            });

            return response.data?.data?.response || "Gemini is thinking...";
        } catch (error) {
            console.error("Gemini error:", error.message);
            
            // Fallback to Mistral
            try {
                return await this.mistralAI(message, systemPrompt);
            } catch {
                return "I'm having trouble connecting to Gemini. Please try again.";
            }
        }
    }

    async geminiLiteAI(message) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.siputzxBase}/gemini-lite`,
                params: {
                    prompt: message,
                    model: 'gemini-2.0-flash-lite'
                },
                timeout: this.timeout
            });

            return response.data?.data?.parts?.[0]?.text || "Gemini Lite is thinking...";
        } catch (error) {
            console.error("Gemini Lite error:", error.message);
            
            // Fallback to Mistral
            try {
                return await this.mistralAI(message);
            } catch {
                return "I'm having trouble connecting to Gemini Lite. Please try again.";
            }
        }
    }

    // ==================== EDUCATIONAL AI ====================

    async teacherAI(question, subject = null) {
        const systemPrompt = subject
            ? `You are a knowledgeable teacher specializing in ${subject}. Explain concepts clearly, provide examples, and be patient with students.`
            : 'You are a helpful teacher. Explain concepts in simple terms, provide examples, and encourage learning.';

        try {
            return await this.mistralAI(question, systemPrompt);
        } catch (error) {
            console.error("Teacher AI error:", error.message);
            return "I'm having trouble answering that question. Please try again.";
        }
    }

    async codeAssistant(prompt, language = null) {
        const systemPrompt = language
            ? `You are a coding expert specializing in ${language}. Provide clean, efficient code with explanations.`
            : 'You are a coding expert. Provide code examples with explanations.';

        try {
            return await this.codeLlamaAI(prompt, systemPrompt);
        } catch (error) {
            console.error("Code assistant error:", error.message);
            return "I'm having trouble with the coding request. Please try again.";
        }
    }

    // ==================== UTILITY ====================

    getDuckAIModels() {
        return [
            'gpt-4o-mini',
            'claude-3-5-haiku-latest',
            'meta-llama/Llama-4-Scout-17B-16E-Instruct',
            'mistralai/Mistral-Small-24B-Instruct-2501',
            'openai/gpt-oss-120b',
            'gpt-5-mini'
        ];
    }
}

module.exports = AIHandler;
