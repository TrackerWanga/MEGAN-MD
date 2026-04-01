// index.js - COMPLETE FIXED VERSION with working buttons and features
// NOW REACTS TO AND READS YOUR MESSAGES TOO!

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    isJidGroup,
    isJidStatusBroadcast,
    downloadMediaMessage,
    jidNormalizedUser,
    Browsers,
    DisconnectReason
} = require('gifted-baileys');

const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const axios = require('axios');
const dotenv = require('dotenv');
const { Boom } = require('@hapi/boom');
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
const MediaProcessor = require('./megan/lib/mediaProcessor');
const StatusHandler = require('./megan/lib/statusHandler');
const AutoReactHandler = require('./megan/lib/autoReact');
const NewsletterManager = require('./megan/lib/newsletter');
const SessionDecoder = require('./megan/helpers/sessionDecoder');
const OwnerManager = require('./megan/helpers/ownerManager');
const Buttons = require('./megan/lib/buttons');

class MeganBot {
    constructor() {
        this.config = config;
        this.logger = createLogger(config.BOT_NAME);
        this.cache = new CacheManager(this.logger);
        this.messageStore = new MessageStore();
        this.db = new DatabaseManager();
        this.media = new MediaProcessor();
        this.autoReact = new AutoReactHandler(this);
        this.connection = new ConnectionManager(this, this.logger);
        this.ownerManager = new OwnerManager();

        // Initialize buttons as null first
        this.buttons = null;

        this.sock = null;
        this.commands = new Map();
        this.aliases = new Map();
        this.commandNames = [];
        this.startTime = Date.now();

        // Newsletter toggle
        this.useNewsletter = process.env.USE_NEWSLETTER === 'true' || false;

        // Default feature states (all OFF by default)
        this.defaultFeatures = {
            autoread: 'off',
            autoreact: 'off',
            chatbot: 'off',
            antilink: 'off',
            anticall: 'off',
            antidelete: 'on',
            autoviewonce: 'off',
            status_auto_view: 'off',
            status_auto_react: 'off',
            status_auto_download: 'off'
        };

        // Store owner IDs
        this.ownerJid = null;
        this.ownerLid = null;

        // Track first message per user
        this.firstMessageSent = new Set();

        // Create required folders
        this.createRequiredFolders();

        // Message store cleanup every hour
        setInterval(() => this.messageStore?.cleanup(), 60 * 60 * 1000);

        // Session file cleanup every 15 minutes
        setInterval(() => this.cleanupSessionFiles(), 15 * 60 * 1000);
    }

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
            // Check if we should use pairing or session
            if (process.env.PAIRING_NUMBER) {
                await this.setupPairing();
            } else {
                await this.setupSession();
            }

            if (config.DATABASE.ENABLED) {
                this.logger.info('Initializing database...', '🗄️');
                await this.db.initialize();
                this.logger.success('Database connected', '🗄️');

                // Load newsletter setting from DB
                this.useNewsletter = await this.db.getSetting('use_newsletter', this.useNewsletter);

                // Initialize default settings if they don't exist
                await this.initializeDefaultSettings();
            }

            // Initialize owner manager with database
            await this.ownerManager.initialize(this.db);

            // Load all commands
            await this.loadCommands();

            // Set database for messageStore
            if (this.messageStore) {
                this.messageStore.setDatabase(this.db);
            }

            // Start cleanup intervals
            setInterval(() => this.cache.cleanup(), config.CACHE.CLEANUP_INTERVAL || 30000);

            // Auto-bio update if enabled
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

    async initializeDefaultSettings() {
        for (const [key, defaultValue] of Object.entries(this.defaultFeatures)) {
            const exists = await this.db.getSetting(key);
            if (exists === null) {
                await this.db.setSetting(key, defaultValue);
                this.logger.debug(`Initialized setting: ${key} = ${defaultValue}`);
            }
        }
    }

    async setupSession() {
        const sessionString = process.env.SESSION;

        if (!sessionString) {
            this.logger.error('No SESSION in .env and no PAIRING_NUMBER set');
            process.exit(1);
        }

        const mainSessionDir = path.join(config.SESSION_DIR || './sessions', 'main');
        await fs.ensureDir(mainSessionDir);
        const credsPath = path.join(mainSessionDir, 'creds.json');

        try {
            let sessionData;

            if (SessionDecoder.isValid(sessionString)) {
                this.logger.info('🔐 Detected Megan~ base64 session format');
                sessionData = SessionDecoder.decode(sessionString);
                this.logger.success('✅ Base64 session decoded successfully');
            } else {
                try {
                    sessionData = JSON.parse(sessionString);
                    this.logger.success('✅ JSON session loaded');
                } catch (jsonError) {
                    this.logger.error('❌ Invalid JSON session format');
                    throw new Error('Session must be either valid JSON or Megan~ base64 format');
                }
            }

            await fs.writeJson(credsPath, sessionData, { spaces: 2 });
            config.SESSION_DIR = mainSessionDir;
            this.logger.success(`📁 Session saved to ${mainSessionDir}`);

        } catch (error) {
            this.logger.error(`❌ Failed to process session: ${error.message}`);
            process.exit(1);
        }
    }

    async setupPairing() {
        const phoneNumber = process.env.PAIRING_NUMBER;

        if (!phoneNumber) {
            this.logger.error('PAIRING_NUMBER not set in .env');
            process.exit(1);
        }

        this.logger.info(`📱 Using pairing code for: ${phoneNumber}`, '🔐');

        const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR || './sessions');

        const tempSock = makeWASocket({
            auth: state,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: false
        });

        tempSock.ev.on('creds.update', saveCreds);

        try {
            const code = await tempSock.requestPairingCode(phoneNumber);
            this.logger.success(`✅ Pairing code: ${code}`, '🔐');
            console.log('\n=================================');
            console.log(`📱 PAIRING CODE: ${code}`);
            console.log('=================================\n');

            // Wait for connection
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Pairing timeout'));
                }, 60000);

                tempSock.ev.on('connection.update', (update) => {
                    const { connection, lastDisconnect } = update;
                    if (connection === 'open') {
                        clearTimeout(timeout);
                        this.logger.success('✅ Paired successfully!');
                        resolve();
                    } else if (connection === 'close') {
                        clearTimeout(timeout);
                        const statusCode = lastDisconnect?.error instanceof Boom
                            ? lastDisconnect.error.output?.statusCode
                            : 500;

                        if (statusCode === DisconnectReason.loggedOut) {
                            reject(new Error('Logged out'));
                        } else {
                            reject(new Error('Connection closed'));
                        }
                    }
                });
            });

            await tempSock.end();

        } catch (error) {
            this.logger.error(`❌ Pairing failed: ${error.message}`);
            process.exit(1);
        }
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, 'wanga/commands');

        try {
            await fs.ensureDir(commandsPath);

            // Get all .js files in the commands directory
            const files = await fs.readdir(commandsPath);
            const jsFiles = files.filter(file => file.endsWith('.js'));

            this.logger.info(`Found ${jsFiles.length} command files`, '📂');

            let cmdCount = 0;
            let failedFiles = [];

            for (const file of jsFiles) {
                try {
                    const filePath = path.join(commandsPath, file);

                    // Clear require cache
                    delete require.cache[require.resolve(filePath)];

                    // Import the command module
                    const cmdModule = require(filePath);

                    // Handle different export patterns
                    let commandsArray = [];

                    if (cmdModule.commands && Array.isArray(cmdModule.commands)) {
                        commandsArray = cmdModule.commands;
                    } else if (Array.isArray(cmdModule)) {
                        commandsArray = cmdModule;
                    } else if (cmdModule.default && cmdModule.default.commands) {
                        commandsArray = cmdModule.default.commands;
                    } else if (cmdModule.default && Array.isArray(cmdModule.default)) {
                        commandsArray = cmdModule.default;
                    } else {
                        const possibleCmd = cmdModule.default || cmdModule;
                        if (possibleCmd && possibleCmd.name && possibleCmd.execute) {
                            commandsArray = [possibleCmd];
                        } else {
                            failedFiles.push({ file, reason: 'No valid command export found' });
                            continue;
                        }
                    }

                    if (commandsArray.length === 0) {
                        failedFiles.push({ file, reason: 'Empty commands array' });
                        continue;
                    }

                    let fileCmdCount = 0;

                    commandsArray.forEach(cmd => {
                        if (cmd && cmd.name) {
                            this.commands.set(cmd.name.toLowerCase(), cmd);
                            this.commandNames.push(cmd.name.toLowerCase());

                            if (cmd.aliases && Array.isArray(cmd.aliases)) {
                                cmd.aliases.forEach(alias => {
                                    this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase());
                                });
                            }

                            fileCmdCount++;
                            cmdCount++;
                        }
                    });

                    this.logger.info(`✅ Loaded: ${file} (${fileCmdCount} commands)`);

                } catch (error) {
                    failedFiles.push({ file, reason: error.message });
                    this.logger.error(`❌ Failed to load ${file}: ${error.message}`);
                }
            }

            this.logger.success(`✅ Total commands loaded: ${cmdCount}`, '📚');

            if (failedFiles.length > 0) {
                this.logger.warn(`⚠️ Failed to load ${failedFiles.length} files:`, '⚠️');
                failedFiles.forEach(f => {
                    this.logger.warn(`   • ${f.file}: ${f.reason}`);
                });
            }

            if (cmdCount > 0) {
                const cmdList = Array.from(this.commands.keys()).slice(0, 10).join(', ');
                this.logger.info(`📋 Sample commands: ${cmdList}${cmdCount > 10 ? '...' : ''}`);
            }

        } catch (error) {
            this.logger.error(`❌ Failed to load commands: ${error.message}`);
        }
    }

    async cleanupSessionFiles() {
        try {
            const sessionPath = path.join(config.SESSION_DIR || './sessions');
            const files = await fs.readdir(sessionPath).catch(() => []);

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

            if (filesToDelete.length > 0) {
                this.logger.success(`Cleaned ${filesToDelete.length} old pre-key files`);
            }
        } catch (error) {
            // Silent fail
        }
    }

    // Format message based on newsletter setting
    formatMessage(content, title = '', options = {}) {
        if (this.useNewsletter && this.newsletterManager) {
            return this.newsletterManager.formatWithNewsletter(content, title, options);
        } else {
            let result = '';
            if (title) result += `*${title}*\n\n`;
            result += content;
            if (options.footer) result += `\n\n${options.footer}`;
            return result;
        }
    }

    // Send message with newsletter formatting
    async sendFormattedMessage(jid, content, options = {}, quoted = null) {
        const text = this.formatMessage(
            content.text || content,
            options.title,
            { footer: options.footer || config.FOOTER }
        );

        return this.sock.sendMessage(jid, { text }, { quoted });
    }

    // Chatbot handler
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

            const response = await axios({
                method: 'POST',
                url: 'https://megan-api.trackerwanga254.workers.dev',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    messages: [
                        {
                            role: 'system',
                            content: `You are a WhatsApp bot AI called MEGAN-MD. You are helpful, friendly, and created by TrackerWanga. Your responses should be concise and appropriate for WhatsApp.`
                        },
                        {
                            role: 'user',
                            content: text
                        }
                    ]
                },
                timeout: 15000
            });

            let aiResponse = response.data?.response?.response ||
                           response.data?.response ||
                           "I'm here to help! 😊";

            const formattedResponse = this.formatMessage(
                aiResponse,
                'MEGAN-AI',
                { footer: config.FOOTER }
            );

            await this.sock.sendMessage(from, { text: formattedResponse }, { quoted: msg });
            return true;

        } catch (error) {
            this.logger.error(`Chatbot error: ${error.message}`);
            return false;
        }
    }

    async sendStartupMessage() {
        try {
            if (!this.sock) return;

            const ownerJid = config.OWNER_NUMBER.includes('@') ?
                config.OWNER_NUMBER : `${config.OWNER_NUMBER}@s.whatsapp.net`;

            const commandCount = this.commands.size;

            const autoread = await this.db.getSetting('autoread', 'off');
            const autoreact = await this.db.getSetting('autoreact', 'off');
            const chatbot = await this.db.getSetting('chatbot', 'off');

            const message = this.formatMessage(
                `📱 *Bot:* ${config.BOT_NAME}\n` +
                `👤 *Owner:* ${config.OWNER_NAME}\n` +
                `📞 *Number:* ${config.OWNER_NUMBER}\n` +
                `🔧 *Prefix:* ${config.PREFIX}\n` +
                `📚 *Commands:* ${commandCount}\n` +
                `📰 *Newsletter:* ${this.useNewsletter ? 'ON' : 'OFF'}\n\n` +
                `⚙️ *Features:*\n` +
                `• Auto-read: ${autoread === 'on' ? '✅' : '❌'}\n` +
                `• Auto-react: ${autoreact === 'on' ? '✅' : '❌'}\n` +
                `• Chatbot: ${chatbot === 'on' ? '✅' : '❌'}`,
                '✅ BOT CONNECTED',
                { footer: '> created by wanga' }
            );

            await this.sock.sendMessage(ownerJid, { text: message });
            this.logger.success(`Startup message sent to owner`);
        } catch (error) {
            this.logger.error(`Failed to send startup message: ${error.message}`);
        }
    }

    // Toggle newsletter mode
    async toggleNewsletter(enabled) {
        this.useNewsletter = enabled;
        await this.db.setSetting('use_newsletter', enabled);
        if (this.newsletterManager) {
            this.newsletterManager.setEnabled(enabled);
        }
        this.logger.info(`Newsletter mode: ${enabled ? 'ON' : 'OFF'}`, '📰');
        return enabled;
    }

    async connect() {
        try {
            const { version } = await fetchLatestBaileysVersion();
            this.logger.info(`Using WA version: ${version.join('.')}`, '📱');

            const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR || './sessions');
            this.logger.info('Main session auth loaded', ' 🔑');

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

            // Initialize buttons with sock and bot instance
            this.buttons = new Buttons(sock, this);

            // Initialize handlers
            this.statusHandler = new StatusHandler(this);
            this.newsletterManager = new NewsletterManager(this, this.useNewsletter);
            this.eventHandler = new EventHandler(this, this.logger, this.cache);
            this.features = this.eventHandler?.features; // Link features

            // Credentials update
            sock.ev.on('creds.update', () => {
                this.logger.info('Session credentials updated, saving...', '🔑');
                saveCreds();
            });

            // Connection update
            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'connecting') {
                    this.logger.connection('Connecting to WhatsApp...', '🔄');
                }

                if (connection === 'open') {
                    this.ownerJid = sock.user?.id;
                    this.ownerLid = sock.user?.lid;
                    this.logger.success('Connected!', '✅');
                    this.logger.info(`Owner JID: ${this.ownerJid}`);
                    if (this.ownerLid) this.logger.info(`Owner LID: ${this.ownerLid}`);
                    setTimeout(() => this.sendStartupMessage(), 2000);
                }

                if (connection === 'close') {
                    this.isConnected = false;
                    const statusCode = lastDisconnect?.error instanceof Boom
                        ? lastDisconnect.error.output?.statusCode
                        : 500;

                    this.logger.connection(`Connection closed with code: ${statusCode}`, '🔌');

                    if (statusCode === DisconnectReason.loggedOut) {
                        this.logger.error('❌ Session expired/logged out! Please get a new session.', '🚫');
                        process.exit(1);
                    }

                    if (statusCode === DisconnectReason.connectionClosed) {
                        this.logger.warn('Connection closed, reconnecting...', '🔄');
                    }

                    const shouldReconnect = statusCode !== 401;
                    if (shouldReconnect) {
                        setTimeout(() => this.connect(), 5000);
                    }
                }
            });

            // ============================================
            // MESSAGES.UPSERT - MAIN MESSAGE HANDLER
            // ============================================
            sock.ev.on('messages.upsert', async ({ messages }) => {
                for (const msg of messages) {
                    try {
                        const from = msg.key.remoteJid;
                        const sender = msg.key.participant || from;
                        const isGroup = isJidGroup(from);
                        const isStatus = from === 'status@broadcast';
                        const text = MessageHelper.extractText(msg.message);

                        // ADD LOGGING TO SEE MESSAGES
                        if (!isStatus && text) {
                            const senderShort = sender.split('@')[0];
                            this.logger.message(`📨 Message from ${senderShort}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
                        }

                        // ANTI-DELETE DETECTION (Protocol messages)
                        if (msg.message?.protocolMessage?.type === 0) {
                            const deletedId = msg.message.protocolMessage.key.id;
                            const deletedMsg = await this.messageStore?.getMessage(from, deletedId);

                            if (deletedMsg && this.eventHandler) {
                                const deleter = msg.key.participant || from;
                                const originalSender = deletedMsg.key?.participant || deletedMsg.key?.remoteJid;
                                await this.eventHandler.handleAntiDelete(deletedMsg, msg.key, deleter, originalSender);
                            }
                            continue;
                        }

                        // ========== FAST PATH: STATUS MESSAGES ==========
                        if (isStatus) {
                            if (this.statusHandler) {
                                await this.statusHandler.handleStatus(msg);
                            }
                            continue;
                        }

                        // ========== STORE MESSAGE FOR ANTI-DELETE ==========
                        if (this.messageStore) {
                            await this.messageStore.addMessage(msg);
                        }

                        // ========== CHECK IF USER IS BLACKLISTED ==========
                        if (this.ownerManager && this.ownerManager.isOwner) {
                            const isOwner = this.ownerManager.isOwner(sender);
                            const isBlacklisted = await this.db?.getSetting('blacklist', []).then(bl => bl.includes(sender));

                            if (isBlacklisted && !isOwner) {
                                continue;
                            }
                        }

                        // ========== ANTI-LINK (HIGHEST PRIORITY FOR GROUPS) ==========
                        if (isGroup && text && this.eventHandler) {
                            const handled = await this.eventHandler.handleAntiLink(msg, from, sender);
                            if (handled) continue;
                        }

                        // ========== AUTO-READ (IMMEDIATE) - NOW REACTS TO ALL MESSAGES INCLUDING OWNER'S ==========
                        const autoReadEnabled = await this.db?.getSetting('autoread', 'off');
                        if (autoReadEnabled === 'on' && !isStatus && this.features) {
                            // REMOVED the !msg.key.fromMe condition
                            this.features.autoRead(msg).catch(() => {});
                        }

                        // ========== VIEW-ONCE DETECTION ==========
                        if (!msg.key.fromMe && this.eventHandler) {
                            const isViewOnce = msg.message?.imageMessage?.viewOnce ||
                                              msg.message?.videoMessage?.viewOnce ||
                                              msg.message?.audioMessage?.viewOnce;

                            if (isViewOnce) {
                                const autoViewOnce = await this.db?.getSetting('auto_view_once', 'off');
                                if (autoViewOnce === 'on') {
                                    setTimeout(() => {
                                        this.eventHandler.handleViewOnce(msg, from, sender).catch(() => {});
                                    }, 1000);
                                }
                            }
                        }

                        // ========== AUTO-REACT (500ms DELAY) - NOW REACTS TO ALL MESSAGES INCLUDING OWNER'S ==========
                        const autoReactEnabled = await this.db?.getSetting('autoreact', 'off');
                        if (autoReactEnabled === 'on' && !isStatus && this.autoReact) {
                            // REMOVED the !msg.key.fromMe condition
                            setTimeout(() => {
                                this.autoReact.autoReact(msg).catch((e) => {
                                    this.logger.error(`Auto-react failed: ${e.message}`);
                                });
                            }, 500);
                        }

                        // ========== FIRST MESSAGE WELCOME (DM ONLY) ==========
                        if (!this.firstMessageSent.has(sender) && !msg.key?.fromMe && !isGroup && !isStatus) {
                            this.firstMessageSent.add(sender);
                            const dmWelcome = await this.db?.getSetting('first_welcome', 'on');
                            if (dmWelcome === 'on') {
                                setTimeout(() => {
                                    const welcomeMsg = this.formatMessage(
                                        `Hello! I'm ${config.BOT_NAME}. Use ${config.PREFIX}menu to see my commands.`,
                                        'Welcome!',
                                        { footer: config.FOOTER }
                                    );
                                    this.sock.sendMessage(from, { text: welcomeMsg }, { quoted: msg }).catch(() => {});
                                }, 500);
                            }
                        }

                        // ========== CHATBOT ==========
                        if (text && !msg.key.fromMe && !isStatus) {
                            await this.handleChatbot(msg, text, from, sender, isGroup);
                        }

                        // ========== COMMAND PROCESSING ==========
                        if (text && MessageHelper.isCommand(text, config.PREFIX)) {
                            if (this.eventHandler) {
                                await this.eventHandler.handleCommand(msg, text, from, sender, isGroup);

                                if (this.db) {
                                    const commandName = text.slice(config.PREFIX.length).split(/ +/)[0].toLowerCase();
                                    await this.db.logCommand(commandName, sender);
                                }
                            }
                        }

                    } catch (error) {
                        this.logger.error(`Message error: ${error.message}`);
                    }
                }
            });

            // ============================================
            // MESSAGES.UPDATE - FOR REACTIONS & DELETIONS
            // ============================================
            sock.ev.on('messages.update', async (updates) => {
                for (const update of updates) {
                    try {
                        if (update.key.remoteJid === 'status@broadcast' &&
                            update.update?.message?.protocolMessage?.type === 0) {
                            const deletedMsg = await this.messageStore?.getMessage(
                                update.key.remoteJid,
                                update.key.id
                            );
                            if (deletedMsg && this.statusHandler) {
                                const deleter = update.key.participant || update.key.remoteJid;
                                await this.statusHandler.handleStatusDelete(deletedMsg, update.key, deleter);
                            }
                        }

                        await this.eventHandler?.handleMessageUpdate(update);

                    } catch (error) {
                        this.logger.error(`Update error: ${error.message}`);
                    }
                }
            });

            // ============================================
            // MESSAGES.DELETE - ANTI-DELETE
            // ============================================
            sock.ev.on('messages.delete', async (deleteData) => {
                const keys = deleteData.keys || deleteData;
                if (!keys || !Array.isArray(keys)) return;

                for (const key of keys) {
                    try {
                        const cachedMsg = await this.messageStore?.getMessage(key.remoteJid, key.id);

                        if (cachedMsg && this.eventHandler) {
                            const deleter = key.participant || key.remoteJid;
                            const sender = cachedMsg.key?.participant || cachedMsg.key?.remoteJid;

                            await this.eventHandler.handleAntiDelete(cachedMsg, key, deleter, sender);
                            await this.messageStore?.removeMessage(key.remoteJid, key.id);
                        }

                    } catch (error) {
                        this.logger.error(`Delete error: ${error.message}`);
                    }
                }
            });

            // ============================================
            // GROUP PARTICIPANTS UPDATE - WELCOME/GOODBYE
            // ============================================
            sock.ev.on('group-participants.update', (update) => {
                this.eventHandler?.handleGroupUpdate(update);
            });

            // ============================================
            // CALL HANDLER - ANTI-CALL
            // ============================================
            sock.ev.on('call', async (calls) => {
                const antiCall = await this.db?.getSetting('anticall', 'off');
                if (antiCall !== 'off' && this.eventHandler) {
                    await this.eventHandler.handleAntiCall(calls);
                }
            });

        } catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async cleanup() {
        this.logger.info('Cleaning up...', '🧹');
        if (this.db) await this.db.save();
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
