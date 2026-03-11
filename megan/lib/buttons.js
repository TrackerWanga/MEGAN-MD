// megan/lib/buttons.js

const { sendButtons, sendInteractiveMessage } = require('gifted-btns');

class Buttons {

    constructor(sock, bot) {

        this.sock = sock;

        this.bot = bot;

        this.channelLink = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';

    }

    /**

     * Send simple buttons (URL, Copy only - no quick_reply)

     */

    async send(jid, options, quoted = null) {

        try {

            const buttonOptions = {

                title: options.title || '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',

                text: options.text || 'Choose an option:',

                footer: options.footer || '© 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',

                buttons: options.buttons || []

            };

            return await sendButtons(this.sock, jid, buttonOptions, { quoted });

        } catch (error) {

            console.error('Button error:', error);

            return null;

        }

    }

    /**

     * Send interactive message with quick_reply buttons

     */

    async sendInteractive(jid, options, quoted = null) {

        try {

            return await sendInteractiveMessage(this.sock, jid, {

                text: options.text,

                footer: options.footer,

                interactiveButtons: options.buttons || []

            }, { quoted });

        } catch (error) {

            console.error('Interactive button error:', error);

            return null;

        }

    }

    /**

     * Send welcome message to new DM users (shorter, less annoying)

     */

    async sendWelcome(jid, sender, quoted = null) {

        const senderNumber = sender.split('@')[0];

        const prefix = process.env.PREFIX || '.';

        

        return await this.sendInteractive(jid, {

            text: `👋 Hello @${senderNumber}!\n\nI'm here to help. Use the menu below or type ${prefix}menu.`,

            footer: 'Choose an option:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📋 Menu',

                        id: 'show_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send startup message with copy session button

     */

    async sendStartup(jid, bot) {

        const commandCount = bot.commands.size;

        const mode = process.env.MODE || 'public';

        

        // Create session copy button if needed

        const sessionData = process.env.SESSION || '';

        

        const buttons = [

            {

                name: 'cta_url',

                buttonParamsJson: JSON.stringify({

                    display_text: '📢 Join Channel',

                    url: this.channelLink

                })

            }

        ];

        

        // Add copy button if session exists

        if (sessionData) {

            buttons.unshift({

                name: 'cta_copy',

                buttonParamsJson: JSON.stringify({

                    display_text: '📋 Copy Session',

                    copy_code: sessionData

                })

            });

        }

        

        return await this.send(jid, {

            title: '✅ MEGAN-MD CONNECTED',

            text: `📱 *Bot:* ${bot.config.BOT_NAME}\n` +

                  `👑 *Owner:* ${bot.config.OWNER_NAME}\n` +

                  `🔧 *Prefix:* ${bot.config.PREFIX}\n` +

                  `📚 *Commands:* ${commandCount}\n` +

                  `⚙️ *Mode:* ${mode}`,

            footer: 'Bot is ready!',

            buttons: buttons

        });

    }

    /**

     * Send main menu with quick_reply buttons

     */

    async sendMenu(jid, sender, isOwner, quoted = null) {

        const senderNumber = sender.split('@')[0];

        const prefix = process.env.PREFIX || '.';

        

        const buttons = [

            {

                name: 'quick_reply',

                buttonParamsJson: JSON.stringify({

                    display_text: '🤖 AI Chat',

                    id: 'menu_ai'

                })

            },

            {

                name: 'quick_reply',

                buttonParamsJson: JSON.stringify({

                    display_text: '⬇️ Download',

                    id: 'menu_download'

                })

            },

            {

                name: 'quick_reply',

                buttonParamsJson: JSON.stringify({

                    display_text: '👥 Group',

                    id: 'menu_group'

                })

            },

            {

                name: 'quick_reply',

                buttonParamsJson: JSON.stringify({

                    display_text: '🛠️ Tools',

                    id: 'menu_tools'

                })

            }

        ];

        // Add owner button if owner

        if (isOwner) {

            buttons.push({

                name: 'quick_reply',

                buttonParamsJson: JSON.stringify({

                    display_text: '👑 Owner',

                    id: 'menu_owner'

                })

            });

        }

        // Add channel button (URL)

        buttons.push({

            name: 'cta_url',

            buttonParamsJson: JSON.stringify({

                display_text: '📢 Channel',

                url: this.channelLink

            })

        });

        return await this.sendInteractive(jid, {

            text: `Welcome @${senderNumber}!\n\n• Prefix: ${prefix}\n• Commands: 230+\n• Status: ${isOwner ? '👑 Owner' : '👤 User'}`,

            footer: 'Select a category:',

            buttons: buttons

        }, quoted);

    }

    /**

     * Send AI menu

     */

    async sendAIMenu(jid, prefix, quoted = null) {

        return await this.sendInteractive(jid, {

            text: `🤖 *AI COMMANDS*\n\n• ${prefix}megan - Megan AI\n• ${prefix}chatgpt - ChatGPT\n• ${prefix}gemini - Gemini\n• ${prefix}llama - Llama\n• ${prefix}copilot - Fast AI`,

            footer: 'Choose an option:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '◀️ Back',

                        id: 'back_to_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send download menu

     */

    async sendDownloadMenu(jid, prefix, quoted = null) {

        return await this.sendInteractive(jid, {

            text: `⬇️ *DOWNLOAD COMMANDS*\n\n• ${prefix}play - Audio\n• ${prefix}music - Voice note\n• ${prefix}mp3 - MP3\n• ${prefix}ytmp3 - YouTube audio\n• ${prefix}ytmp4 - YouTube video`,

            footer: 'Choose an option:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '◀️ Back',

                        id: 'back_to_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send group menu

     */

    async sendGroupMenu(jid, prefix, quoted = null) {

        return await this.sendInteractive(jid, {

            text: `👥 *GROUP COMMANDS*\n\n• ${prefix}add - Add\n• ${prefix}remove - Remove\n• ${prefix}promote - Promote\n• ${prefix}demote - Demote\n• ${prefix}tagall - Tag all`,

            footer: 'Choose an option:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '◀️ Back',

                        id: 'back_to_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send tools menu

     */

    async sendToolsMenu(jid, prefix, quoted = null) {

        return await this.sendInteractive(jid, {

            text: `🛠️ *TOOLS*\n\n• ${prefix}sticker - Sticker\n• ${prefix}toimage - To image\n• ${prefix}say - TTS\n• ${prefix}translate - Translate\n• ${prefix}ssweb - Screenshot`,

            footer: 'Choose an option:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '◀️ Back',

                        id: 'back_to_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send owner menu

     */

    async sendOwnerMenu(jid, prefix, quoted = null) {

        return await this.sendInteractive(jid, {

            text: `👑 *OWNER COMMANDS*\n\n• ${prefix}mode - Change mode\n• ${prefix}setprefix - Change prefix\n• ${prefix}setbotpic - Set pic\n• ${prefix}block - Block user`,

            footer: 'Owner only:',

            buttons: [

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '◀️ Back',

                        id: 'back_to_menu'

                    })

                },

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Channel',

                        url: this.channelLink

                    })

                }

            ]

        }, quoted);

    }

    /**

     * Send channel promo

     */

    async sendChannelPromo(jid, sender, quoted = null) {

        const senderNumber = sender.split('@')[0];

        

        return await this.sendInteractive(jid, {

            text: `Hey @${senderNumber}! 👋\n\nJoin our official channel for updates and new features!`,

            footer: 'Click below:',

            buttons: [

                {

                    name: 'cta_url',

                    buttonParamsJson: JSON.stringify({

                        display_text: '📢 Join Now',

                        url: this.channelLink

                    })

                },

                {

                    name: 'quick_reply',

                    buttonParamsJson: JSON.stringify({

                        display_text: '✅ Done',

                        id: 'channel_joined'

                    })

                }

            ]

        }, quoted);

    }

}

module.exports = Buttons;