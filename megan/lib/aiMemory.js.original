// MEGAN-MD AI Memory Manager - SQLite with Sequelize
// Stores conversation history per user/group with auto-cleanup

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

class AIMemoryManager {
    constructor(db) {
        this.db = db;
        this.sequelize = db.sequelize;
        this.models = {};
        this.memoryLimit = 50; // Max messages per chat
        this.storageLimit = 5 * 1024 * 1024; // 5MB limit
        this.retentionHours = 24; // Keep messages for 24 hours
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return this;

        // Define ChatMemory model
        this.models.ChatMemory = this.sequelize.define('ChatMemory', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            chatId: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'JID of the chat (DM or group)'
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'JID of the user sending message'
            },
            role: {
                type: DataTypes.ENUM('user', 'assistant', 'system'),
                allowNull: false,
                defaultValue: 'user'
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            tokens: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'Approximate token count for context management'
            }
        }, {
            tableName: 'chat_memory',
            timestamps: true,
            indexes: [
                { fields: ['chatId'] },
                { fields: ['userId'] },
                { fields: ['timestamp'] },
                { fields: ['chatId', 'timestamp'] }
            ]
        });

        // Define MemoryStats model for storage tracking
        this.models.MemoryStats = this.sequelize.define('MemoryStats', {
            chatId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            messageCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            storageBytes: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            lastActivity: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        }, {
            tableName: 'memory_stats',
            timestamps: true
        });

        await this.models.ChatMemory.sync({ alter: true });
        await this.models.MemoryStats.sync({ alter: true });

        this.initialized = true;
        console.log('✅ AI Memory tables initialized');

        // Start auto-cleanup every hour
        setInterval(() => this.cleanup(), 60 * 60 * 1000);
        
        return this;
    }

    // Add a message to memory
    async addMessage(chatId, userId, role, content) {
        try {
            if (!chatId || !userId || !role || !content) return false;

            // Estimate tokens (rough: 4 chars = 1 token)
            const tokens = Math.ceil(content.length / 4);

            // Create memory entry
            const memory = await this.models.ChatMemory.create({
                chatId,
                userId,
                role,
                content,
                tokens,
                timestamp: new Date()
            });

            // Update stats
            await this.updateStats(chatId);

            // Trim if exceeds limit
            await this.trimChat(chatId);

            // Check storage limit
            await this.checkStorageLimit();

            return true;
        } catch (error) {
            console.error('Add memory error:', error);
            return false;
        }
    }

    // Get conversation history for a chat
    async getHistory(chatId, limit = 20) {
        try {
            const messages = await this.models.ChatMemory.findAll({
                where: { chatId },
                order: [['timestamp', 'ASC']],
                limit: limit,
                attributes: ['role', 'content', 'userId', 'timestamp']
            });

            return messages.map(msg => ({
                role: msg.role,
                content: msg.content,
                userId: msg.userId,
                timestamp: msg.timestamp
            }));
        } catch (error) {
            console.error('Get history error:', error);
            return [];
        }
    }

    // Get formatted conversation for AI (system + history)
    async getConversationContext(chatId, systemPrompt, currentQuery, limit = 15) {
        const history = await this.getHistory(chatId, limit);
        
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: currentQuery }
        ];

        return messages;
    }

    // Clear memory for a chat
    async clearMemory(chatId, userId = null) {
        try {
            const where = { chatId };
            if (userId) where.userId = userId;

            const deleted = await this.models.ChatMemory.destroy({ where });
            
            if (deleted > 0) {
                await this.updateStats(chatId);
            }
            
            return deleted;
        } catch (error) {
            console.error('Clear memory error:', error);
            return 0;
        }
    }

    // Trim chat to limit (keep most recent)
    async trimChat(chatId) {
        try {
            const count = await this.models.ChatMemory.count({ where: { chatId } });
            
            if (count > this.memoryLimit) {
                const excess = count - this.memoryLimit;
                const oldest = await this.models.ChatMemory.findAll({
                    where: { chatId },
                    order: [['timestamp', 'ASC']],
                    limit: excess,
                    attributes: ['id']
                });
                
                const ids = oldest.map(m => m.id);
                await this.models.ChatMemory.destroy({ where: { id: ids } });
                console.log(`🧹 Trimmed ${ids.length} messages from ${chatId}`);
            }
        } catch (error) {
            console.error('Trim chat error:', error);
        }
    }

    // Update storage stats for a chat
    async updateStats(chatId) {
        try {
            const messages = await this.models.ChatMemory.findAll({
                where: { chatId },
                attributes: ['content']
            });

            const messageCount = messages.length;
            const storageBytes = messages.reduce((total, msg) => {
                return total + (msg.content?.length || 0) * 2; // Rough estimate: 2 bytes per char
            }, 0);

            await this.models.MemoryStats.upsert({
                chatId,
                messageCount,
                storageBytes,
                lastActivity: new Date()
            });

            return { messageCount, storageBytes };
        } catch (error) {
            console.error('Update stats error:', error);
            return null;
        }
    }

    // Get memory stats for a chat
    async getStats(chatId) {
        try {
            const stats = await this.models.MemoryStats.findOne({ where: { chatId } });
            return stats || { messageCount: 0, storageBytes: 0 };
        } catch (error) {
            console.error('Get stats error:', error);
            return { messageCount: 0, storageBytes: 0 };
        }
    }

    // Check and enforce global storage limit
    async checkStorageLimit() {
        try {
            const totalStats = await this.models.MemoryStats.findAll({
                attributes: [
                    [this.sequelize.fn('SUM', this.sequelize.col('storageBytes')), 'totalBytes']
                ]
            });

            const totalBytes = totalStats[0]?.dataValues?.totalBytes || 0;
            
            if (totalBytes > this.storageLimit) {
                // Clean up oldest messages from most active chats
                const oldMessages = await this.models.ChatMemory.findAll({
                    order: [['timestamp', 'ASC']],
                    limit: 100,
                    attributes: ['id']
                });
                
                const ids = oldMessages.map(m => m.id);
                await this.models.ChatMemory.destroy({ where: { id: ids } });
                console.log(`🧹 Storage limit reached, cleaned ${ids.length} old messages`);
                
                // Update all stats
                const chats = await this.models.ChatMemory.findAll({
                    attributes: ['chatId'],
                    group: ['chatId']
                });
                
                for (const chat of chats) {
                    await this.updateStats(chat.chatId);
                }
            }
        } catch (error) {
            console.error('Check storage limit error:', error);
        }
    }

    // Auto-cleanup old messages (24+ hours)
    async cleanup() {
        try {
            const cutoff = new Date();
            cutoff.setHours(cutoff.getHours() - this.retentionHours);
            
            const deleted = await this.models.ChatMemory.destroy({
                where: {
                    timestamp: { [this.sequelize.Op.lt]: cutoff }
                }
            });
            
            if (deleted > 0) {
                console.log(`🧹 Cleaned up ${deleted} old messages (${this.retentionHours}h retention)`);
                
                // Update stats for affected chats
                const chats = await this.models.ChatMemory.findAll({
                    attributes: ['chatId'],
                    group: ['chatId']
                });
                
                for (const chat of chats) {
                    await this.updateStats(chat.chatId);
                }
            }
            
            return deleted;
        } catch (error) {
            console.error('Auto-cleanup error:', error);
            return 0;
        }
    }

    // Get total storage usage
    async getTotalStorage() {
        try {
            const result = await this.models.MemoryStats.findAll({
                attributes: [
                    [this.sequelize.fn('SUM', this.sequelize.col('storageBytes')), 'totalBytes'],
                    [this.sequelize.fn('COUNT', this.sequelize.col('chatId')), 'totalChats']
                ]
            });
            
            const totalBytes = result[0]?.dataValues?.totalBytes || 0;
            const totalChats = result[0]?.dataValues?.totalChats || 0;
            
            return {
                bytes: totalBytes,
                mb: (totalBytes / (1024 * 1024)).toFixed(2),
                chats: totalChats,
                limitMB: (this.storageLimit / (1024 * 1024)).toFixed(0)
            };
        } catch (error) {
            console.error('Get total storage error:', error);
            return { bytes: 0, mb: 0, chats: 0, limitMB: 5 };
        }
    }

    // Check if user is muted/blacklisted
    async canInteract(userId, chatId) {
        // Check blacklist
        const blacklist = await this.db.getSetting('blacklist', []);
        if (blacklist.includes(userId)) return false;
        
        // Check mute
        const muted = await this.db.getSetting('muted', {});
        if (muted[userId] && muted[userId] > Date.now()) return false;
        
        return true;
    }
}

module.exports = AIMemoryManager;
