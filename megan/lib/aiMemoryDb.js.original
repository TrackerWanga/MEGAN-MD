// MEGAN-MD AI Memory Manager - Separate SQLite Database
// Uses sqlite3 directly, no Sequelize complexity

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

class AIMemoryDb {
    constructor() {
        this.dbPath = path.join(process.cwd(), 'ai_memory.db');
        this.db = null;
        this.retentionHours = 24;
        this.maxMessages = 20;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return this;

        // Ensure directory exists
        await fs.ensureDir(path.dirname(this.dbPath));

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('AI Memory DB error:', err);
                    reject(err);
                    return;
                }
                this.createTables();
                this.initialized = true;
                console.log('🗄️  AI Memory database connected');
                resolve(this);
            });
        });
    }

    createTables() {
        // Create messages table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS chat_memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chatId TEXT NOT NULL,
                userId TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            )
        `);

        // Create indexes for faster queries
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_chatId ON chat_memory (chatId)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_timestamp ON chat_memory (timestamp)`);

        // Create stats table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS memory_stats (
                chatId TEXT PRIMARY KEY,
                messageCount INTEGER DEFAULT 0,
                storageBytes INTEGER DEFAULT 0,
                lastActivity INTEGER DEFAULT 0
            )
        `);

        console.log('✅ AI Memory tables ready');
    }

    // Add message to memory
    addMessage(chatId, userId, role, content) {
        if (!chatId || !userId || !role || !content) return false;

        const timestamp = Date.now();

        this.db.run(
            `INSERT INTO chat_memory (chatId, userId, role, content, timestamp) VALUES (?, ?, ?, ?, ?)`,
            [chatId, userId, role, content, timestamp],
            (err) => {
                if (err) {
                    console.error('Add memory error:', err);
                } else {
                    this.updateStats(chatId);
                    this.trimChat(chatId);
                }
            }
        );
        return true;
    }

    // Get conversation history
    getHistory(chatId, limit = 15, callback) {
        this.db.all(
            `SELECT role, content, userId, timestamp FROM chat_memory 
             WHERE chatId = ? 
             ORDER BY timestamp ASC 
             LIMIT ?`,
            [chatId, limit],
            (err, rows) => {
                if (err) {
                    console.error('Get history error:', err);
                    callback([]);
                } else {
                    callback(rows || []);
                }
            }
        );
    }

    // Get history synchronously (for use in async function)
    async getHistorySync(chatId, limit = 15) {
        return new Promise((resolve) => {
            this.db.all(
                `SELECT role, content, userId, timestamp FROM chat_memory 
                 WHERE chatId = ? 
                 ORDER BY timestamp ASC 
                 LIMIT ?`,
                [chatId, limit],
                (err, rows) => {
                    if (err) {
                        console.error('Get history error:', err);
                        resolve([]);
                    } else {
                        resolve(rows || []);
                    }
                }
            );
        });
    }

    // Clear memory for a chat
    clearMemory(chatId, callback) {
        this.db.run(`DELETE FROM chat_memory WHERE chatId = ?`, [chatId], (err) => {
            if (!err) {
                this.updateStats(chatId);
            }
            if (callback) callback(err ? 0 : 1);
        });
    }

    // Clear memory synchronously
    async clearMemorySync(chatId) {
        return new Promise((resolve) => {
            this.db.run(`DELETE FROM chat_memory WHERE chatId = ?`, [chatId], (err) => {
                if (!err) this.updateStats(chatId);
                resolve(!err);
            });
        });
    }

    // Trim chat to maxMessages (keep most recent)
    trimChat(chatId) {
        this.db.get(
            `SELECT COUNT(*) as count FROM chat_memory WHERE chatId = ?`,
            [chatId],
            (err, row) => {
                if (err || !row) return;
                if (row.count > this.maxMessages) {
                    const toDelete = row.count - this.maxMessages;
                    this.db.run(
                        `DELETE FROM chat_memory WHERE chatId = ? AND id IN (
                            SELECT id FROM chat_memory WHERE chatId = ? 
                            ORDER BY timestamp ASC LIMIT ?
                        )`,
                        [chatId, chatId, toDelete]
                    );
                }
            }
        );
    }

    // Update stats for a chat
    updateStats(chatId) {
        this.db.get(
            `SELECT COUNT(*) as count, SUM(LENGTH(content)) as bytes FROM chat_memory WHERE chatId = ?`,
            [chatId],
            (err, row) => {
                if (err) return;
                const count = row?.count || 0;
                const bytes = row?.bytes || 0;
                this.db.run(
                    `INSERT OR REPLACE INTO memory_stats (chatId, messageCount, storageBytes, lastActivity) 
                     VALUES (?, ?, ?, ?)`,
                    [chatId, count, bytes, Date.now()]
                );
            }
        );
    }

    // Get stats for a chat
    async getStats(chatId) {
        return new Promise((resolve) => {
            this.db.get(
                `SELECT messageCount, storageBytes, lastActivity FROM memory_stats WHERE chatId = ?`,
                [chatId],
                (err, row) => {
                    if (err || !row) {
                        resolve({ messageCount: 0, storageBytes: 0, lastActivity: 0 });
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    // Get global stats
    async getGlobalStats() {
        return new Promise((resolve) => {
            this.db.get(
                `SELECT 
                    COUNT(DISTINCT chatId) as activeChats,
                    SUM(messageCount) as totalMessages,
                    SUM(storageBytes) as totalBytes
                 FROM memory_stats`,
                (err, row) => {
                    if (err || !row) {
                        resolve({ activeChats: 0, totalMessages: 0, totalMB: '0' });
                    } else {
                        resolve({
                            activeChats: row.activeChats || 0,
                            totalMessages: row.totalMessages || 0,
                            totalMB: ((row.totalBytes || 0) / (1024 * 1024)).toFixed(2)
                        });
                    }
                }
            );
        });
    }

    // Cleanup old messages
    cleanupOld(callback) {
        const cutoff = Date.now() - (this.retentionHours * 60 * 60 * 1000);
        this.db.run(
            `DELETE FROM chat_memory WHERE timestamp < ?`,
            [cutoff],
            (err) => {
                if (!err) {
                    // Update all stats after cleanup
                    this.db.all(`SELECT DISTINCT chatId FROM chat_memory`, [], (err, rows) => {
                        if (rows) {
                            rows.forEach(row => this.updateStats(row.chatId));
                        }
                    });
                }
                if (callback) callback();
            }
        );
    }

    // Start auto-cleanup
    startAutoCleanup(intervalHours = 1) {
        setInterval(() => {
            this.cleanupOld();
        }, intervalHours * 60 * 60 * 1000);
        console.log(`🧠 AI Memory auto-cleanup: every ${intervalHours} hour(s)`);
    }

    // Close database
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = AIMemoryDb;
EOFcat > index.js << 'EOF'
// MEGAN-MD - With Separate AI Memory Database

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    isJidGroup,
    DisconnectReason,
    downloadMediaMessage
} = require('gifted-baileys');

const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const dotenv = require('dotenv');
const { Boom } = require('@hapi/boom');
const axios = require('axios');

dotenv.config();

// Import modules
const config = require('./megan/config');
const { createLogger } = require('./megan/logger');
const DatabaseManager = require('./megan/lib/database');
const AIMemoryDb = require('./megan/lib/aiMemoryDb');
const CacheManager = require('./megan/lib/cache');
const MessageStore = require('./megan/lib/messageStore');
const EventHandler = require('./megan/events/handler');
const MessageHelper = require('./megan/lib/message');
const MediaProcessor = require('./megan/lib/mediaProcessor');
const StatusHandler = require('./megan/lib/statusHandler');
const AutoReactHandler = require('./megan/lib/autoReact');
const LidResolver = require('./megan/lib/lidResolver').LidResolver;
const Buttons = require('./megan/lib/buttons');
const timeUtils = require('./megan/lib/timeUtils');
const { handleViewOnce } = require('./megan/lib/viewOnceHandler');
const { handleAntiLink } = require('./megan/lib/antiLink');

class MeganBot {
    constructor() {
        this.config = config;
        this.logger = createLogger(config.BOT_NAME);
        this.cache = new CacheManager(this.logger);
        this.messageStore = null;
        this.db = null;
        this.aiMemory = null;  // Separate AI memory database
        this.media = new MediaProcessor();
        this.autoReact = null;
        this.lidResolver = null;
        this.sock = null;
        this.commands = new Map();
        this.aliases = new Map();
        this.ownerJid = null;
        this.ownerLid = null;
        this.createRequiredFolders();
    }

    createRequiredFolders() {
        const folders = ['./sessions', './temp', './database', './logs', './megan/temp'];
        folders.forEach(folder => {
            try { fs.ensureDirSync(folder); } catch (error) {}
        });
    }

    async initialize() {
        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║              MEGAN-MD BOT INITIALIZATION                    ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');

        try {
            console.log('🔐 [1/8] Loading WhatsApp session...');
            await this.setupSession();
            console.log('✅ [1/8] Session loaded successfully\n');

            console.log('🗄️  [2/8] Initializing main database...');
            this.db = new DatabaseManager();
            await this.db.initialize();
            console.log('✅ [2/8] Main database ready\n');

            console.log('🧠 [3/8] Initializing AI Memory database...');
            this.aiMemory = new AIMemoryDb();
            await this.aiMemory.initialize();
            this.aiMemory.startAutoCleanup(1); // Clean every hour
            console.log('✅ [3/8] AI Memory database ready\n');

            console.log('💾 [4/8] Initializing message store...');
            this.messageStore = new MessageStore();
            this.messageStore.setDatabase(this.db);
            console.log('✅ [4/8] Message store ready\n');

            console.log('📚 [5/8] Loading commands...');
            await this.loadCommands();
            console.log(`✅ [5/8] Loaded ${this.commands.size} commands\n`);

            console.log('🎮 [6/8] Initializing handlers...');
            this.autoReact = new AutoReactHandler(this);
            this.lidResolver = new LidResolver(this);
            console.log('✅ [6/8] Handlers ready\n');

            console.log('🌐 [7/8] Connecting to WhatsApp...');
            await this.connect();

            const currentTime = await timeUtils.getCurrentTimeString(this.db);
            const statusView = await this.db.getSetting('status_auto_view', 'on');
            const statusReact = await this.db.getSetting('status_auto_react', 'off');
            const autoViewOnce = await this.db.getSetting('autoviewonce', 'on');
            const memoryStats = await this.aiMemory.getGlobalStats();

            console.log('\n╔═══════════════════════════════════════════════════════════╗');
            console.log('║                    BOT STATUS                              ║');
            console.log('╚═══════════════════════════════════════════════════════════╝');
            console.log(`🕐 Current Time: ${currentTime}`);
            console.log(`📱 Status Auto-View: ${statusView === 'on' ? 'ON' : 'OFF'}`);
            console.log(`❤️ Status Auto-React: ${statusReact === 'on' ? 'ON' : 'OFF'}`);
            console.log(`🔐 Auto-View-Once: ${autoViewOnce === 'on' ? 'ON' : 'OFF'}`);
            console.log(`🧠 AI Memory: ${memoryStats.activeChats} chats, ${memoryStats.totalMessages} messages, ${memoryStats.totalMB}MB`);
            console.log('═══════════════════════════════════════════════════════════════\n');

            console.log('✅ MEGAN-MD is now online and ready!\n');

        } catch (error) {
            console.error(`\n❌ Initialization failed: ${error.message}`);
            console.error(error.stack);
            process.exit(1);
        }
    }

    async setupSession() {
        const sessionString = process.env.SESSION;
        if (!sessionString) {
            throw new Error('No SESSION in .env');
        }

        const sessionDir = path.join(process.cwd(), 'sessions');
        await fs.ensureDir(sessionDir);

        let credsData;
        if (sessionString.startsWith('Megan~')) {
            const { decodeSession } = require('./megan/helpers/sessionDecoder');
            credsData = decodeSession(sessionString);
        } else {
            try {
                credsData = JSON.parse(sessionString);
            } catch (e) {
                throw new Error('Invalid session format');
            }
        }

        const credsPath = path.join(sessionDir, 'creds.json');
        await fs.writeJson(credsPath, credsData, { spaces: 2 });
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, 'wanga/commands');
        await fs.ensureDir(commandsPath);
        const files = await fs.readdir(commandsPath);
        const jsFiles = files.filter(file => file.endsWith('.js'));

        for (const file of jsFiles) {
            try {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                const cmdModule = require(filePath);

                let commandsArray = [];
                if (cmdModule.commands && Array.isArray(cmdModule.commands)) {
                    commandsArray = cmdModule.commands;
                } else if (Array.isArray(cmdModule)) {
                    commandsArray = cmdModule;
                } else if (cmdModule.default?.commands) {
                    commandsArray = cmdModule.default.commands;
                }

                for (const cmd of commandsArray) {
                    if (cmd && cmd.name) {
                        this.commands.set(cmd.name.toLowerCase(), cmd);
                        if (cmd.aliases) {
                            cmd.aliases.forEach(alias => {
                                this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase());
                            });
                        }
                    }
                }
            } catch (error) {
                console.log(`   ⚠️ Failed to load ${file}: ${error.message}`);
            }
        }
    }

    // ==================== AI WITH MEMORY ====================
    async getAIResponse(chatId, userId, query, systemPrompt = null) {
        const defaultSystemPrompt = `You are MEGAN-MD, a friendly WhatsApp bot created by TrackerWanga. Be helpful, concise, and engaging. Keep responses under 2000 characters.`;

        const system = systemPrompt || defaultSystemPrompt;

        // Get AI mode
        const aiMode = await this.db.getSetting('ai_mode', 'normal');
        let stylePrompt = '';
        
        if (aiMode === 'short') {
            stylePrompt = ' Be very brief and concise. Use 1-2 sentences maximum.';
        } else if (aiMode === 'detailed') {
            stylePrompt = ' Provide detailed, comprehensive responses with examples when helpful.';
        }

        const fullSystemPrompt = system + stylePrompt;

        // Get conversation history from AI memory
        const history = await this.aiMemory.getHistorySync(chatId, 15);
        
        // Build messages array
        const messages = [
            { role: 'system', content: fullSystemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: query }
        ];

        // APIs in priority order
        const apis = [
            {
                name: 'primary',
                url: 'https://late-salad-9d56.youngwanga254.workers.dev',
                method: 'POST',
                data: { prompt: query, model: '@cf/meta/llama-3.1-8b-instruct' },
                parse: (res) => res.data?.response || res.response
            },
            {
                name: 'gemini',
                url: 'https://api.siputzx.my.id/api/ai/gemini',
                method: 'GET',
                buildUrl: (query, system) => `?text=${encodeURIComponent(query)}&cookie=Megan&promptSystem=${encodeURIComponent(system)}`,
                parse: (res) => res.data?.response
            },
            {
                name: 'duckai',
                url: 'https://api.siputzx.my.id/api/ai/duckai',
                method: 'GET',
                buildUrl: (query, system) => `?message=${encodeURIComponent(query)}&model=gpt-4o-mini&systemPrompt=${encodeURIComponent(system)}`,
                parse: (res) => res.data?.message
            }
        ];

        for (const api of apis) {
            try {
                let response;
                if (api.method === 'POST') {
                    response = await axios.post(api.url, api.data, {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000
                    });
                } else {
                    const url = api.url + (api.buildUrl ? api.buildUrl(query, fullSystemPrompt) : `?prompt=${encodeURIComponent(query)}`);
                    response = await axios.get(url, { timeout: 15000 });
                }

                const aiResponse = api.parse(response.data);
                if (aiResponse && typeof aiResponse === 'string' && aiResponse.trim().length > 0) {
                    console.log(`✅ AI response from ${api.name} API`);
                    
                    // Save to AI memory (async, don't wait)
                    this.aiMemory.addMessage(chatId, userId, 'user', query);
                    this.aiMemory.addMessage(chatId, userId, 'assistant', aiResponse);
                    
                    return aiResponse;
                }
            } catch (error) {
                console.log(`⚠️ ${api.name} API failed: ${error.message}`);
                continue;
            }
        }

        return "I'm having trouble connecting to my AI service right now. Please try again in a moment. 🙏";
    }

    async connect() {
        try {
            const { version } = await fetchLatestBaileysVersion();
            console.log(`   • WA Version: ${version.join('.')}`);

            const sessionDir = path.join(process.cwd(), 'sessions');
            const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

            const sock = makeWASocket({
                version,
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: ['MEGAN-MD', 'Chrome', '120.0.0.0'],
                printQRInTerminal: false,
                syncFullHistory: false,
                markOnlineOnConnect: true,
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000,
                generateHighQualityLinkPreview: false,
                defaultQueryTimeoutMs: 60000,
                retryRequestDelayMs: 500,
                maxMsgRetryCount: 5,
                shouldSyncHistoryMessage: false,
                getMessage: async (key) => {
                    const cached = this.cache.get(key.id);
                    return cached?.message || undefined;
                }
            });

            this.sock = sock;
            this.ownerJid = sock.user?.id;
            this.ownerLid = sock.user?.lid;

            this.buttons = new Buttons(sock, this);
            this.statusHandler = new StatusHandler(this);
            this.eventHandler = new EventHandler(this, this.logger, this.cache, null);

            sock.ev.on('creds.update', () => { saveCreds(); });

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`   ✅ Connected!`);
                    console.log(`   📱 Owner JID: ${this.ownerJid}`);
                    if (this.ownerLid) console.log(`   📱 Owner LID: ${this.ownerLid}`);

                    if (this.eventHandler && this.eventHandler.initOwnerManager) {
                        await this.eventHandler.initOwnerManager(this.db, this.ownerJid, this.ownerLid);
                    }

                    if (this.eventHandler && this.eventHandler.initLidStore) {
                        await this.eventHandler.initLidStore();
                    }

                    if (this.lidResolver) {
                        this.lidResolver.setOwnerJids(this.ownerJid, this.ownerLid);
                    }

                    setTimeout(() => this.sendStartupMessage(), 2000);
                }

                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error instanceof Boom
                        ? lastDisconnect.error.output?.statusCode : 500;
                    if (statusCode === DisconnectReason.loggedOut) {
                        console.error('❌ Session expired! Please get a new session.');
                        process.exit(1);
                    }
                    setTimeout(() => this.connect(), 5000);
                }
            });

            // ========== MAIN MESSAGE HANDLER ==========
            sock.ev.on('messages.upsert', async ({ messages }) => {
                for (const msg of messages) {
                    await this.processMessage(msg);
                }
            });

            sock.ev.on('messages.update', async (updates) => {
                for (const update of updates) {
                    await this.eventHandler?.handleMessageUpdate(update);
                }
            });

            sock.ev.on('messages.delete', async (deleteData) => {
                const keys = deleteData.keys || deleteData;
                if (!keys || !Array.isArray(keys)) return;
                for (const key of keys) {
                    await this.eventHandler?.handleMessageDelete(key);
                }
            });

            sock.ev.on('group-participants.update', (update) => {
                this.eventHandler?.handleGroupUpdate(update);
            });

            sock.ev.on('call', async (calls) => {
                const antiCall = await this.db?.getSetting('anticall', 'off');
                if (antiCall !== 'off' && this.eventHandler) {
                    await this.eventHandler.handleAntiCall(calls);
                }
            });

        } catch (error) {
            console.error(`   ❌ Connection error: ${error.message}`);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async processMessage(msg) {
        try {
            const from = msg.key.remoteJid;
            const isGroup = isJidGroup(from);
            const isStatus = from === 'status@broadcast';
            const text = MessageHelper.extractText(msg.message);

            let sender;
            if (msg.key.fromMe) {
                sender = this.sock.user?.id || this.ownerJid;
            } else {
                sender = msg.key.participant || from;
            }

            // Anti-delete detection
            if (msg.message?.protocolMessage?.type === 0) {
                const deletedId = msg.message.protocolMessage.key.id;
                const deletedMsg = await this.messageStore?.getMessage(from, deletedId);
                if (deletedMsg && this.eventHandler) {
                    const deleter = msg.key.participant || from;
                    const originalSender = deletedMsg.key?.participant || deletedMsg.key?.remoteJid;
                    await this.eventHandler.handleAntiDelete(deletedMsg, msg.key, deleter, originalSender);
                }
                return;
            }

            // STATUS MESSAGES
            if (isStatus) {
                if (this.statusHandler) {
                    await this.statusHandler.handleStatus(msg);
                }
                return;
            }

            // Store message
            if (this.messageStore) {
                await this.messageStore.addMessage(msg);
                if (!msg.key.fromMe) {
                    await this.messageStore.storeOriginalMessage(msg);
                }
            }

            // Auto view-once detection
            await handleViewOnce(this.sock, msg, this.db, this.ownerJid);

            // Anti-link
            if (isGroup && text) {
                await handleAntiLink(this.sock, msg, this.db);
            }

            // Auto-read
            const autoReadEnabled = await this.db?.getSetting('autoread', 'off');
            if (autoReadEnabled === 'on' && !isStatus && this.eventHandler) {
                await this.eventHandler.autoRead(msg).catch(() => {});
            }

            // Auto-react
            const autoReactEnabled = await this.db?.getSetting('autoreact', 'off');
            if (autoReactEnabled === 'on' && !isStatus && this.autoReact) {
                setTimeout(() => {
                    this.autoReact.autoReact(msg).catch(() => {});
                }, 500);
            }

            // Chatbot with memory
            if (text && !msg.key.fromMe && !isStatus) {
                await this.handleChatbot(msg, text, from, sender, isGroup);
            }

            // Commands
            if (text && MessageHelper.isCommand(text, config.PREFIX)) {
                if (this.eventHandler) {
                    await this.eventHandler.handleCommand(msg, text, from, sender, isGroup);
                }
            }

        } catch (error) {
            console.error(`Message error: ${error.message}`);
        }
    }

    async handleChatbot(msg, text, from, sender, isGroup) {
        try {
            const chatbotEnabled = await this.db.getSetting('chatbot', 'off');
            if (chatbotEnabled === 'off') return false;

            if (MessageHelper.isCommand(text, config.PREFIX)) return false;

            let shouldRespond = false;
            if (chatbotEnabled === 'both') shouldRespond = true;
            else if (chatbotEnabled === 'dm' && !isGroup) shouldRespond = true;
            else if (chatbotEnabled === 'group' && isGroup) shouldRespond = true;

            if (!shouldRespond) return false;

            await this.sock.sendPresenceUpdate('composing', from);

            const aiResponse = await this.getAIResponse(from, sender, text);

            await this.sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
            return true;

        } catch (error) {
            console.error('Chatbot error:', error);
            return false;
        }
    }

    async sendStartupMessage() {
        try {
            if (!this.sock) return;
            const ownerJid = config.OWNER_NUMBER.includes('@') ? config.OWNER_NUMBER : `${config.OWNER_NUMBER}@s.whatsapp.net`;
            const currentTime = await timeUtils.getCurrentTimeString(this.db);
            const memoryStats = await this.aiMemory.getGlobalStats();
            const message = `✅ *${config.BOT_NAME} CONNECTED*\n\n🕐 *Time:* ${currentTime}\n👤 *Owner:* ${config.OWNER_NAME}\n📞 *Number:* ${config.OWNER_NUMBER}\n🔧 *Prefix:* ${config.PREFIX}\n📚 *Commands:* ${this.commands.size}\n🧠 *AI Memory:* ${memoryStats.activeChats} chats, ${memoryStats.totalMessages} messages, ${memoryStats.totalMB}MB\n\n> created by wanga`;
            await this.sock.sendMessage(ownerJid, { text: message });
        } catch (error) {}
    }

    async cleanup() {
        if (this.db) await this.db.save();
        if (this.aiMemory) this.aiMemory.close();
        if (this.sock) await this.sock.end();
        process.exit(0);
    }
}

const bot = new MeganBot();

process.on('SIGINT', () => bot.cleanup());
process.on('SIGTERM', () => bot.cleanup());

bot.initialize().catch(error => {
    console.error('Failed to start bot:', error);
    process.exit(1);
});
