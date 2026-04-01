// MEGAN-MD Database Manager - Original Working Version

const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
const config = require('../config');

class DatabaseManager {
    constructor() {
        this.sequelize = null;
        this.models = {};
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return this;

        try {
            const dbPath = path.join(process.cwd(), config.DATABASE.STORAGE);

            console.log('🗄️  Connecting to SQLite database...');
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: dbPath,
                logging: false,
                define: { timestamps: true, underscored: true }
            });

            await this.sequelize.authenticate();
            console.log('✅ Database connected');

            // Define only essential models
            this.models.Setting = this.sequelize.define('Setting', {
                key: { type: DataTypes.STRING, unique: true, allowNull: false },
                value: { type: DataTypes.TEXT }
            });

            this.models.Message = this.sequelize.define('Message', {
                messageId: { type: DataTypes.STRING, unique: true, allowNull: false },
                chatJid: { type: DataTypes.STRING, allowNull: false },
                senderJid: { type: DataTypes.STRING, allowNull: false },
                messageData: { type: DataTypes.TEXT('long'), allowNull: false },
                textContent: { type: DataTypes.TEXT },
                mediaUrl: { type: DataTypes.STRING },
                messageType: { type: DataTypes.STRING },
                isViewOnce: { type: DataTypes.BOOLEAN, defaultValue: false },
                isStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
                timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
            });

            this.models.OriginalMessage = this.sequelize.define('OriginalMessage', {
                messageId: { type: DataTypes.STRING, unique: true, allowNull: false },
                chatJid: { type: DataTypes.STRING, allowNull: false },
                messageData: { type: DataTypes.TEXT('long'), allowNull: false },
                timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
            });

            this.models.DeletedMessage = this.sequelize.define('DeletedMessage', {
                messageId: { type: DataTypes.STRING },
                chatJid: { type: DataTypes.STRING },
                senderJid: { type: DataTypes.STRING },
                deleterJid: { type: DataTypes.STRING },
                messageData: { type: DataTypes.TEXT('long') },
                messageType: { type: DataTypes.STRING },
                content: { type: DataTypes.TEXT },
                mediaUrl: { type: DataTypes.STRING },
                isStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
                deletedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
            });

            this.models.LidMapping = this.sequelize.define('LidMapping', {
                lid: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
                jid: { type: DataTypes.STRING, allowNull: false },
                source: { type: DataTypes.STRING, defaultValue: 'group' },
                lastSeen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
            }, { tableName: 'lid_mappings', timestamps: true });

            // Simple anti-link table (working)
            this.models.GroupAntiLink = this.sequelize.define('GroupAntiLink', {
                groupJid: { type: DataTypes.STRING, allowNull: false, unique: true },
                enabled: { type: DataTypes.BOOLEAN, defaultValue: false }
            });

            await this.sequelize.sync({ alter: true });

            await this.initDefaultSettings();

            this.initialized = true;
            console.log('✅ All tables ready');

        } catch (error) {
            console.error('Database error:', error.message);
            throw error;
        }
        return this;
    }

    async initDefaultSettings() {
        const defaults = {
            timezone: 'Africa/Nairobi',
            bot_name: config.BOT_NAME,
            owner_name: config.OWNER_NAME,
            prefix: config.PREFIX,
            mode: config.MODE || 'public',
            footer: config.FOOTER,
            autotyping_dm: 'off',
            autotyping_group: 'off',
            autorecording_dm: 'off',
            autorecording_group: 'off',
            presence_dm: 'typing',
            presence_group: 'typing',
            chatbot: 'off',
            autoread: 'off',
            autoreact: 'off',
            antidelete: 'on',
            antiedit: 'on',
            anticall: 'off',
            autoviewonce: 'on',
            status_auto_view: 'on',
            status_auto_react: 'off',
            status_auto_download: 'off',
            status_react_emojis: '💛,❤️,💜,💙,👍,🔥',
            status_anti_delete: 'off',
            welcome: 'off',
            goodbye: 'off',
            welcomemessage: 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.',
            goodbyemessage: 'Goodbye @user! 👋',
            first_welcome: 'on',
            anticall_msg: '📞 Calls are not allowed!',
            ai_mode: 'normal'
        };

        for (const [key, value] of Object.entries(defaults)) {
            const exists = await this.getSetting(key);
            if (exists === null) {
                await this.setSetting(key, value);
            }
        }
    }

    async getSetting(key, defaultValue = null) {
        try {
            if (this.cache.has(key)) {
                const cached = this.cache.get(key);
                if (Date.now() - cached.timestamp < this.cacheTTL) {
                    return cached.value;
                }
                this.cache.delete(key);
            }

            const setting = await this.models.Setting.findOne({ where: { key } });
            let value = defaultValue;

            if (setting) {
                try {
                    value = JSON.parse(setting.value);
                } catch {
                    value = setting.value;
                }
            }

            this.cache.set(key, { value, timestamp: Date.now() });
            return value;
        } catch (error) {
            return defaultValue;
        }
    }

    async setSetting(key, value) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await this.models.Setting.upsert({ key, value: stringValue });
            this.cache.set(key, { value, timestamp: Date.now() });
            return true;
        } catch (error) {
            return false;
        }
    }

    async enableGroupAntiLink(groupJid) {
        try {
            await this.models.GroupAntiLink.upsert({ groupJid, enabled: true });
            return true;
        } catch (error) {
            return false;
        }
    }

    async disableGroupAntiLink(groupJid) {
        try {
            await this.models.GroupAntiLink.destroy({ where: { groupJid } });
            return true;
        } catch (error) {
            return false;
        }
    }

    async isGroupAntiLinkEnabled(groupJid) {
        try {
            const record = await this.models.GroupAntiLink.findOne({ where: { groupJid } });
            return record ? record.enabled : false;
        } catch (error) {
            return false;
        }
    }

    async saveMessage(messageData) {
        try {
            return await this.models.Message.create(messageData);
        } catch (error) {
            return null;
        }
    }

    async getMessage(chatJid, messageId) {
        try {
            return await this.models.Message.findOne({
                where: { chatJid, messageId }
            });
        } catch (error) {
            return null;
        }
    }

    async storeOriginalMessage(messageId, chatJid, messageData) {
        try {
            return await this.models.OriginalMessage.upsert({
                messageId,
                chatJid,
                messageData: JSON.stringify(messageData)
            });
        } catch (error) {
            return null;
        }
    }

    async getOriginalMessage(chatJid, messageId) {
        try {
            const record = await this.models.OriginalMessage.findOne({
                where: { chatJid, messageId }
            });
            if (record && record.messageData) {
                return JSON.parse(record.messageData);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async logDeletedMessage(data) {
        try {
            return await this.models.DeletedMessage.create(data);
        } catch (error) {
            return null;
        }
    }

    async persistLidMapping(lid, jid, source = 'group') {
        try {
            if (!lid || !jid) return false;
            if (!lid.endsWith('@lid')) return false;
            if (!jid.endsWith('@s.whatsapp.net')) return false;
            await this.models.LidMapping.upsert({ lid, jid, source, lastSeen: new Date() });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getLidMappingFromDb(lid) {
        try {
            if (!lid || !lid.endsWith('@lid')) return null;
            const row = await this.models.LidMapping.findOne({ where: { lid } });
            return row ? row.jid : null;
        } catch (error) {
            return null;
        }
    }

    async save() {
        return true;
    }
}

module.exports = DatabaseManager;
