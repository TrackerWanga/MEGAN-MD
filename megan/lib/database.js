const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

class DatabaseManager {
    constructor() {
        this.data = {
            settings: {},
            users: {},
            groups: {},
            commands: {}
        };
        this.dbPath = path.join(process.cwd(), 'database.json');
        this.initialized = false;
    }

    async initialize() {
        if (!config.DATABASE.ENABLED) return this;
        
        try {
            // Check if database file exists
            if (await fs.pathExists(this.dbPath)) {
                const fileData = await fs.readFile(this.dbPath, 'utf8');
                this.data = JSON.parse(fileData);
                console.log('📁 Loaded existing database');
            } else {
                // Initialize with default settings
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
        // Default settings
        const defaults = {
            'antidelete': 'false',
            'anticall': 'false',
            'anticall_msg': config.MESSAGES.ANTICALL,
            'antilink_msg': config.MESSAGES.ANTILINK,
            'autoreact': 'false',
            'auto_read': 'false',
            'auto_bio': 'false',
            'presence_inbox': config.PRESENCE.INBOX,
            'presence_group': config.PRESENCE.GROUP,
            'welcome_msg': config.MESSAGES.WELCOME,
            'goodbye_msg': config.MESSAGES.GOODBYE,
            'prefix': config.PREFIX,
            'mode': config.MODE
        };

        for (const [key, value] of Object.entries(defaults)) {
            if (!this.data.settings[key]) {
                this.data.settings[key] = {
                    value: value,
                    type: typeof value,
                    updatedAt: new Date().toISOString()
                };
            }
        }
    }

    // ==================== SETTINGS METHODS ====================

    getSetting(key, defaultValue = null) {
        try {
            const setting = this.data.settings[key];
            if (!setting) return defaultValue;
            
            const value = setting.value;
            const type = setting.type;
            
            if (type === 'boolean') return value === 'true';
            if (type === 'number') return Number(value);
            return value;
        } catch (error) {
            console.error(`Error getting setting ${key}:`, error);
            return defaultValue;
        }
    }

    async setSetting(key, value) {
        try {
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
            await this.updateUser(jid, {
                commandCount: (this.getUser(jid)?.commandCount || 0) + 1
            });
            
            await this.save();
        } catch (error) {
            // Ignore logging errors
        }
    }

    // ==================== STATS METHODS ====================

    getStats() {
        try {
            // Total commands
            let totalCommands = 0;
            const commands = [];
            
            for (const [name, data] of Object.entries(this.data.commands)) {
                totalCommands += data.used;
                commands.push({
                    name,
                    used: data.used
                });
            }
            
            // Sort and get top 5
            const topCommands = commands
                .sort((a, b) => b.used - a.used)
                .slice(0, 5);
            
            // Count users and groups
            const totalUsers = Object.keys(this.data.users).length;
            const totalGroups = Object.keys(this.data.groups).length;
            
            // Count banned and premium users
            let bannedUsers = 0;
            let premiumUsers = 0;
            
            for (const user of Object.values(this.data.users)) {
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
            return null;
        }
    }
}

module.exports = DatabaseManager;
