// megan/lib/database.js

const { sequelize, User, Group, Setting, DeletedMessage, Warning, CommandStat } = require('../models');

class DatabaseManager {

    constructor() {

        this.initialized = false;

        this.models = { User, Group, Setting, DeletedMessage, Warning, CommandStat };

    }

    async initialize() {

        try {

            await sequelize.authenticate();

            await sequelize.sync({ alter: true });

            this.initialized = true;

            console.log('✅ SQLite database connected');

        } catch (error) {

            console.error('❌ Database error:', error.message);

            throw error;

        }

    }

    // ===== SETTINGS =====

    async getSetting(key, defaultValue = null) {

        try {

            const setting = await Setting.findOne({ where: { key } });

            if (!setting) return defaultValue;

            

            // Try to parse JSON, fallback to string

            try {

                return JSON.parse(setting.value);

            } catch {

                return setting.value;

            }

        } catch (error) {

            console.error(`Error getting setting ${key}:`, error.message);

            return defaultValue;

        }

    }

    async setSetting(key, value) {

        try {

            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            await Setting.upsert({ key, value: stringValue });

            return true;

        } catch (error) {

            console.error(`Error setting ${key}:`, error.message);

            return false;

        }

    }

    async getAllSettings() {

        try {

            const settings = await Setting.findAll();

            const result = {};

            settings.forEach(s => {

                try {

                    result[s.key] = JSON.parse(s.value);

                } catch {

                    result[s.key] = s.value;

                }

            });

            return result;

        } catch (error) {

            console.error('Error getting all settings:', error.message);

            return {};

        }

    }

    // ===== USERS =====

    async getUser(jid) {

        try {

            return await User.findOne({ where: { jid } });

        } catch (error) {

            console.error('Error getting user:', error.message);

            return null;

        }

    }

    async updateUser(jid, data) {

        try {

            const [user, created] = await User.upsert({

                jid,

                ...data,

                lastSeen: new Date()

            });

            return user;

        } catch (error) {

            console.error('Error updating user:', error.message);

            return null;

        }

    }

    async getAllUsers() {

        try {

            return await User.findAll();

        } catch (error) {

            console.error('Error getting all users:', error.message);

            return [];

        }

    }

    // ===== GROUPS =====

    async getGroup(jid) {

        try {

            return await Group.findOne({ where: { jid } });

        } catch (error) {

            console.error('Error getting group:', error.message);

            return null;

        }

    }

    async updateGroup(jid, data) {

        try {

            const [group, created] = await Group.upsert({

                jid,

                ...data

            });

            return group;

        } catch (error) {

            console.error('Error updating group:', error.message);

            return null;

        }

    }

    async getAllGroups() {

        try {

            return await Group.findAll();

        } catch (error) {

            console.error('Error getting all groups:', error.message);

            return [];

        }

    }

    // ===== DELETED MESSAGES =====

    async logDeletedMessage(data) {

        try {

            return await DeletedMessage.create(data);

        } catch (error) {

            console.error('Error logging deleted message:', error.message);

            return null;

        }

    }

    async getDeletedMessages(chatJid, limit = 50) {

        try {

            return await DeletedMessage.findAll({

                where: { chatJid },

                order: [['deletedAt', 'DESC']],

                limit

            });

        } catch (error) {

            console.error('Error getting deleted messages:', error.message);

            return [];

        }

    }

    // ===== WARNINGS =====

    async addWarning(userJid, groupJid, reason, issuedBy) {

        try {

            return await Warning.create({

                userJid,

                groupJid,

                reason,

                issuedBy

            });

        } catch (error) {

            console.error('Error adding warning:', error.message);

            return null;

        }

    }

    async getUserWarnings(userJid, groupJid = null) {

        try {

            const where = { userJid };

            if (groupJid) where.groupJid = groupJid;

            

            return await Warning.findAll({

                where,

                order: [['issuedAt', 'DESC']]

            });

        } catch (error) {

            console.error('Error getting warnings:', error.message);

            return [];

        }

    }

    async getWarningCount(userJid, groupJid = null) {

        try {

            const where = { userJid };

            if (groupJid) where.groupJid = groupJid;

            

            return await Warning.count({ where });

        } catch (error) {

            console.error('Error counting warnings:', error.message);

            return 0;

        }

    }

    async clearWarnings(userJid, groupJid = null) {

        try {

            const where = { userJid };

            if (groupJid) where.groupJid = groupJid;

            

            await Warning.destroy({ where });

            return true;

        } catch (error) {

            console.error('Error clearing warnings:', error.message);

            return false;

        }

    }

    // ===== COMMAND STATS =====

    async logCommand(command, userJid, groupJid = null) {

        try {

            await CommandStat.create({

                command,

                userJid,

                groupJid

            });

            

            // Update user command count

            const user = await this.getUser(userJid);

            if (user) {

                await user.increment('commandCount');

            } else {

                await this.updateUser(userJid, { commandCount: 1 });

            }

            

            return true;

        } catch (error) {

            console.error('Error logging command:', error.message);

            return false;

        }

    }

    async getCommandStats(limit = 50) {

        try {

            return await CommandStat.findAll({

                order: [['executedAt', 'DESC']],

                limit

            });

        } catch (error) {

            console.error('Error getting command stats:', error.message);

            return [];

        }

    }

    async getTopCommands(limit = 10) {

        try {

            const [results] = await sequelize.query(`

                SELECT command, COUNT(*) as count

                FROM CommandStats

                GROUP BY command

                ORDER BY count DESC

                LIMIT ${limit}

            `);

            return results;

        } catch (error) {

            console.error('Error getting top commands:', error.message);

            return [];

        }

    }

    // ===== STATS =====

    async getStats() {

        try {

            const userCount = await User.count();

            const groupCount = await Group.count();

            const warningCount = await Warning.count();

            const deletedCount = await DeletedMessage.count();

            const commandCount = await CommandStat.count();

            

            return {

                users: userCount,

                groups: groupCount,

                warnings: warningCount,

                deletedMessages: deletedCount,

                totalCommands: commandCount

            };

        } catch (error) {

            console.error('Error getting stats:', error.message);

            return {

                users: 0,

                groups: 0,

                warnings: 0,

                deletedMessages: 0,

                totalCommands: 0

            };

        }

    }

    async save() {

        // SQLite auto-saves, nothing needed

        return true;

    }

}

module.exports = DatabaseManager;