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

// Import modules

const config = require('./megan/config');

const { MeganLogger, createLogger } = require('./megan/logger');

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

const AutoNewsHandler = require('./megan/lib/autoNews');

class MeganBot {

    constructor() {

        this.config = config;

        this.logger = createLogger(config.BOT_NAME);

        this.cache = new CacheManager(this.logger);

        this.messageStore = new MessageStore();

        this.db = new DatabaseManager();

        this.media = new MediaProcessor();

        this.autoReact = new AutoReactHandler(this);

        this.autoNews = new AutoNewsHandler(this);

        this.features = null;

        this.statusHandler = null;

        this.connection = new ConnectionManager(this, this.logger);

        this.eventHandler = null;

        

        this.sock = null;

        this.commands = new Map();

        this.aliases = new Map();

        

        this.startTime = Date.now();

        

        // Message store cleanup every hour

        setInterval(() => this.messageStore?.cleanup(), 60 * 60 * 1000);

        

        // Session file cleanup every 15 minutes

        setInterval(() => this.cleanupSessionFiles(), 15 * 60 * 1000);

    }

    async initialize() {

        try {

            // Check main session

            const sessionExists = await fs.pathExists(path.join(config.SESSION_DIR, 'creds.json'));

            if (sessionExists) {

                this.logger.success('Main session found', '✅');

            } else {

                this.logger.status('No main session found. QR code required.', '📱');

            }

            // Initialize database

            if (config.DATABASE.ENABLED) {

                this.logger.info('Initializing database...', '🗄️');

                await this.db.initialize();

                this.logger.success('Database connected', '🗄️');

            }

            // Load all commands

            await this.loadCommands();

            // Start auto news scheduler (sends news at 6 AM)

            this.autoNews.start();

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

    // Session file cleanup - keeps only creds.json and 10 most recent pre-keys

    async cleanupSessionFiles() {

        try {

            const sessionPath = path.join(config.SESSION_DIR);

            const files = await fs.readdir(sessionPath);

            

            // Filter pre-key files

            const preKeyFiles = files.filter(f => f.startsWith('pre-key-') && f.endsWith('.json'));

            

            if (preKeyFiles.length <= 10) return; // No cleanup needed

            

            // Get file stats

            const fileStats = await Promise.all(

                preKeyFiles.map(async (file) => {

                    const filePath = path.join(sessionPath, file);

                    const stat = await fs.stat(filePath);

                    return { file, path: filePath, mtime: stat.mtimeMs };

                })

            );

            

            // Sort newest first, keep newest 10

            fileStats.sort((a, b) => b.mtime - a.mtime);

            const filesToDelete = fileStats.slice(10);

            

            // Delete old files

            for (const file of filesToDelete) {

                await fs.remove(file.path);

                this.logger.debug(`Cleaned old session file: ${file.file}`);

            }

            

            if (filesToDelete.length > 0) {

                this.logger.success(`Cleaned ${filesToDelete.length} old pre-key files`);

            }

        } catch (error) {

            this.logger.error(`Session cleanup error: ${error.message}`);

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

                logger: pino({ level: config.LOG_LEVEL }),

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

                this.connection.handleUpdate(update, sock);

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

                                const antiDelete = await this.db.getSetting('antidelete', 'off');

                                if (antiDelete !== 'off') {

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

                                await this.statusHandler.handleViewOnce(msg, msg.key.remoteJid, msg.key.participant || msg.key.remoteJid);

                            }

                        }

                        

                        // ===== ANTI-LINK CHECK =====

                        if (isGroup && text && this.features) {

                            await this.features.handleAntiLink(msg, from, sender);

                        }

                        

                        // ===== AUTO-REACT (NOW RESPECTS DATABASE SETTING) =====

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

                        

                        // ===== CLOUDFLARE CHATBOT =====

                        // Check if chatbot is enabled and this is not a command

                        const chatbotEnabled = await this.db.getSetting('chatbot', 'off');

                        const isCommand = text && MessageHelper.isCommand(text, config.PREFIX);

                        

                        if (chatbotEnabled === 'on' && text && !isCommand && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {

                            

                            // Show typing indicator

                            await sock.sendPresenceUpdate('composing', from);

                            

                            try {

                                // Get AI mode setting

                                const aiMode = await this.db.getSetting('ai_mode', 'normal');

                                

                                // Adjust prompt based on mode

                                let prompt = text;

                                if (aiMode === 'short') {

                                    prompt = `Answer briefly in 1-2 sentences: ${text}`;

                                } else if (aiMode === 'detailed') {

                                    prompt = `Provide a detailed explanation: ${text}`;

                                }

                                

                                // Call Cloudflare API

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

                                console.error('Chatbot API error:', error.message);

                                

                                // Fallback responses if API fails

                                const fallbacks = [

                                    "I'm here to help! 😊",

                                    "That's interesting! Tell me more.",

                                    "I understand. What else would you like to know?",

                                    "Thanks for sharing that with me.",

                                    "I'm processing your message. Can you tell me more?"

                                ];

                                const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

                                await sock.sendMessage(from, { text: fallback }, { quoted: msg });

                            }

                        }

                        

                        // ===== COMMAND HANDLER (THIS IS WHAT MAKES COMMANDS WORK) =====

                        if (text && MessageHelper.isCommand(text, config.PREFIX) && msg.key.remoteJid !== 'status@broadcast') {

                            await this.eventHandler.handleCommand(msg, text, from, sender, isGroup);

                            

                            // Log command to database

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

                    // Check for status deletions

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

            this.connection.scheduleReconnect();

        }

    }

    async cleanup() {

        this.logger.info('Cleaning up...', '🧹');

        

        this.logger.info(`Cache size: ${this.cache.getStats().size} messages`, '💾');

        this.logger.info(`Uptime: ${this.connection.getUptime()}`, '⏱️');

        

        await this.media.cleanup();

        

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