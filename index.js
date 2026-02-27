const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    isJidGroup,
    isJidStatusBroadcast,
    downloadMediaMessage
} = require('gifted-baileys');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Import modules
const config = require('./megan/config');
const { createLogger } = require('./megan/logger');
const DatabaseManager = require('./megan/lib/database');
const CacheManager = require('./megan/lib/cache');
const MessageStore = require('./megan/lib/messageStore');
const ConnectionManager = require('./megan/lib/connection');
const EventHandler = require('./megan/events/handler');
const MessageHelper = require('./megan/lib/message');
const FeatureHelper = require('./megan/lib/features');
const StatusHandler = require('./megan/lib/statusHandler');
const MediaProcessor = require('./megan/lib/mediaProcessor');
const AutoReactHandler = require('./megan/lib/autoReact');

// Import helpers
const OwnerHelper = require('./megan/helpers/ownerHelper');
const UserHelper = require('./megan/helpers/userHelper');
const GroupHelper = require('./megan/helpers/groupHelper');
const SessionDecoder = require('./megan/helpers/sessionDecoder'); // ADDED

class MeganBot {
    constructor() {
        this.config = config;
        this.logger = createLogger(config.BOT_NAME);
        this.cache = new CacheManager(this.logger);
        this.messageStore = new MessageStore();
        this.db = new DatabaseManager();
        this.media = new MediaProcessor();
        this.autoReact = new AutoReactHandler(this);
        this.features = null;
        this.statusHandler = null;
        this.connection = new ConnectionManager(this, this.logger);
        this.eventHandler = null;

        this.sock = null;
        this.commands = new Map();
        this.aliases = new Map();
        this.commandNames = [];

        this.startTime = Date.now();

        // Initialize helpers
        this.ownerHelper = new OwnerHelper(config);
        this.userHelper = new UserHelper(this.db, this.ownerHelper);
        this.groupHelper = GroupHelper;

        // Create required folders
        this.createRequiredFolders();

        // Message store cleanup every hour
        setInterval(() => this.messageStore?.cleanup(), 60 * 60 * 1000);

        // AGGRESSIVE session file cleanup every 30 seconds
        setInterval(() => this.cleanupSessionFiles(), 30 * 1000);
    }

    // Create all required folders
    createRequiredFolders() {
        const folders = [
            './sessions',
            './sessions/main',
            './temp',
            './database',
            './logs'
        ];

        folders.forEach(folder => {
            try {
                fs.ensureDirSync(folder);
            } catch (error) {
                // Silent fail
            }
        });
    }

    async initialize() {
        try {
            // Session from .env
            await this.setupSession();

            // Initialize database
            if (config.DATABASE.ENABLED) {
                this.logger.info('Initializing database...', '🗄️');
                await this.db.initialize();
                this.logger.success('Database connected', '🗄️');
            }

            // Load all commands
            await this.loadCommands();

            // Cache cleanup
            setInterval(() => this.cache.cleanup(), config.CACHE.CLEANUP_INTERVAL);

            // Auto bio update every hour
            setInterval(async () => {
                if (this.features) {
                    await this.features.updateAutoBio();
                }
            }, 60 * 60 * 1000);

            // Connect to WhatsApp
            await this.connect();

        } catch (error) {
            this.logger.error(`Initialization error: ${error.message}`);
            process.exit(1);
        }
    }

    async setupSession() {
        const sessionString = process.env.SESSION;
        if (!sessionString) {
            this.logger.error('No SESSION in .env');
            process.exit(1);
        }

        // Ensure main session directory exists
        const mainSessionDir = path.join(config.SESSION_DIR || './sessions', 'main');
        await fs.ensureDir(mainSessionDir);
        const credsPath = path.join(mainSessionDir, 'creds.json');

        try {
            let sessionData;

            // Check if it's a Megan~ prefixed session
            if (SessionDecoder.isValid(sessionString)) {
                this.logger.info('🔐 Detected Megan~ base64 session format');
                
                // Use the decoder helper
                sessionData = SessionDecoder.decode(sessionString);
                
                this.logger.success('✅ Base64 session decoded successfully');
            } else {
                // Try parsing as regular JSON
                try {
                    sessionData = JSON.parse(sessionString);
                    this.logger.success('✅ JSON session loaded');
                } catch (jsonError) {
                    this.logger.error('❌ Invalid JSON session format');
                    throw new Error('Session must be either valid JSON or Megan~ base64 format');
                }
            }

            // Write to creds.json
            await fs.writeJson(credsPath, sessionData, { spaces: 2 });
            
            // Update config.SESSION_DIR to point to main folder
            config.SESSION_DIR = mainSessionDir;
            
            this.logger.success(`📁 Session saved to ${mainSessionDir}`);

        } catch (error) {
            this.logger.error(`❌ Failed to process session: ${error.message}`);
            this.logger.error('Please check your SESSION in .env file');
            process.exit(1);
        }
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, 'wanga/commands');

        try {
            await fs.ensureDir(commandsPath);
            const files = await fs.readdir(commandsPath);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            let cmdCount = 0;

            for (const file of jsFiles) {
                try {
                    const filePath = path.join(commandsPath, file);

                    delete require.cache[require.resolve(filePath)];

                    const cmdModule = require(filePath);

                    let commandsArray = [];
                    if (typeof cmdModule === 'function') {
                        commandsArray = cmdModule(this) || [];
                    } else if (cmdModule.commands && Array.isArray(cmdModule.commands)) {
                        commandsArray = cmdModule.commands;
                    } else if (Array.isArray(cmdModule)) {
                        commandsArray = cmdModule;
                    }

                    commandsArray.forEach(cmd => {
                        if (cmd && cmd.name) {
                            this.commands.set(cmd.name.toLowerCase(), cmd);
                            this.commandNames.push(cmd.name.toLowerCase());
                            if (cmd.aliases && Array.isArray(cmd.aliases)) {
                                cmd.aliases.forEach(alias => {
                                    this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase());
                                });
                            }
                            cmdCount++;
                        }
                    });

                    this.logger.info(`Loaded: ${file} (${commandsArray.length} commands)`, '📄');
                } catch (error) {
                    this.logger.error(`Failed to load ${file}: ${error.message}`);
                }
            }

            this.logger.success(`Total commands loaded: ${cmdCount}`, '📚');
        } catch (error) {
            this.logger.error(`Failed to load commands: ${error.message}`);
        }
    }

    // AGGRESSIVE SILENT cleanup - keeps only creds.json and 5 most recent files
    async cleanupSessionFiles() {
        try {
            const sessionPath = path.join(config.SESSION_DIR || './sessions');
            
            // Check all user session folders
            const users = await fs.readdir(sessionPath).catch(() => []);
            
            for (const user of users) {
                const userSessionPath = path.join(sessionPath, user);
                const stat = await fs.stat(userSessionPath).catch(() => null);
                
                if (!stat || !stat.isDirectory()) continue;
                
                const files = await fs.readdir(userSessionPath);
                
                // Always keep creds.json
                const filesToKeep = ['creds.json'];
                
                // Get all JSON files except creds.json
                const otherJsonFiles = files.filter(f => 
                    f.endsWith('.json') && 
                    f !== 'creds.json'
                );
                
                if (otherJsonFiles.length > 0) {
                    const fileStats = await Promise.all(
                        otherJsonFiles.map(async (file) => {
                            const filePath = path.join(userSessionPath, file);
                            try {
                                const stat = await fs.stat(filePath);
                                return { file, path: filePath, mtime: stat.mtimeMs };
                            } catch (e) {
                                return null;
                            }
                        })
                    );
                    
                    const validStats = fileStats.filter(f => f !== null);
                    validStats.sort((a, b) => b.mtime - a.mtime);
                    
                    const newestFiles = validStats.slice(0, 5).map(f => f.file);
                    filesToKeep.push(...newestFiles);
                    
                    const filesToDelete = otherJsonFiles.filter(f => !filesToKeep.includes(f));
                    
                    for (const file of filesToDelete) {
                        try {
                            await fs.remove(path.join(userSessionPath, file));
                        } catch (e) {}
                    }
                }
                
                // Clean up non-JSON files
                const nonJsonFiles = files.filter(f => !f.endsWith('.json'));
                for (const file of nonJsonFiles) {
                    try {
                        await fs.remove(path.join(userSessionPath, file));
                    } catch (e) {}
                }
            }
            
        } catch (error) {
            // Completely silent
        }
    }

    async sendStartupMessage() {
        try {
            if (!this.sock) return;

            const ownerJid = config.OWNER_NUMBER.includes('@') ? 
                config.OWNER_NUMBER : `${config.OWNER_NUMBER}@s.whatsapp.net`;

            const currentDate = new Date();
            const dateStr = currentDate.toLocaleDateString();
            const timeStr = currentDate.toLocaleTimeString();

            const commandCount = this.commands.size;

            const message = `✅ *MEGAN BOT CONNECTED*\n\n` +
                `📱 *Bot:* ${config.BOT_NAME}\n` +
                `👤 *Owner:* ${config.OWNER_NAME}\n` +
                `📞 *Phone:* ${config.OWNER_NUMBER}\n` +
                `🔧 *Prefix:* ${config.PREFIX}\n` +
                `📚 *Commands:* ${commandCount}\n` +
                `📅 *Date:* ${dateStr}\n` +
                `⏰ *Time:* ${timeStr}\n\n` +
                `> created by wanga`;

            await this.sock.sendMessage(ownerJid, { text: message });
            this.logger.success(`Startup message sent to owner`);
        } catch (error) {
            this.logger.error(`Failed to send startup message: ${error.message}`);
        }
    }

    async connect() {
        try {
            const { version } = await fetchLatestBaileysVersion();
            this.logger.info(`Using WA version: ${version.join('.')}`, '📱');

            const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
            this.logger.info('Main session auth loaded', '🔑');

            const sock = makeWASocket({
                version,
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: config.BROWSER,
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
            this.features = new FeatureHelper(this);
            this.statusHandler = new StatusHandler(this, this.messageStore);
            this.eventHandler = new EventHandler(this, this.logger, this.cache, this.features);

            // ==================== CREDENTIALS UPDATE ====================
            sock.ev.on('creds.update', () => {
                this.logger.info('Main session credentials updated, saving...', '🔑');
                saveCreds();
            });

            // ==================== CONNECTION UPDATE ====================
            sock.ev.on('connection.update', (update) => {
                const { connection } = update;

                if (connection === 'open') {
                    this.logger.success('Connected!');
                    setTimeout(() => this.sendStartupMessage(), 2000);
                } else if (connection === 'close') {
                    this.logger.warn('Connection closed. Reconnecting...');
                    setTimeout(() => this.connect(), 5000);
                }
            });

            // ==================== MESSAGES.UPSERT - MAIN MESSAGE HANDLER ====================
            sock.ev.on('messages.upsert', async ({ messages }) => {
                for (const msg of messages) {
                    try {
                        // Store message for anti-delete
                        if (this.messageStore && !msg.key?.fromMe) {
                            this.messageStore.addMessage(msg);
                        }

                        const from = msg.key.remoteJid;
                        const sender = msg.key.participant || from;
                        const isGroup = isJidGroup(from);
                        const text = MessageHelper.extractText(msg.message);

                        // ===== ANTI-DELETE DETECTION (PROTOCOL MESSAGES) =====
                        if (msg.message?.protocolMessage?.type === 0) {
                            const deletedId = msg.message.protocolMessage.key.id;
                            const deletedMsg = this.messageStore?.getMessage(msg.key.remoteJid, deletedId);

                            if (deletedMsg && this.features) {
                                const antiDelete = await this.db.getSetting('antidelete', 'on');
                                if (antiDelete === 'on') {
                                    await this.features.handleAntiDelete(
                                        deletedMsg,
                                        msg.key,
                                        msg.key.participant || msg.key.remoteJid,
                                        deletedMsg.key?.participant || deletedMsg.key?.remoteJid
                                    );
                                }
                            }
                        }

                        // ===== STATUS HANDLER =====
                        if (this.statusHandler && msg.key?.remoteJid === 'status@broadcast') {
                            await this.statusHandler.handleStatus(msg);
                        }

                        // ===== VIEW ONCE HANDLER =====
                        if (this.statusHandler && !msg.key?.fromMe) {
                            const isViewOnce = msg.message?.imageMessage?.viewOnce ||
                                             msg.message?.videoMessage?.viewOnce ||
                                             msg.message?.audioMessage?.viewOnce;

                            if (isViewOnce) {
                                await this.statusHandler.handleViewOnce(msg, from, sender);
                            }
                        }

                        // ===== ANTI-LINK CHECK =====
                        if (isGroup && text && this.features) {
                            await this.features.handleAntiLink(msg, from, sender);
                        }

                        // ===== AUTO-REACT =====
                        if (this.autoReact && !msg.key?.fromMe && msg.key.remoteJid !== 'status@broadcast') {
                            const autoReactEnabled = await this.db.getSetting('autoreact', 'false');
                            if (autoReactEnabled === 'true') {
                                await this.autoReact.autoReact(msg);
                            }
                        }

                        // ===== PRESENCE =====
                        if (this.features && !msg.key?.fromMe && msg.key.remoteJid !== 'status@broadcast') {
                            this.features.setPresence(msg.key.remoteJid).catch(() => {});
                        }

                        // ===== AUTO-READ =====
                        if (this.features && !msg.key?.fromMe && msg.key.remoteJid !== 'status@broadcast') {
                            await this.features.autoRead(msg);
                        }

                        // ===== AUTO TYPING =====
                        const autoTyping = await this.db.getSetting('autotyping', 'off');
                        if (autoTyping !== 'off' && !msg.key?.fromMe) {
                            const shouldType = 
                                (autoTyping === 'dm' && !isGroup) ||
                                (autoTyping === 'group' && isGroup) ||
                                (autoTyping === 'both');
                            if (shouldType) {
                                await sock.sendPresenceUpdate('composing', from);
                            }
                        }

                        // ===== AUTO RECORDING =====
                        const autoRecording = await this.db.getSetting('autorecording', 'off');
                        if (autoRecording !== 'off' && !msg.key?.fromMe) {
                            const shouldRecord = 
                                (autoRecording === 'dm' && !isGroup) ||
                                (autoRecording === 'group' && isGroup) ||
                                (autoRecording === 'both');
                            if (shouldRecord) {
                                await sock.sendPresenceUpdate('recording', from);
                            }
                        }

                        // ===== CHATBOT (AI RESPONSES) =====
                        const chatbotMode = await this.db.getSetting('chatbot', 'off');
                        const isCommand = text && MessageHelper.isCommand(text, config.PREFIX);

                        let shouldRespond = false;
                        if (chatbotMode === 'both') {
                            shouldRespond = true;
                        } else if (chatbotMode === 'dm' && !isGroup) {
                            shouldRespond = true;
                        } else if (chatbotMode === 'group' && isGroup) {
                            shouldRespond = true;
                        }

                        if (shouldRespond && text && !isCommand && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {

                            await sock.sendPresenceUpdate('composing', from);

                            try {
                                const aiMode = await this.db.getSetting('ai_mode', 'normal');

                                let prompt = text;
                                if (aiMode === 'short') {
                                    prompt = `Answer briefly in 1-2 sentences: ${text}`;
                                } else if (aiMode === 'detailed') {
                                    prompt = `Provide a detailed explanation: ${text}`;
                                }

                                const response = await axios({
                                    method: 'POST',
                                    url: 'https://late-salad-9d56.youngwanga254.workers.dev',
                                    headers: { 'Content-Type': 'application/json' },
                                    data: { 
                                        prompt: prompt, 
                                        model: '@cf/meta/llama-3.1-8b-instruct' 
                                    },
                                    timeout: 15000
                                });

                                let aiResponse = response.data?.data?.response || 
                                                response.data?.response || 
                                                "I'm here to help!";

                                await sock.sendMessage(from, { text: aiResponse }, { quoted: msg });

                            } catch (error) {
                                this.logger.error(`Chatbot API error: ${error.message}`);

                                const fallbacks = [
                                    "I'm here to help! 😊",
                                    "That's interesting! Tell me more.",
                                    "I understand. What else would you like to know?"
                                ];
                                const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                                await sock.sendMessage(from, { text: fallback }, { quoted: msg });
                            }
                        }

                        // ===== COMMAND HANDLER =====
                        if (text && MessageHelper.isCommand(text, config.PREFIX) && msg.key.remoteJid !== 'status@broadcast') {
                            await this.eventHandler.handleCommand(msg, text, from, sender, isGroup);

                            if (this.db) {
                                const commandName = text.slice(config.PREFIX.length).split(/ +/)[0].toLowerCase();
                                await this.db.logCommand(commandName, sender);
                            }
                        }

                    } catch (error) {
                        this.logger.error(`Message processing error: ${error.message}`);
                    }
                }
            });

            // ==================== MESSAGES.UPDATE ====================
            sock.ev.on('messages.update', async (updates) => {
                for (const update of updates) {
                    if (update.update?.message?.protocolMessage?.type === 0) {
                        const key = update.key;
                        const deletedMsg = this.messageStore?.getMessage(key.remoteJid, key.id);

                        if (deletedMsg && this.statusHandler && key.remoteJid === 'status@broadcast') {
                            const deleter = key.participant || key.remoteJid;
                            await this.statusHandler.handleStatusDelete(deletedMsg, key, deleter);
                        }
                    }
                    await this.eventHandler?.handleMessageUpdate(update);
                }
            });

            // ==================== MESSAGES.DELETE ====================
            sock.ev.on('messages.delete', async (deleteData) => {
                await this.eventHandler?.handleMessageDelete(deleteData);
            });

            // ==================== GROUP PARTICIPANTS UPDATE ====================
            sock.ev.on('group-participants.update', (update) => {
                this.eventHandler?.handleGroupUpdate(update);
            });

            // ==================== CALL HANDLER ====================
            sock.ev.on('call', async (calls) => {
                const antiCall = await this.db.getSetting('anticall', 'false');
                if (antiCall !== 'false' && this.features) {
                    await this.features.handleAntiCall(calls);
                }
            });

        } catch (error) {
            this.logger.error(`Main session connection error: ${error.message}`);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async cleanup() {
        this.logger.info('Cleaning up...', '🧹');

        if (this.db) {
            await this.db.save();
        }

        if (this.sock) {
            await this.sock.end();
        }
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