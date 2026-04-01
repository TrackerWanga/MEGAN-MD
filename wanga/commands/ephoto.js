// MEGAN-MD Ephoto360 Effects - Consistent styling with buttons

const axios = require('axios');
const config = require('../../megan/config');

const commands = [];

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

// Helper function using same pattern as basic.js
async function sendButtonMenu(sock, from, options, quotedMsg) {
    const { sendButtons } = require('gifted-btns');
    
    try {
        return await sendButtons(sock, from, {
            title: options.title || '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: options.text,
            footer: options.footer || '> created by wanga',
            image: options.image ? { url: options.image } : null,
            buttons: options.buttons || []
        }, { quoted: quotedMsg });
    } catch (error) {
        console.error('Button error:', error);
        await sock.sendMessage(from, { text: options.text }, { quoted: quotedMsg });
    }
}

// ==================== HELPER FUNCTION ====================

async function createEphoto(from, url, text, msg, sock, react, sender, commandName, buttons) {
    try {
        const params = { 
            url: url, 
            text1: text
        };
        
        console.log(`🔄 Generating ${commandName} with text: "${text}"`);

        const response = await axios.get(`https://api.siputzx.my.id/api/m/ephoto360`, {
            params: params,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: { 
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        });

        const contentType = response.headers['content-type'];
        if (contentType && (contentType.includes('application/json') || contentType.includes('text/html'))) {
            throw new Error('Service temporarily unavailable');
        }

        const imageBuffer = Buffer.from(response.data);
        
        // Send with button menu
        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🎨 *${commandName.toUpperCase()}*\n✨ Created successfully!\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}ephotomenu`, text: '🎨 More Effects' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        
        // Send the actual image
        await sock.sendMessage(from, {
            image: imageBuffer,
            caption: `🎨 *${commandName.toUpperCase()}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await react('✅');
        return true;
        
    } catch (error) {
        console.error(`Error in ${commandName}:`, error.message);
        await react('❌');
        
        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `❌ *Effect Failed*\n\n_Service temporarily unavailable._\n_ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ._`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        
        return false;
    }
}

// ==================== ALL 32 EFFECTS ====================

// 1. 1917 Style
commands.push({
    name: '1917style',
    description: 'Create 1917 film-style text effect',
    aliases: ['1917'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎭 *𝟏𝟗𝟏𝟕 𝐒𝐭𝐲𝐥𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}1917style <text>\n_Example:_ ${config.PREFIX}1917style WANGA\n\n_🎨 Creates 1917 film-style text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🎭');
        await createEphoto(from, 'https://en.ephoto360.com/1917-style-text-effect-523.html', text, msg, sock, react, sender, '1917style', buttons);
    }
});

// 2. Advanced Glow
commands.push({
    name: 'advancedglow',
    description: 'Create advanced glow text effect',
    aliases: ['glow'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✨ *𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐆𝐥𝐨𝐰*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}advancedglow <text>\n_Example:_ ${config.PREFIX}advancedglow MEGAN\n\n_✨ Creates advanced glow text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('✨');
        await createEphoto(from, 'https://en.ephoto360.com/advanced-glow-effects-74.html', text, msg, sock, react, sender, 'advancedglow', buttons);
    }
});

// 3. Blackpink Logo
commands.push({
    name: 'blackpinklogo',
    description: 'Create Blackpink style logo',
    aliases: ['bplogo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🖤 *𝐁𝐥𝐚𝐜𝐤𝐩𝐢𝐧𝐤 𝐋𝐨𝐠𝐨*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}blackpinklogo <text>\n_Example:_ ${config.PREFIX}blackpinklogo MEGAN\n\n_🖤 Creates Blackpink style logo._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🖤');
        await createEphoto(from, 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html', text, msg, sock, react, sender, 'blackpinklogo', buttons);
    }
});

// 4. Blackpink Style
commands.push({
    name: 'blackpinkstyle',
    description: 'Create Blackpink style text effect',
    aliases: ['bpstyle'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎤 *𝐁𝐥𝐚𝐜𝐤𝐩𝐢𝐧𝐤 𝐒𝐭𝐲𝐥𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}blackpinkstyle <text>\n_Example:_ ${config.PREFIX}blackpinkstyle MEGAN\n\n_🎤 Creates Blackpink style text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🎤');
        await createEphoto(from, 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html', text, msg, sock, react, sender, 'blackpinkstyle', buttons);
    }
});

// 5. Cartoon Style
commands.push({
    name: 'cartoonstyle',
    description: 'Create cartoon style graffiti text',
    aliases: ['cartoon'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🖍️ *𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐒𝐭𝐲𝐥𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}cartoonstyle <text>\n_Example:_ ${config.PREFIX}cartoonstyle MEGAN\n\n_🖍️ Creates cartoon style graffiti text._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🖍️');
        await createEphoto(from, 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html', text, msg, sock, react, sender, 'cartoonstyle', buttons);
    }
});

// 6. Deleting Text
commands.push({
    name: 'deletingtext',
    description: 'Create eraser deleting text effect',
    aliases: ['eraser'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📄 *𝐃𝐞𝐥𝐞𝐭𝐢𝐧𝐠 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}deletingtext <text>\n_Example:_ ${config.PREFIX}deletingtext MEGAN\n\n_📄 Creates eraser deleting text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('📄');
        await createEphoto(from, 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html', text, msg, sock, react, sender, 'deletingtext', buttons);
    }
});

// 7. Dragon Ball
commands.push({
    name: 'dragonball',
    description: 'Create Dragon Ball style text effect',
    aliases: ['dbz'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🐉 *𝐃𝐫𝐚𝐠𝐨𝐧 𝐁𝐚𝐥𝐥*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}dragonball <text>\n_Example:_ ${config.PREFIX}dragonball MEGAN\n\n_🐉 Creates Dragon Ball style text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🐉');
        await createEphoto(from, 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html', text, msg, sock, react, sender, 'dragonball', buttons);
    }
});

// 8. Effect Clouds
commands.push({
    name: 'effectclouds',
    description: 'Create text in clouds effect',
    aliases: ['clouds'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `☁️ *𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐥𝐨𝐮𝐝𝐬*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}effectclouds <text>\n_Example:_ ${config.PREFIX}effectclouds MEGAN\n\n_☁️ Creates text in clouds effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('☁️');
        await createEphoto(from, 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html', text, msg, sock, react, sender, 'effectclouds', buttons);
    }
});

// 9. Flag 3D Text
commands.push({
    name: 'flag3dtext',
    description: 'Create 3D flag text effect',
    aliases: ['3dflag'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🏴 *𝟑𝐃 𝐅𝐥𝐚𝐠 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}flag3dtext <text>\n_Example:_ ${config.PREFIX}flag3dtext MEGAN\n\n_🏴 Creates 3D flag text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🏴');
        await createEphoto(from, 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html', text, msg, sock, react, sender, 'flag3dtext', buttons);
    }
});

// 10. Flag Text
commands.push({
    name: 'flagtext',
    description: 'Create flag text effect',
    aliases: ['flag'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🇳🇬 *𝐅𝐥𝐚𝐠 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}flagtext <text>\n_Example:_ ${config.PREFIX}flagtext MEGAN\n\n_🇳🇬 Creates flag text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🇳🇬');
        await createEphoto(from, 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html', text, msg, sock, react, sender, 'flagtext', buttons);
    }
});

// 11. Free Create
commands.push({
    name: 'freecreate',
    description: 'Create free 3D hologram text effect',
    aliases: ['hologram'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🆓 *𝐅𝐫𝐞𝐞 𝐂𝐫𝐞𝐚𝐭𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}freecreate <text>\n_Example:_ ${config.PREFIX}freecreate MEGAN\n\n_🆓 Creates 3D hologram text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🆓');
        await createEphoto(from, 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html', text, msg, sock, react, sender, 'freecreate', buttons);
    }
});

// 12. Galaxy Style
commands.push({
    name: 'galaxystyle',
    description: 'Create galaxy style text effect',
    aliases: ['galaxy'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌌 *𝐆𝐚𝐥𝐚𝐱𝐲 𝐒𝐭𝐲𝐥𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}galaxystyle <text>\n_Example:_ ${config.PREFIX}galaxystyle MEGAN\n\n_🌌 Creates galaxy style text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌌');
        await createEphoto(from, 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html', text, msg, sock, react, sender, 'galaxystyle', buttons);
    }
});

// 13. Galaxy Wallpaper
commands.push({
    name: 'galaxywallpaper',
    description: 'Create galaxy wallpaper text effect',
    aliases: ['galaxywall'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌠 *𝐆𝐚𝐥𝐚𝐱𝐲 𝐖𝐚𝐥𝐥𝐩𝐚𝐩𝐞𝐫*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}galaxywallpaper <text>\n_Example:_ ${config.PREFIX}galaxywallpaper MEGAN\n\n_🌠 Creates galaxy wallpaper text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌠');
        await createEphoto(from, 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html', text, msg, sock, react, sender, 'galaxywallpaper', buttons);
    }
});

// 14. Glitch Text
commands.push({
    name: 'glitchtext',
    description: 'Create digital glitch text effect',
    aliases: ['glitch'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📛 *𝐆𝐥𝐢𝐭𝐜𝐡 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}glitchtext <text>\n_Example:_ ${config.PREFIX}glitchtext MEGAN\n\n_📛 Creates digital glitch text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('📛');
        await createEphoto(from, 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html', text, msg, sock, react, sender, 'glitchtext', buttons);
    }
});

// 15. Glowing Text
commands.push({
    name: 'glowingtext',
    description: 'Create glowing text effect',
    aliases: ['glowtext'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌟 *𝐆𝐥𝐨𝐰𝐢𝐧𝐠 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}glowingtext <text>\n_Example:_ ${config.PREFIX}glowingtext MEGAN\n\n_🌟 Creates glowing text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌟');
        await createEphoto(from, 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html', text, msg, sock, react, sender, 'glowingtext', buttons);
    }
});

// 16. Gradient Text
commands.push({
    name: 'gradienttext',
    description: 'Create 3D gradient text effect',
    aliases: ['gradient'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌈 *𝐆𝐫𝐚𝐝𝐢𝐞𝐧𝐭 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}gradienttext <text>\n_Example:_ ${config.PREFIX}gradienttext MEGAN\n\n_🌈 Creates 3D gradient text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌈');
        await createEphoto(from, 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html', text, msg, sock, react, sender, 'gradienttext', buttons);
    }
});

// 17. Graffiti
commands.push({
    name: 'graffiti',
    description: 'Create cute girl painting graffiti text',
    aliases: ['graffiti'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎨 *𝐆𝐫𝐚𝐟𝐟𝐢𝐭𝐢*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}graffiti <text>\n_Example:_ ${config.PREFIX}graffiti MEGAN\n\n_🎨 Creates cute girl painting graffiti text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🎨');
        await createEphoto(from, 'https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html', text, msg, sock, react, sender, 'graffiti', buttons);
    }
});

// 18. Incandescent
commands.push({
    name: 'incandescent',
    description: 'Create incandescent bulbs text effect',
    aliases: ['bulbs'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `💡 *𝐈𝐧𝐜𝐚𝐧𝐝𝐞𝐬𝐜𝐞𝐧𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}incandescent <text>\n_Example:_ ${config.PREFIX}incandescent MEGAN\n\n_💡 Creates incandescent bulbs text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('💡');
        await createEphoto(from, 'https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html', text, msg, sock, react, sender, 'incandescent', buttons);
    }
});

// 19. Light Effects
commands.push({
    name: 'lighteffects',
    description: 'Create light effects text',
    aliases: ['light'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `💡 *𝐋𝐢𝐠𝐡𝐭 𝐄𝐟𝐟𝐞𝐜𝐭𝐬*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}lighteffects <text>\n_Example:_ ${config.PREFIX}lighteffects MEGAN\n\n_💡 Creates light effects text._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('💡');
        await createEphoto(from, 'https://en.ephoto360.com/create-light-effects-green-neon-online-429.html', text, msg, sock, react, sender, 'lighteffects', buttons);
    }
});

// 20. Logo Maker
commands.push({
    name: 'logomaker',
    description: 'Create bear logo maker effect',
    aliases: ['bearlogo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🧸 *𝐋𝐨𝐠𝐨 𝐌𝐚𝐤𝐞𝐫*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}logomaker <text>\n_Example:_ ${config.PREFIX}logomaker MEGAN\n\n_🧸 Creates bear logo maker effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🧸');
        await createEphoto(from, 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html', text, msg, sock, react, sender, 'logomaker', buttons);
    }
});

// 21. Luxury Gold
commands.push({
    name: 'luxurygold',
    description: 'Create luxury gold text effect',
    aliases: ['gold'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🪙 *𝐋𝐮𝐱𝐮𝐫𝐲 𝐆𝐨𝐥𝐝*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}luxurygold <text>\n_Example:_ ${config.PREFIX}luxurygold MEGAN\n\n_🪙 Creates luxury gold text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🪙');
        await createEphoto(from, 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html', text, msg, sock, react, sender, 'luxurygold', buttons);
    }
});

// 22. Making Neon
commands.push({
    name: 'makingneon',
    description: 'Create neon light text with galaxy style',
    aliases: ['neon'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌌 *𝐌𝐚𝐤𝐢𝐧𝐠 𝐍𝐞𝐨𝐧*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}makingneon <text>\n_Example:_ ${config.PREFIX}makingneon MEGAN\n\n_🌌 Creates neon light text with galaxy style._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌌');
        await createEphoto(from, 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html', text, msg, sock, react, sender, 'makingneon', buttons);
    }
});

// 23. Matrix
commands.push({
    name: 'matrix',
    description: 'Create matrix text effect',
    aliases: ['matrix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📊 *𝐌𝐚𝐭𝐫𝐢𝐱*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}matrix <text>\n_Example:_ ${config.PREFIX}matrix MEGAN\n\n_📊 Creates matrix text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('📊');
        await createEphoto(from, 'https://en.ephoto360.com/matrix-text-effect-154.html', text, msg, sock, react, sender, 'matrix', buttons);
    }
});

// 24. Multicolored Neon
commands.push({
    name: 'multicoloredneon',
    description: 'Create multicolored neon light effect',
    aliases: ['colorneon'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎆 *𝐌𝐮𝐥𝐭𝐢𝐜𝐨𝐥𝐨𝐫𝐞𝐝 𝐍𝐞𝐨𝐧*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}multicoloredneon <text>\n_Example:_ ${config.PREFIX}multicoloredneon MEGAN\n\n_🎆 Creates multicolored neon light effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🎆');
        await createEphoto(from, 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html', text, msg, sock, react, sender, 'multicoloredneon', buttons);
    }
});

// 25. Neon Glitch
commands.push({
    name: 'neonglitch',
    description: 'Create impressive neon glitch text effect',
    aliases: ['neonglitch'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌀 *𝐍𝐞𝐨𝐧 𝐆𝐥𝐢𝐭𝐜𝐡*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}neonglitch <text>\n_Example:_ ${config.PREFIX}neonglitch MEGAN\n\n_🌀 Creates impressive neon glitch text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌀');
        await createEphoto(from, 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html', text, msg, sock, react, sender, 'neonglitch', buttons);
    }
});

// 26. Paper Cut Style
commands.push({
    name: 'papercutstyle',
    description: 'Create multicolor 3D paper cut style text',
    aliases: ['papercut'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✂️ *𝐏𝐚𝐩𝐞𝐫 𝐂𝐮𝐭 𝐒𝐭𝐲𝐥𝐞*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}papercutstyle <text>\n_Example:_ ${config.PREFIX}papercutstyle MEGAN\n\n_✂️ Creates multicolor 3D paper cut style text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('✂️');
        await createEphoto(from, 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html', text, msg, sock, react, sender, 'papercutstyle', buttons);
    }
});

// 27. Pixel Glitch
commands.push({
    name: 'pixelglitch',
    description: 'Create pixel glitch text effect',
    aliases: ['pixel'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📛 *𝐏𝐢𝐱𝐞𝐥 𝐆𝐥𝐢𝐭𝐜𝐡*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}pixelglitch <text>\n_Example:_ ${config.PREFIX}pixelglitch MEGAN\n\n_📛 Creates pixel glitch text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('📛');
        await createEphoto(from, 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html', text, msg, sock, react, sender, 'pixelglitch', buttons);
    }
});

// 28. Royal Text
commands.push({
    name: 'royaltext',
    description: 'Create royal text effect',
    aliases: ['royal'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👑 *𝐑𝐨𝐲𝐚𝐥 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}royaltext <text>\n_Example:_ ${config.PREFIX}royaltext MEGAN\n\n_👑 Creates royal text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('👑');
        await createEphoto(from, 'https://en.ephoto360.com/royal-text-effect-online-free-471.html', text, msg, sock, react, sender, 'royaltext', buttons);
    }
});

// 29. Sand
commands.push({
    name: 'sand',
    description: 'Create sand writing text effect',
    aliases: ['sand'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🏖️ *𝐒𝐚𝐧𝐝*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}sand <text>\n_Example:_ ${config.PREFIX}sand MEGAN\n\n_🏖️ Creates sand writing text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🏖️');
        await createEphoto(from, 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html', text, msg, sock, react, sender, 'sand', buttons);
    }
});

// 30. Summer Beach
commands.push({
    name: 'summerbeach',
    description: 'Create summer beach sand text effect',
    aliases: ['beach'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌊 *𝐒𝐮𝐦𝐦𝐞𝐫 𝐁𝐞𝐚𝐜𝐡*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}summerbeach <text>\n_Example:_ ${config.PREFIX}summerbeach MEGAN\n\n_🌊 Creates summer beach sand text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🌊');
        await createEphoto(from, 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html', text, msg, sock, react, sender, 'summerbeach', buttons);
    }
});

// 31. Topography
commands.push({
    name: 'topography',
    description: 'Create topography text effect',
    aliases: ['topo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🗺️ *𝐓𝐨𝐩𝐨𝐠𝐫𝐚𝐩𝐡𝐲*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}topography <text>\n_Example:_ ${config.PREFIX}topography MEGAN\n\n_🗺️ Creates topography text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🗺️');
        await createEphoto(from, 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html', text, msg, sock, react, sender, 'topography', buttons);
    }
});

// 32. Watercolor Text
commands.push({
    name: 'watercolortext',
    description: 'Create watercolor text effect',
    aliases: ['watercolor'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎨 *𝐖𝐚𝐭𝐞𝐫𝐜𝐨𝐥𝐨𝐫 𝐓𝐞𝐱𝐭*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}watercolortext <text>\n_Example:_ ${config.PREFIX}watercolortext MEGAN\n\n_🎨 Creates watercolor text effect._`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        const text = args.join(' ');
        await react('🎨');
        await createEphoto(from, 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html', text, msg, sock, react, sender, 'watercolortext', buttons);
    }
});

// ==================== EPHOTO MENU ====================
commands.push({
    name: 'ephotomenu',
    description: 'Show all Ephoto360 effects',
    aliases: ['ephoto', 'ephotolist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;
        
        const menu = `🎨 *𝐄𝐏𝐇𝐎𝐓𝐎𝟑𝟔𝟎 𝐄𝐅𝐅𝐄𝐂𝐓𝐒 (𝟑𝟐)*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🎭 ${prefix}1917style - 1917 film style\n` +
            `✨ ${prefix}advancedglow - Advanced glow\n` +
            `🖤 ${prefix}blackpinklogo - Blackpink logo\n` +
            `🎤 ${prefix}blackpinkstyle - Blackpink style\n` +
            `🖍️ ${prefix}cartoonstyle - Cartoon graffiti\n` +
            `📄 ${prefix}deletingtext - Eraser deleting text\n` +
            `🐉 ${prefix}dragonball - Dragon Ball style\n` +
            `☁️ ${prefix}effectclouds - Text in clouds\n` +
            `🏴 ${prefix}flag3dtext - 3D flag text\n` +
            `🇳🇬 ${prefix}flagtext - Flag text\n` +
            `🆓 ${prefix}freecreate - 3D hologram\n` +
            `🌌 ${prefix}galaxystyle - Galaxy style\n` +
            `🌠 ${prefix}galaxywallpaper - Galaxy wallpaper\n` +
            `📛 ${prefix}glitchtext - Digital glitch\n` +
            `🌟 ${prefix}glowingtext - Glowing text\n` +
            `🌈 ${prefix}gradienttext - 3D gradient\n` +
            `🎨 ${prefix}graffiti - Graffiti art\n` +
            `💡 ${prefix}incandescent - Incandescent bulbs\n` +
            `💡 ${prefix}lighteffects - Light effects\n` +
            `🧸 ${prefix}logomaker - Bear logo maker\n` +
            `🪙 ${prefix}luxurygold - Luxury gold\n` +
            `🌌 ${prefix}makingneon - Neon with galaxy\n` +
            `📊 ${prefix}matrix - Matrix style\n` +
            `🎆 ${prefix}multicoloredneon - Color neon\n` +
            `🌀 ${prefix}neonglitch - Neon glitch\n` +
            `✂️ ${prefix}papercutstyle - Paper cut\n` +
            `📛 ${prefix}pixelglitch - Pixel glitch\n` +
            `👑 ${prefix}royaltext - Royal text\n` +
            `🏖️ ${prefix}sand - Sand writing\n` +
            `🌊 ${prefix}summerbeach - Summer beach\n` +
            `🗺️ ${prefix}topography - Topography\n` +
            `🎨 ${prefix}watercolortext - Watercolor\n\n` +
            `*Usage:* ${prefix}[effect] <text>\n` +
            `*Example:* ${prefix}1917style WANGA\n\n` +
            `> created by wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: menu,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

module.exports = { commands };
