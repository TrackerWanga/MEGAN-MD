const fs = require('fs-extra');

const path = require('path');

const config = require('../config');

class DatabaseManager {

    constructor() {

        this.data = {

            settings: {},  // Keep for backward compatibility

            users: {},

            groups: {},

            commands: {}

        };

        this.dbPath = path.join(process.cwd(), 'database.json');

        this.initialized = false;

        this.config = config; // Store config reference

    }

    async initialize() {

        try {

            // Check if database file exists

            if (await fs.pathExists(this.dbPath)) {

                const fileData = await fs.readFile(this.dbPath, 'utf8');

                this.data = JSON.parse(fileData);

                console.log('📁 Loaded existing database');

            } else {

                // Initialize with default structure

                await this.initDefaultSettings();

                await this.save();

                console.log('🆕 Created new database');

            }

            

            this.initialized = true;

            

            // Auto-save every 30 seconds

            setInterval(() => this.save(), 30000);

            

            return this;

        } catch (error) {

            console.error('❌ Database initialization error:', error);

            return this;

        }

    }

    async save() {

        if (!this.initialized) return;

        

        try {

            await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));

        } catch (error) {

            console.error('Error saving database:', error);

        }

    }

    async initDefaultSettings() {

        // Initialize settings object if it doesn't exist

        if (!this.data.settings) this.data.settings = {};

        

        // Default settings from config

        const defaults = {

            'antidelete': config.FEATURES?.ANTI_DELETE || 'false',

            'anticall': config.FEATURES?.ANTICALL || 'false',

            'anticall_msg': config.MESSAGES?.ANTICALL || '📞 Calls are not allowed! I will reject your call.',

            'antilink': config.FEATURES?.ANTILINK || 'false',

            'antilink_msg': config.MESSAGES?.ANTILINK || '⚠️ Links are not allowed in this group!',

            'autoreact': config.FEATURES?.AUTOREACT || 'false',

            'auto_read': config.FEATURES?.AUTO_READ || 'false',

            'auto_bio': config.FEATURES?.AUTO_BIO || 'false',

            'presence_inbox': config.PRESENCE?.INBOX || 'typing',

            'presence_group': config.PRESENCE?.GROUP || 'typing',

            'welcome_msg': config.MESSAGES?.WELCOME || '👋 Welcome to the group!',

            'goodbye_msg': config.MESSAGES?.GOODBYE || '👋 Goodbye!',

            'prefix': config.PREFIX || '.',

            'mode': config.MODE || 'public',

            'chatbot': config.CHATBOT_ENABLED ? 'on' : 'off',

            

            // Status settings

            'status_auto_view': config.STATUS?.AUTO_VIEW ? 'true' : 'false',

            'status_auto_download': config.STATUS?.AUTO_DOWNLOAD ? 'true' : 'false',

            'status_auto_react': config.STATUS?.AUTO_REACT ? 'true' : 'false',

            'status_auto_reply': config.STATUS?.AUTO_REPLY ? 'true' : 'false',

            'status_react_emojis': config.STATUS?.REACT_EMOJIS || '💛,❤️,💜,🤍,💙,👍,🔥',

            'status_reply_text': config.STATUS?.REPLY_TEXT || '✅ Status viewed via Megan-MD',

            'status_anti_delete': config.STATUS?.ANTI_DELETE ? 'true' : 'false',

            

            // View once

            'auto_view_once': config.FEATURES?.AUTO_VIEW_ONCE || 'false'

        };

        for (const [key, value] of Object.entries(defaults)) {

            if (!this.data.settings[key]) {

                this.data.settings[key] = {

                    value: String(value),

                    type: typeof value,

                    updatedAt: new Date().toISOString()

                };

            }

        }

    }

    // ==================== SETTINGS METHODS ====================

    getSetting(key, defaultValue = null) {

        try {

            // First check if it exists in database

            const setting = this.data.settings?.[key];

            if (setting) {

                const value = setting.value;

                const type = setting.type;

                

                if (type === 'boolean') return value === 'true';

                if (type === 'number') return Number(value);

                return value;

            }

            

            // If not in database, check config as fallback

            return this.getConfigFallback(key, defaultValue);

        } catch (error) {

            console.error(`Error getting setting ${key}:`, error);

            return this.getConfigFallback(key, defaultValue);

        }

    }

    getConfigFallback(key, defaultValue) {

        // Map database keys to config paths

        const configMap = {

            'antidelete': config.FEATURES?.ANTI_DELETE,

            'anticall': config.FEATURES?.ANTICALL,

            'anticall_msg': config.MESSAGES?.ANTICALL,

            'antilink': config.FEATURES?.ANTILINK,

            'antilink_msg': config.MESSAGES?.ANTILINK,

            'autoreact': config.FEATURES?.AUTOREACT,

            'auto_read': config.FEATURES?.AUTO_READ,

            'auto_bio': config.FEATURES?.AUTO_BIO,

            'presence_inbox': config.PRESENCE?.INBOX,

            'presence_group': config.PRESENCE?.GROUP,

            'welcome_msg': config.MESSAGES?.WELCOME,

            'goodbye_msg': config.MESSAGES?.GOODBYE,

            'prefix': config.PREFIX,

            'mode': config.MODE,

            'chatbot': config.CHATBOT_ENABLED ? 'on' : 'off',

            'status_auto_view': config.STATUS?.AUTO_VIEW ? 'true' : 'false',

            'status_auto_download': config.STATUS?.AUTO_DOWNLOAD ? 'true' : 'false',

            'status_auto_react': config.STATUS?.AUTO_REACT ? 'true' : 'false',

            'status_auto_reply': config.STATUS?.AUTO_REPLY ? 'true' : 'false',

            'status_react_emojis': config.STATUS?.REACT_EMOJIS,

            'status_reply_text': config.STATUS?.REPLY_TEXT,

            'status_anti_delete': config.STATUS?.ANTI_DELETE ? 'true' : 'false',

            'auto_view_once': config.FEATURES?.AUTO_VIEW_ONCE

        };

        return configMap[key] !== undefined ? configMap[key] : defaultValue;

    }

    async setSetting(key, value) {

        try {

            if (!this.data.settings) this.data.settings = {};

            

            this.data.settings[key] = {

                value: String(value),

                type: typeof value,

                updatedAt: new Date().toISOString()

            };

            

            await this.save();

            return true;

        } catch (error) {

            console.error(`Error setting ${key}:`, error);

            return false;

        }

    }

    // Alias for getSetting (some code uses getName)

    getName(key, defaultValue = null) {

        return this.getSetting(key, defaultValue);

    }

    // ==================== USER METHODS ====================

    getUser(jid) {

        try {

            return this.data.users[jid] || null;

        } catch (error) {

            console.error('Error getting user:', error);

            return null;

        }

    }

    async updateUser(jid, data) {

        try {

            if (!this.data.users[jid]) {

                this.data.users[jid] = {

                    jid,

                    warns: 0,

                    banned: false,

                    premium: false,

                    commandCount: 0,

                    ...data,

                    createdAt: new Date().toISOString(),

                    lastSeen: new Date().toISOString()

                };

            } else {

                this.data.users[jid] = {

                    ...this.data.users[jid],

                    ...data,

                    lastSeen: new Date().toISOString()

                };

            }

            

            await this.save();

            return true;

        } catch (error) {

            console.error('Error updating user:', error);

            return false;

        }

    }

    // ==================== GROUP METHODS ====================

    getGroup(jid) {

        try {

            return this.data.groups[jid] || null;

        } catch (error) {

            console.error('Error getting group:', error);

            return null;

        }

    }

    async updateGroup(jid, data) {

        try {

            if (!this.data.groups[jid]) {

                this.data.groups[jid] = {

                    jid,

                    ...data,

                    createdAt: new Date().toISOString(),

                    updatedAt: new Date().toISOString()

                };

            } else {

                this.data.groups[jid] = {

                    ...this.data.groups[jid],

                    ...data,

                    updatedAt: new Date().toISOString()

                };

            }

            

            await this.save();

            return true;

        } catch (error) {

            console.error('Error updating group:', error);

            return false;

        }

    }

    // ==================== COMMAND METHODS ====================

    async logCommand(command, jid) {

        try {

            // Update command count

            if (!this.data.commands[command]) {

                this.data.commands[command] = {

                    name: command,

                    used: 1,

                    lastUsed: new Date().toISOString()

                };

            } else {

                this.data.commands[command].used += 1;

                this.data.commands[command].lastUsed = new Date().toISOString();

            }

            

            // Update user command count

            const user = this.getUser(jid) || { commandCount: 0 };

            user.commandCount = (user.commandCount || 0) + 1;

            await this.updateUser(jid, { commandCount: user.commandCount });

            

            await this.save();

        } catch (error) {

            // Ignore logging errors

        }

    }

    // ==================== STATS METHODS ====================

    getStats() {

        try {

            let totalCommands = 0;

            const commands = [];

            

            for (const [name, data] of Object.entries(this.data.commands || {})) {

                totalCommands += data.used || 0;

                commands.push({

                    name,

                    used: data.used || 0

                });

            }

            

            // Sort and get top 5

            const topCommands = commands

                .sort((a, b) => b.used - a.used)

                .slice(0, 5);

            

            const totalUsers = Object.keys(this.data.users || {}).length;

            const totalGroups = Object.keys(this.data.groups || {}).length;

            

            let bannedUsers = 0;

            let premiumUsers = 0;

            

            for (const user of Object.values(this.data.users || {})) {

                if (user.banned) bannedUsers++;

                if (user.premium) premiumUsers++;

            }

            

            return {

                totalCommands,

                totalUsers,

                totalGroups,

                bannedUsers,

                premiumUsers,

                topCommands

            };

        } catch (error) {

            console.error('Error getting stats:', error);

            return {

                totalCommands: 0,

                totalUsers: 0,

                totalGroups: 0,

                bannedUsers: 0,

                premiumUsers: 0,

                topCommands: []

            };

        }

    }

}

module.exports = DatabaseManager;