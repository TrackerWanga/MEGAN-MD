//made by tracker wanga 
//whatsapp 254758476795
//don't snitch 
const {

    isJidGroup,

    isJidStatusBroadcast

} = require('gifted-baileys');

const MessageHelper = require('../lib/message');

const config = require('../config');

class EventHandler {

    constructor(bot, logger, cache, features) {

        this.bot = bot;

        this.sock = bot.sock;

        this.logger = logger;

        this.cache = cache;

        this.features = features;

    }

    // Handle new messages

    async handleMessage(msg) {

        try {

            if (!msg.message || !msg.key) return;

            const from = msg.key.remoteJid;

            const sender = msg.key.participant || from;

            

            // Check JID types

            const isGroup = isJidGroup(from);

            const isStatus = isJidStatusBroadcast(from);

            const isNewsletter = from.endsWith('@newsletter');

            const isLid = from.endsWith('@lid');

            // Determine message type

            let messageType = 'PVT';

            if (isGroup) messageType = 'GROUP';

            else if (isStatus) messageType = 'STATUS';

            else if (isNewsletter) messageType = 'NEWSLETTER';

            else if (isLid) messageType = 'LID';

            // Extract message content

            const text = MessageHelper.extractText(msg.message);

            const mediaType = MessageHelper.getMediaType(msg.message);

            // Skip protocol messages

            if (msg.message.protocolMessage) {

                return;

            }

            // Auto Read feature (skip for status)

            if (this.features && !isStatus) {

                await this.features.autoRead(msg);

            }

            // Anti Link feature for groups

            if (isGroup && text && this.features) {

                const handled = await this.features.handleAntiLink(msg, from, sender);

                if (handled) return; // Message was deleted

            }

            // Auto React feature (skip for status)

            if (this.features && !isStatus && !msg.key.fromMe) {

                const setting = this.bot.db?.getSetting('autoreact', 'false');

                if (setting === 'true') {

                    const emoji = this.features.getRandomEmoji();

                    await this.features.autoReact(emoji, msg);

                }

            }

            // Presence feature (skip for status)

            if (this.features && !isStatus && !isNewsletter) {

                // Don't await - let it run in background

                this.features.setPresence(from).catch(() => {});

            }

            // Cache message

            if (config.CACHE.MESSAGES && (isStatus || isGroup)) {

                this.cache.set(msg.key.id, {

                    message: msg,

                    text,

                    mediaType,

                    from,

                    sender,

                    key: msg.key

                }, messageType);

            }

            // Log message

            if (text || mediaType) {

                const contentToShow = text || mediaType || 'NO TEXT';

                const groupName = isGroup ? from.split('@')[0] : null;

                

                this.logger.messageLog(

                    messageType,

                    sender,

                    contentToShow,

                    msg.key.id,

                    isGroup,

                    groupName

                );

            }

            // Handle commands

            if (!isStatus && !isNewsletter && text && MessageHelper.isCommand(text, config.PREFIX)) {

                await this.handleCommand(msg, text, from, sender, isGroup);

                

                // Log command to database

                if (this.bot.db) {

                    const commandName = text.slice(config.PREFIX.length).split(/ +/)[0].toLowerCase();

                    await this.bot.db.logCommand(commandName, sender);

                }

            }

        } catch (error) {

            this.logger.error(`Message handling error: ${error.message}`);

        }

    }

    // Handle commands

    async handleCommand(msg, text, from, sender, isGroup) {

        const parsed = MessageHelper.parseCommand(text, config.PREFIX);

        if (!parsed) return;

        const { name: commandName, args, fullText } = parsed;

        const senderShort = sender.split('@')[0];

        this.logger.command(`${commandName} from ${senderShort}`);

        // Find command

        let cmd = this.bot.commands.get(commandName);

        if (!cmd && this.bot.aliases.has(commandName)) {

            cmd = this.bot.commands.get(this.bot.aliases.get(commandName));

        }

        if (cmd) {

            try {

                // Create context for command

                const context = {

                    msg,

                    from,

                    sender,

                    isGroup,

                    args,

                    command: commandName,

                    text: fullText,

                    fullText: text,

                    bot: this.bot,

                    sock: this.sock,

                    reply: MessageHelper.createReply(this.sock, from, msg),

                    react: MessageHelper.createReact(this.sock, msg.key)

                };

                await cmd.execute(context);

                this.logger.command(`${commandName} executed successfully`, '✅');

            } catch (error) {

                this.logger.error(`Command error (${commandName}): ${error.message}`);

                await this.sock.sendMessage(from, {

                    text: `❌ Error: ${error.message}`

                }, { quoted: msg });

            }

        } else {

            this.logger.command(`Unknown command: ${commandName}`, '❓');

        }

    }

    // Handle message updates (reactions, status)

    async handleMessageUpdate(update) {

        try {

            const { key, update: msgUpdate } = update;

            if (msgUpdate?.reaction) {

                this.logger.message(`Reaction on ${key.id.substring(0, 8)}: ${msgUpdate.reaction.text}`, '👍');

            }

            if (msgUpdate?.status !== undefined) {

                const statuses = {

                    1: '📤 Sent',

                    2: '✅ Delivered',

                    3: '👁️ Read',

                    4: '🕒 Pending'

                };

                this.logger.message(`Status update for ${key.id.substring(0, 8)}: ${statuses[msgUpdate.status] || msgUpdate.status}`, '📨');

            }

        } catch (error) {

            // Ignore update errors

        }

    }

    // Handle message delete - UPDATED for better compatibility

    async handleMessageDelete(deleteData) {

        try {

            // Handle both formats: { keys: [...] } or array of keys

            const keys = deleteData.keys || deleteData;

            

            if (!keys || !Array.isArray(keys)) return;

            this.logger.debug(`Delete event received with ${keys.length} keys`);

            for (const key of keys) {

                // Get the deleted message from messageStore

                const cachedMsg = this.bot.messageStore?.getMessage(key.remoteJid, key.id);

                

                if (cachedMsg && this.features) {

                    // Determine who deleted it

                    const deleter = key.participant || key.remoteJid;

                    const sender = cachedMsg.key?.participant || cachedMsg.key?.remoteJid;

                    

                    // Process anti-delete

                    await this.features.handleAntiDelete(

                        cachedMsg,

                        key,

                        deleter,

                        sender

                    );

                    

                    // Remove from store after processing

                    this.bot.messageStore?.removeMessage(key.remoteJid, key.id);

                }

            }

        } catch (error) {

            this.logger.error(`Message delete error: ${error.message}`);

        }

    }

    // Handle group participants update

    async handleGroupUpdate(update) {

        this.logger.group(`Participants ${update.action} in ${update.id.split('@')[0]}:`, '👥');

        console.log('   └ Participants:', update.participants.map(p => p.split('@')[0]).join(', '));

        // Welcome/Goodbye messages

        if (update.action === 'add') {

            const welcomeMsg = this.bot.db?.getSetting('welcome_msg', config.MESSAGES.WELCOME);

            

            for (const participant of update.participants) {

                await this.sock.sendMessage(update.id, {

                    text: `👋 Welcome @${participant.split('@')[0]}!\n\n${welcomeMsg || config.MESSAGES.WELCOME}`,

                    mentions: [participant]

                });

            }

        } else if (update.action === 'remove') {

            const goodbyeMsg = this.bot.db?.getSetting('goodbye_msg', config.MESSAGES.GOODBYE);

            

            for (const participant of update.participants) {

                await this.sock.sendMessage(update.id, {

                    text: `👋 @${participant.split('@')[0]} left the group.\n\n${goodbyeMsg || config.MESSAGES.GOODBYE}`,

                    mentions: [participant]

                });

            }

        }

    }

}

module.exports = EventHandler;