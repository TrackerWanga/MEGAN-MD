const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    isJidGroup,
    isJidStatusBroadcast
} = require('gifted-baileys');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import core modules
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

// Import helpers - USING groupHelper.js (NOT groupHandler.js)
const OwnerHelper = require('./megan/helpers/ownerHelper');
const UserHelper = require('./megan/helpers/userHelper');
const GroupHelper = require('./megan/helpers/groupHelper'); // This is the correct one

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
        this.commandFiles = [];
        this.commandNames = [];
        
        this.startTime = Date.now();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        
        // Initialize helpers
        this.ownerHelper = new OwnerHelper(config);
        this.userHelper = new UserHelper(this.db, this.ownerHelper);
        this.groupHelper = GroupHelper; // Static class
        
        // Message store cleanup every hour
        setInterval(() => this.messageStore?.cleanup(), 60 * 60 * 1000);
        
        // Session file cleanup every 15 minutes
        setInterval(() => this.cleanupSessionFiles(), 15 * 60 * 1000);
        
        // Cache cleanup
        setInterval(() => this.cache?.cleanup(), config.CACHE?.CLEANUP_INTERVAL || 30000);
    }

    async initialize() {
        try {
            // ========== STARTUP SEQUENCE ==========
            console.log('');
            console.log('╔════════════════════════════════════╗');
            console.log('║     𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆 𝐌𝐄𝐆𝐀𝐍       ║');
            console.log('╚════════════════════════════════════╝');
            console.log('');
            
            // Step 1: Session from .env
            console.log('📁 𝐂𝐇𝐄𝐂𝐊𝐈𝐍𝐆 𝐒𝐄𝐒𝐒𝐈𝐎𝐍...');
            await this.setupSession();
            console.log('✅ 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐏𝐑𝐎𝐕𝐈𝐃𝐄𝐃 𝐈𝐍 .𝐄𝐍𝐕');
            console.log('✅ 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘');
            console.log('');
            
            // Step 2: Initialize database
            console.log('🗄️ 𝐂𝐇𝐄𝐂𝐊𝐈𝐍𝐆 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒...');
            if (config.DATABASE.ENABLED) {
                await this.db.initialize();
                console.log('✅ 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃');
            } else {
                console.log('✅ 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 𝐒𝐊𝐈𝐏𝐏𝐄𝐃');
            }
            console.log('');

            // Step 3: Load commands
            console.log('📚 𝐂𝐇𝐄𝐂𝐊𝐈𝐍𝐆 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 𝐅𝐈𝐋𝐄𝐒...');
            await this.loadCommands();
            
            // Step 4: Connect to WhatsApp
            await this.connect();

        } catch (error) {
            this.logger.error(`❌ Initialization error: ${error.message}`);
            process.exit(1);
        }
    }

    async setupSession() {
        const sessionString = process.env.SESSION;
        if (!sessionString) {
            console.log('❌ 𝐍𝐎 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐈𝐍 .𝐄𝐍𝐕');
            process.exit(1);
        }

        await fs.ensureDir(config.SESSION_DIR);
        const sessionData = JSON.parse(sessionString);
        await fs.writeJson(path.join(config.SESSION_DIR, 'creds.json'), sessionData, { spaces: 2 });
        this.logger.success('Session ready');
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, 'wanga/commands');
        
        try {
            await fs.ensureDir(commandsPath);
            const files = await fs.readdir(commandsPath);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            console.log('📋 𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐅𝐈𝐋𝐄𝐒:');
            
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

                    if (commandsArray.length > 0) {
                        this.commandFiles.push(file.replace('.js', '').toUpperCase());
                        
                        commandsArray.forEach(cmd => {
                            if (cmd && cmd.name) {
                                this.commands.set(cmd.name.toLowerCase(), cmd);
                                this.commandNames.push(cmd.name.toLowerCase());
                                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                                    cmd.aliases.forEach(alias => {
                                        this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase());
                                    });
                                }
                            }
                        });
                        
                        console.log(`   📄 ${file.replace('.js', '').toUpperCase()}`);
                    }
                } catch (error) {
                    this.logger.error(`Failed to load ${file}: ${error.message}`);
                }
            }
            
            console.log('');
            console.log(`✅ 𝐋𝐎𝐀𝐃𝐄𝐃 ${this.commands.size} 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒`);
            console.log('');

        } catch (error) {
            this.logger.error(`Failed to load commands: ${error.message}`);
        }
    }

    // Session file cleanup
    async cleanupSessionFiles() {
        try {
            const sessionPath = path.join(config.SESSION_DIR);
            const files = await fs.readdir(sessionPath);
            
            const preKeyFiles = files.filter(f => f.startsWith('pre-key-') && f.endsWith('.json'));
            
            if (preKeyFiles.length <= 10) return;
            
            const fileStats = await Promise.all(
                preKeyFiles.map(async (file) => {
                    const filePath = path.join(sessionPath, file);
                    const stat = await fs.stat(filePath);
                    return { file, path: filePath, mtime: stat.mtimeMs };
                })
            );
            
            fileStats.sort((a, b) => b.mtime - a.mtime);
            const filesToDelete = fileStats.slice(10);
            
            for (const file of filesToDelete) {
                await fs.remove(file.path);
            }
            
        } catch (error) {
            // Silent fail
        }
    }

    async sendStartupMessage() {
        try {
            if (!this.sock) return;
            
            const ownerJid = config.OWNER_NUMBER.includes('@') ? 
                config.OWNER_NUMBER : `${config.OWNER_NUMBER}@s.whatsapp.net`;
            
            // Also send to second number if provided
            const secondNumber = '254769502217';
            const secondJid = `${secondNumber}@s.whatsapp.net`;
            
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            const message = `╔════════════════════════════════════╗\n` +
                `║     𝐌𝐄𝐆𝐀𝐍 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐓𝐀𝐑𝐓𝐄𝐃      ║\n` +
                `╚════════════════════════════════════╝\n\n` +
                
                `🤖 𝐁𝐎𝐔𝐍𝐉𝐎𝐔𝐑! 𝐀𝐌 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐓 𝐁𝐎𝐓\n\n` +
                
                `📌 𝐌𝐄𝐆𝐀𝐍 𝐒𝐓𝐀𝐍𝐃𝐒 𝐅𝐎𝐑:\n` +
                `𝐌𝐔𝐋𝐓𝐈-𝐃𝐄𝐕𝐈𝐂𝐄 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐓 𝐀𝐒𝐒𝐈𝐒𝐓𝐀𝐍𝐓 𝐍𝐄𝐓𝐖𝐎𝐑𝐊\n\n` +
                
                `👤 𝐂𝐑𝐄𝐀𝐓𝐎𝐑: 𝐖𝐀𝐍𝐆𝐀\n` +
                `📱 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: 254758476795\n` +
                `📱 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: 254769502217\n` +
                `🔗 𝐆𝐢𝐭𝐇𝐮𝐛: https://github.com/wangake/MEGAN-MD\n\n` +
                
                `📊 𝐒𝐓𝐀𝐓𝐒:\n` +
                `📚 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${this.commands.size}\n` +
                `📁 𝐅𝐢𝐥𝐞𝐬: ${this.commandFiles.length}\n` +
                `⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞: ${hours}h ${minutes}m\n` +
                `⚡ 𝐌𝐨𝐝𝐞: ${config.MODE}\n` +
                `🔧 𝐏𝐫𝐞𝐟𝐢𝐱: ${config.PREFIX}\n\n` +
                
                `> 𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐰𝐚𝐧𝐠𝐚`;

            await this.sock.sendMessage(ownerJid, { text: message });
            
            if (secondNumber !== config.OWNER_NUMBER) {
                await this.sock.sendMessage(secondJid, { text: message });
            }
            
            this.logger.success(`📨 Startup message sent to owner(s)`);
            
            console.log('');
            console.log('╔════════════════════════════════════╗');
            console.log('║   𝐍𝐎𝐖 𝐒𝐇𝐎𝐖𝐈𝐍𝐆 𝐄𝐕𝐄𝐍𝐓𝐒...       ║');
            console.log('╚════════════════════════════════════╝');
            console.log('');

        } catch (error) {
            this.logger.error(`Failed to send startup message: ${error.message}`);
        }
    }

    async connect() {
        try {
            const { version } = await fetchLatestBaileysVersion();
            this.logger.info(`📱 Using WA version: ${version.join('.')}`);

            const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
            this.logger.info('🔑 Auth loaded');

            const sock = makeWASocket({
                version,
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: config.BROWSER || ["Ubuntu", "Chrome", "20.0.04"],
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

            this.reconnectAttempts = 0;

            // Credentials update
            sock.ev.on('creds.update', () => saveCreds().catch(() => {}));

            // Connection update
            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                
                if (connection === 'open') {
                    this.logger.success('✅ WhatsApp Connected!');
                    this.reconnectAttempts = 0;
                    setTimeout(() => this.sendStartupMessage(), 3000);
                    
                } else if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    
                    if (statusCode === 401) {
                        this.logger.error('❌ Session expired. Please update session.');
                        process.exit(1);
                    }
                    
                    this.logger.warn(`🔄 Connection closed. Reconnecting...`);
                    
                    if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 60000);
                        setTimeout(() => this.connect(), delay);
                    }
                }
            });

            // ==================== MAIN MESSAGE HANDLER ====================
            sock.ev.on('messages.upsert', async ({ messages }) => {
                for (const msg of messages) {
                    try {
                        // Skip own messages
                        if (msg.key?.fromMe) continue;
                        
                        const from = msg.key.remoteJid;
                        const sender = msg.key.participant || from;
                        const isGroup = isJidGroup(from);
                        const isStatus = isJidStatusBroadcast(from);
                        const text = MessageHelper.extractText(msg.message);
                        
                        // Store for anti-delete
                        if (this.messageStore && !msg.key?.fromMe) {
                            this.messageStore.addMessage(msg);
                        }
                        
                        // Log received message
                        if (text && !isStatus) {
                            const senderShort = sender.split('@')[0];
                            const preview = text.substring(0, 40) + (text.length > 40 ? '...' : '');
                            
                            if (MessageHelper.isCommand(text, config.PREFIX)) {
                                this.logger.command(`⌨️ ${senderShort}: ${preview}`);
                            } else {
                                this.logger.message(`📨 ${senderShort}: ${preview}`);
                            }
                        }
                        
                        // ===== ANTI-DELETE DETECTION =====
                        if (msg.message?.protocolMessage?.type === 0) {
                            const deletedId = msg.message.protocolMessage.key.id;
                            const deletedMsg = this.messageStore?.getMessage(msg.key.remoteJid, deletedId);
                            
                            if (deletedMsg && this.features) {
                                const antiDelete = await this.db.getSetting('antidelete', 'on');
                                if (antiDelete !== 'off') {
                                    await this.features.handleAntiDelete(
                                        deletedMsg,
                                        msg.key,
                                        msg.key.participant || msg.key.remoteJid,
                                        deletedMsg.key?.participant || deletedMsg.key?.remoteJid
                                    );
                                }
                            }
                            continue;
                        }
                        
                        // ===== STATUS HANDLER =====
                        if (isStatus && this.statusHandler) {
                            await this.statusHandler.handleStatus(msg);
                            continue;
                        }
                        
                        // ===== VIEW ONCE HANDLER =====
                        if (this.statusHandler && !isStatus) {
                            const isViewOnce = msg.message?.imageMessage?.viewOnce ||
                                             msg.message?.videoMessage?.viewOnce ||
                                             msg.message?.audioMessage?.viewOnce;
                            
                            if (isViewOnce) {
                                await this.statusHandler.handleViewOnce(msg, from, sender);
                            }
                        }
                        
                        // ===== ANTI-LINK CHECK =====
                        if (isGroup && text && this.features) {
                            const antiLink = await this.db.getSetting('antilink', 'off');
                            if (antiLink === 'on') {
                                const handled = await this.features.handleAntiLink(msg, from, sender);
                                if (handled) continue;
                            }
                        }
                        
                        // ===== AUTO-REACT =====
                        if (this.autoReact && !isStatus) {
                            const autoReact = await this.db.getSetting('autoreact', 'off');
                            if (autoReact === 'on') {
                                await this.autoReact.autoReact(msg);
                            }
                        }
                        
                        // ===== AUTO-READ =====
                        if (this.features && !isStatus) {
                            const autoRead = await this.db.getSetting('autoread', 'off');
                            if (autoRead === 'on') {
                                await this.features.autoRead(msg);
                            }
                        }
                        
                        // ===== PRESENCE =====
                        if (this.features && !isStatus) {
                            this.features.setPresence(from).catch(() => {});
                        }
                        
                        // ===== AUTO TYPING =====
                        const autoTyping = await this.db.getSetting('autotyping', 'off');
                        if (autoTyping !== 'off' && !isStatus) {
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
                        if (autoRecording !== 'off' && !isStatus) {
                            const shouldRecord = 
                                (autoRecording === 'dm' && !isGroup) ||
                                (autoRecording === 'group' && isGroup) ||
                                (autoRecording === 'both');
                            if (shouldRecord) {
                                await sock.sendPresenceUpdate('recording', from);
                            }
                        }
                        
                        // ===== CHATBOT =====
                        const chatbotMode = await this.db.getSetting('chatbot', 'off');
                        const isCommand = text && MessageHelper.isCommand(text, config.PREFIX);
                        
                        let shouldRespond = false;
                        if (chatbotMode === 'both') shouldRespond = true;
                        else if (chatbotMode === 'dm' && !isGroup) shouldRespond = true;
                        else if (chatbotMode === 'group' && isGroup) shouldRespond = true;
                        
                        if (shouldRespond && text && !isCommand && !msg.key.fromMe && !isStatus) {
                            await sock.sendPresenceUpdate('composing', from);
                            
                            try {
                                const aiMode = await this.db.getSetting('ai_mode', 'normal');
                                let prompt = text;
                                if (aiMode === 'short') prompt = `Answer briefly in 1-2 sentences: ${text}`;
                                else if (aiMode === 'detailed') prompt = `Provide a detailed explanation: ${text}`;
                                
                                const response = await axios({
                                    method: 'POST',
                                    url: config.API?.CLOUDFLARE_WORKER || 'https://late-salad-9d56.youngwanga254.workers.dev',
                                    headers: { 'Content-Type': 'application/json' },
                                    data: { prompt, model: '@cf/meta/llama-3.1-8b-instruct' },
                                    timeout: 15000
                                });
                                
                                let aiResponse = response.data?.data?.response || response.data?.response || "I'm here to help! 😊";
                                await sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
                                
                            } catch (error) {
                                const fallbacks = ["I'm here to help! 😊", "That's interesting! Tell me more.", "I understand. What else would you like to know?"];
                                const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                                await sock.sendMessage(from, { text: fallback }, { quoted: msg });
                            }
                        }
                        
                        // ===== COMMAND HANDLER =====
                        if (text && MessageHelper.isCommand(text, config.PREFIX) && !isStatus) {
                            if (this.eventHandler) {
                                await this.eventHandler.handleCommand(msg, text, from, sender, isGroup);
                                
                                if (this.db) {
                                    const commandName = text.slice(config.PREFIX.length).split(/ +/)[0].toLowerCase();
                                    await this.db.logCommand(commandName, sender).catch(() => {});
                                }
                            }
                        }
                        
                    } catch (error) {
                        if (error.message && !error.message.includes('pre-key')) {
                            this.logger.error(`Msg error: ${error.message}`);
                        }
                    }
                }
            });

            // ==================== MESSAGE UPDATES ====================
            sock.ev.on('messages.update', (updates) => {
                this.eventHandler?.handleMessageUpdate(updates).catch(() => {});
            });

            // ==================== MESSAGE DELETE ====================
            sock.ev.on('messages.delete', (data) => {
                this.eventHandler?.handleMessageDelete(data).catch(() => {});
            });

            // ==================== GROUP PARTICIPANTS UPDATE ====================
            sock.ev.on('group-participants.update', (update) => {
                this.eventHandler?.handleGroupUpdate(update).catch(() => {});
            });

            // ==================== CALL HANDLER ====================
            sock.ev.on('call', async (calls) => {
                try {
                    const antiCall = await this.db.getSetting('anticall', 'off');
                    if (antiCall === 'on' && this.features) {
                        await this.features.handleAntiCall(calls);
                    }
                } catch (error) {
                    this.logger.error(`Call error: ${error.message}`);
                }
            });

        } catch (error) {
            this.logger.error(`❌ Connection error: ${error.message}`);
            
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 60000);
                setTimeout(() => this.connect(), delay);
            } else {
                this.logger.error('❌ Max reconnection attempts reached. Exiting.');
                process.exit(1);
            }
        }
    }

    async cleanup() {
        this.logger.info('🧹 Cleaning up...');
        
        if (this.db) {
            await this.db.save().catch(() => {});
        }
        
        if (this.sock) {
            await this.sock.end().catch(() => {});
        }
        
        process.exit(0);
    }
}

const bot = new MeganBot();

// Handle process termination
process.on('SIGINT', () => bot.cleanup());
process.on('SIGTERM', () => bot.cleanup());
process.on('uncaughtException', (error) => {
    bot.logger.error(`Uncaught Exception: ${error.message}`);
    bot.cleanup();
});
process.on('unhandledRejection', (error) => {
    bot.logger.error(`Unhandled Rejection: ${error.message}`);
});

// Start the bot
bot.initialize().catch(error => {
    console.error('Failed to start bot:', error);
    process.exit(1);
});