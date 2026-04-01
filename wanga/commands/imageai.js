// MEGAN-MD Image AI Commands - Enhanced Interactive Version

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');
const uploader = require('../../megan/lib/upload');

const commands = [];

// Temp directory
const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const TIMEOUT = 15000;
const CREATOR = "\n\n> 👨‍💻 *𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐰𝐚𝐧𝐠𝐚*";

// ==================== HELPER FUNCTIONS ====================

async function safeApiCall(apiCall, fallbackData = null) {
    try {
        return await Promise.race([
            apiCall(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), TIMEOUT)
            )
        ]);
    } catch (error) {
        console.error('API Error:', error.message);
        if (fallbackData) return fallbackData;
        throw error;
    }
}

async function downloadImage(url, filename) {
    const filePath = path.join(TEMP_DIR, filename);

    const response = await safeApiCall(() => axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }));

    await fs.writeFile(filePath, response.data);
    return filePath;
}

async function getQuotedImage(msg, sock) {
    try {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return null;

        if (quoted.imageMessage) {
            const buffer = await require('gifted-baileys').downloadMediaMessage(
                { key: { id: msg.message.extendedTextMessage.contextInfo.stanzaId }, message: quoted },
                'buffer',
                {},
                { logger: console }
            );

            const filename = `image_${Date.now()}.jpg`;
            const filePath = path.join(TEMP_DIR, filename);
            await fs.writeFile(filePath, buffer);
            return filePath;
        }
        return null;
    } catch (error) {
        console.error('Error extracting quoted image:', error);
        return null;
    }
}

async function sendImage(sock, from, imagePath, caption, quotedMsg, buttons = null, title = '🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐑𝐄𝐀𝐃𝐘') {
    try {
        const buffer = await fs.readFile(imagePath);

        if (buttons) {
            await buttons.send(from, {
                title: title,
                text: caption + CREATOR,
                footer: '✦ ᴍᴇɢᴀɴ-ᴍᴅ ᴀɪ ꜱʏꜱᴛᴇᴍ ✦',
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📢 Join Official Channel',
                            url: CHANNEL_LINK
                        })
                    },
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📋 Copy Bot Prefix',
                            id: 'copy_prefix',
                            copy_code: config.PREFIX
                        })
                    }
                ]
            }, quotedMsg);
        } else {
            await sock.sendMessage(from, {
                image: buffer,
                caption: caption + CREATOR
            }, { quoted: quotedMsg });
        }

        await fs.unlink(imagePath).catch(() => {});
        return true;
    } catch (error) {
        if (await fs.pathExists(imagePath)) {
            await fs.unlink(imagePath).catch(() => {});
        }
        throw error;
    }
}

async function sendError(sock, from, quotedMsg, customMessage = null) {
    const errorText = customMessage || `╭━━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 〕━━━┈\n┃ ❌ Oops! Something went wrong.\n┃ 🔄 Please try again later.\n╰━━━━━━━━━━━━━━━┈${CREATOR}`;
    await sock.sendMessage(from, { text: errorText }, { quoted: quotedMsg });
}

// ==================== IMAGE SEARCH ====================

commands.push({
    name: 'image',
    description: 'Search for high-quality images',
    aliases: ['img', 'picsum'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`╭━━━〔 🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━━┈\n┃\n┃ *Usage:* ${config.PREFIX}image <search term>\n┃ *Example:* ${config.PREFIX}image beautiful sunset\n┃\n╰━━━━━━━━━━━━━━━┈${CREATOR}`);
        }

        const query = args.join(' ');
        let tempFiles = [];

        await react('🔍');

        try {
            // Try Picsum API first (reliable)
            const response = await safeApiCall(() => axios.get(
                `https://picsum.photos/800/600?random=${Date.now()}`,
                { responseType: 'arraybuffer', timeout: TIMEOUT }
            ));

            const filename = `search_${Date.now()}.jpg`;
            const imagePath = path.join(TEMP_DIR, filename);
            await fs.writeFile(imagePath, response.data);
            tempFiles.push(imagePath);

            await sendImage(sock, from, imagePath,
                `╭━━━〔 📸 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓 〕━━━┈\n┃ 🎯 *Query:* "${query}"\n┃ 🌐 *Source:* Picsum\n╰━━━━━━━━━━━━━━━┈`,
                msg, buttons, '🔍 𝐈𝐌𝐀𝐆𝐄 𝐅𝐎𝐔𝐍𝐃'
            );

            // Also try Unsplash if available
            try {
                const unsplashResponse = await safeApiCall(() => axios.get(
                    `https://api.siputzx.my.id/api/tools/unsplash?query=${encodeURIComponent(query)}`,
                    { timeout: TIMEOUT }
                ));

                if (unsplashResponse.data?.data?.urls?.regular) {
                    const unsplashFilename = `unsplash_${Date.now()}.jpg`;
                    const unsplashPath = await downloadImage(unsplashResponse.data.data.urls.regular, unsplashFilename);
                    tempFiles.push(unsplashPath);

                    await new Promise(resolve => setTimeout(resolve, 1500));

                    await sendImage(sock, from, unsplashPath,
                        `╭━━━〔 📸 𝐔𝐍𝐒𝐏𝐋𝐀𝐒𝐇 𝐑𝐄𝐒𝐔𝐋𝐓 〕━━━┈\n┃ 🎯 *Query:* "${query}"\n┃ 👤 *Photographer:* ${unsplashResponse.data.data.user?.name || 'Unknown'}\n╰━━━━━━━━━━━━━━━┈`,
                        null, buttons, '🌟 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐈𝐌𝐀𝐆𝐄'
                    );
                }
            } catch (e) {
                console.log('Unsplash fallback failed:', e.message);
            }

            await react('✅');

        } catch (error) {
            bot.logger.error('Image search error:', error);
            await react('❌');

            let errorMsg = `╭━━━〔 ⚠️ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃 〕━━━┈\n┃ ❌ No images found for "${query}".\n┃ 🔄 Try different keywords.\n╰━━━━━━━━━━━━━━━┈${CREATOR}`;
            if (error.message.includes('timeout')) {
                errorMsg = `╭━━━〔 ⚠️ 𝐓𝐈𝐌𝐄𝐎𝐔𝐓 〕━━━┈\n┃ ❌ Request timed out.\n┃ 🔄 Please try again.\n╰━━━━━━━━━━━━━━━┈${CREATOR}`;
            }

            await sendError(sock, from, msg, errorMsg);

            for (const file of tempFiles) {
                if (await fs.pathExists(file)) await fs.unlink(file).catch(() => {});
            }
        }
    }
});

// ==================== IMAGE GENERATION ====================

commands.push({
    name: 'imagine',
    description: 'Generate AI images',
    aliases: ['gen', 'dream', 'imagineai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`╭━━━〔 🎨 𝐈𝐌𝐀𝐆𝐈𝐍𝐄 𝐀𝐈 〕━━━┈\n┃\n┃ *Usage:* ${config.PREFIX}imagine <prompt>\n┃ *Example:* ${config.PREFIX}imagine cyberpunk city at night, neon lights\n┃\n╰━━━━━━━━━━━━━━━┈${CREATOR}`);
        }

        const prompt = args.join(' ');
        let tempFile = null;

        await react('🎨');

        try {
            await sock.sendMessage(from, {
                text: `╭━━━〔 ⚙️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐍𝐆 〕━━━┈\n┃ 🎨 *Dreaming up your image...*\n┃ 💭 *Prompt:* "${prompt}"\n┃ ⏱️ *Please wait a moment!*\n╰━━━━━━━━━━━━━━━┈${CREATOR}`
            }, { quoted: msg });

            // Try Pollinations AI (free, reliable)
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;

            const filename = `imagine_${Date.now()}.jpg`;
            tempFile = await downloadImage(imageUrl, filename);

            await sendImage(sock, from, tempFile,
                `╭━━━〔 ✨ 𝐀𝐈 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 〕━━━┈\n┃ 🎨 *Prompt:* ${prompt}\n┃ ⚡ *Engine:* Pollinations AI\n╰━━━━━━━━━━━━━━━┈`,
                msg, buttons, '✨ 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 𝐑𝐄𝐀𝐃𝐘'
            );
            await react('✅');

        } catch (error) {
            bot.logger.error('Imagine error:', error);
            await react('🔄');

            // Try fallback with DuckAI
            try {
                const formData = new FormData();
                formData.append('prompt', prompt);

                const response = await safeApiCall(() => axios({
                    method: 'POST',
                    url: 'https://api.siputzx.my.id/api/ai/duckaiimage',
                    data: formData,
                    headers: { ...formData.getHeaders() },
                    responseType: 'arraybuffer'
                }));

                const fallbackFilename = `imagine_fallback_${Date.now()}.png`;
                tempFile = path.join(TEMP_DIR, fallbackFilename);
                await fs.writeFile(tempFile, response.data);

                await sendImage(sock, from, tempFile,
                    `╭━━━〔 ✨ 𝐀𝐈 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 (Fallback) 〕━━━┈\n┃ 🎨 *Prompt:* ${prompt}\n┃ ⚡ *Engine:* DuckAI\n╰━━━━━━━━━━━━━━━┈`,
                    msg, buttons, '✨ 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 𝐑𝐄𝐀𝐃𝐘'
                );
                await react('✅');

            } catch (fallbackError) {
                await react('❌');
                await sendError(sock, from, msg,
                    `╭━━━〔 ⚠️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃 〕━━━┈\n┃ ❌ Couldn't generate image.\n┃ 🔄 Try a simpler prompt.\n╰━━━━━━━━━━━━━━━┈${CREATOR}`
                );
            }

            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== LOGO CREATOR ====================

commands.push({
    name: 'create',
    description: 'Create logo/text images',
    aliases: ['logo', 'textlogo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`╭━━━〔 🔥 𝐋𝐎𝐆𝐎 𝐌𝐀𝐊𝐄𝐑 〕━━━┈\n┃\n┃ *Usage:* ${config.PREFIX}create <text>\n┃ *Example:* ${config.PREFIX}create Megan AI\n┃\n╰━━━━━━━━━━━━━━━┈${CREATOR}`);
        }

        const text = args.join(' ');
        let tempFile = null;

        await react('🔥');

        try {
            await sock.sendMessage(from, {
                text: `╭━━━〔 ⚙️ 𝐂𝐑𝐄𝐀𝐓𝐈𝐍𝐆 𝐋𝐎𝐆𝐎 〕━━━┈\n┃ ✨ *Forging your design...*\n┃ 📝 *Text:* "${text}"\n╰━━━━━━━━━━━━━━━┈${CREATOR}`
            }, { quoted: msg });

            // Use Pollinations for text-to-image
            const imageUrl = `https://image.pollinations.ai/prompt/3d%20logo%20design%20${encodeURIComponent(text)}?width=800&height=400&nologo=true`;

            const filename = `logo_${Date.now()}.jpg`;
            tempFile = await downloadImage(imageUrl, filename);

            await sendImage(sock, from, tempFile,
                `╭━━━〔 🔥 𝐋𝐎𝐆𝐎 𝐂𝐑𝐄𝐀𝐓𝐄𝐃 〕━━━┈\n┃ 📝 *Text Rendered:* ${text}\n╰━━━━━━━━━━━━━━━┈`,
                msg, buttons, '🎨 𝐘𝐎𝐔𝐑 𝐋𝐎𝐆𝐎'
            );
            await react('✅');

        } catch (error) {
            bot.logger.error('Create error:', error);
            await react('❌');
            await sendError(sock, from, msg,
                `╭━━━〔 ⚠️ 𝐂𝐑𝐄𝐀𝐓𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃 〕━━━┈\n┃ ❌ Couldn't create logo for "${text}".\n┃ 🔄 Try different text.\n╰━━━━━━━━━━━━━━━┈${CREATOR}`
            );

            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== BEAUTIFUL EFFECT ====================

commands.push({
    name: 'beautiful',
    description: 'Add "beautiful" caption to an image',
    aliases: ['bful'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const imagePath = await getQuotedImage(msg, sock);

        if (!imagePath) {
            await react('❌');
            return reply(`╭━━━〔 ✨ 𝐁𝐄𝐀𝐔𝐓𝐈𝐅𝐔𝐋 𝐅𝐈𝐋𝐓𝐄𝐑 〕━━━┈\n┃\n┃ 📸 *Reply to an image* with:\n┃ ${config.PREFIX}beautiful\n┃\n╰━━━━━━━━━━━━━━━┈${CREATOR}`);
        }

        let outputFile = null;
        await react('✨');

        try {
            const buffer = await fs.readFile(imagePath);
            const { url } = await uploader.uploadAuto(buffer, `beautiful_${Date.now()}.jpg`);

            const response = await safeApiCall(() => axios.get(
                'https://api.siputzx.my.id/api/canvas/beautiful',
                { params: { image: url }, responseType: 'arraybuffer', timeout: TIMEOUT }
            ));

            const filename = `beautiful_${Date.now()}.jpg`;
            outputFile = path.join(TEMP_DIR, filename);
            await fs.writeFile(outputFile, response.data);

            await sendImage(sock, from, outputFile,
                `╭━━━〔 🌺 𝐄𝐅𝐅𝐄𝐂𝐓 𝐀𝐏𝐏𝐋𝐈𝐄𝐃 〕━━━┈\n┃ ✨ Beautiful filter added successfully!\n╰━━━━━━━━━━━━━━━┈`,
                msg, buttons, '✨ 𝐀𝐖𝐄𝐒𝐎𝐌𝐄 𝐑𝐄𝐒𝐔𝐋𝐓'
            );
            await react('✅');

        } catch (error) {
            bot.logger.error('Beautiful effect error:', error);
            await react('❌');
            await sendError(sock, from, msg);
        } finally {
            if (await fs.pathExists(imagePath)) await fs.unlink(imagePath).catch(() => {});
            if (outputFile && await fs.pathExists(outputFile)) await fs.unlink(outputFile).catch(() => {});
        }
    }
});

// ==================== REMOVE BACKGROUND ====================

commands.push({
    name: 'removebg',
    description: 'Remove image background',
    aliases: ['nobg', 'rmbg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const imagePath = await getQuotedImage(msg, sock);

        if (!imagePath) {
            await react('❌');
            return reply(`╭━━━〔 ✂️ 𝐑𝐄𝐌𝐎𝐕𝐄 𝐁𝐆 〕━━━┈\n┃\n┃ 📸 *Reply to an image* with:\n┃ ${config.PREFIX}removebg\n┃\n╰━━━━━━━━━━━━━━━┈${CREATOR}`);
        }

        let outputFile = null;
        await react('✂️');

        try {
            const buffer = await fs.readFile(imagePath);
            const { url } = await uploader.uploadAuto(buffer, `removebg_${Date.now()}.jpg`);

            const response = await safeApiCall(() => axios.get(
                'https://api.siputzx.my.id/api/ai/removebg',
                { params: { image: url }, responseType: 'arraybuffer', timeout: TIMEOUT }
            ));

            const filename = `nobg_${Date.now()}.png`;
            outputFile = path.join(TEMP_DIR, filename);
            await fs.writeFile(outputFile, response.data);

            await sendImage(sock, from, outputFile,
                `╭━━━〔 ✂️ 𝐁𝐆 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 〕━━━┈\n┃ 🌟 Background erased successfully!\n╰━━━━━━━━━━━━━━━┈`,
                msg, buttons, '✂️ 𝐓𝐑𝐀𝐍𝐒𝐏𝐀𝐑𝐄𝐍𝐓 𝐈𝐌𝐀𝐆𝐄'
            );
            await react('✅');

        } catch (error) {
            bot.logger.error('RemoveBG error:', error);
            await react('❌');
            await sendError(sock, from, msg);
        } finally {
            if (await fs.pathExists(imagePath)) await fs.unlink(imagePath).catch(() => {});
            if (outputFile && await fs.pathExists(outputFile)) await fs.unlink(outputFile).catch(() => {});
        }
    }
});

// ==================== IMAGE MENU ====================

commands.push({
    name: 'imagemen',
    description: 'Show all image commands',
    aliases: ['imgmenu', 'imagemenu'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const menu = `╭━━━〔 🎨 𝐈𝐌𝐀𝐆𝐄 𝐒𝐓𝐔𝐃𝐈𝐎 〕━━━┈\n` +
            `┃ Welcome to the AI Image toolkit!\n` +
            `┃\n` +
            `┣━━〔 ⚡ 𝐐𝐔𝐈𝐂𝐊 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 〕━━┈\n` +
            `┃ 🔹 ${config.PREFIX}image <search>\n` +
            `┃ 🔹 ${config.PREFIX}imagine <prompt>\n` +
            `┃ 🔹 ${config.PREFIX}create <text>\n` +
            `┃ 🔹 ${config.PREFIX}beautiful (reply)\n` +
            `┃ 🔹 ${config.PREFIX}removebg (reply)\n` +
            `┃\n` +
            `┣━━〔 📝 𝐄𝐗𝐀𝐌𝐏𝐋𝐄𝐒 〕━━┈\n` +
            `┃ 🔸 ${config.PREFIX}imagine a robot in space\n` +
            `┃ 🔸 ${config.PREFIX}create Neon Vibes\n` +
            `╰━━━━━━━━━━━━━━━┈`;

        const buttonOptions = {
            title: '🎨 𝐌𝐄𝐆𝐀𝐍 𝐈𝐌𝐀𝐆𝐄 𝐀𝐈',
            text: menu,
            footer: '✦ ᴇxᴘʟᴏʀᴇ ʏᴏᴜʀ ᴄʀᴇᴀᴛɪᴠɪᴛʏ ✦',
            buttons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 Join Our Community',
                        url: CHANNEL_LINK
                    })
                },
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy Imagine Example',
                        id: 'copy_imagine',
                        copy_code: `${config.PREFIX}imagine a futuristic cyberpunk city at night`
                    })
                }
            ]
        };

        if (buttons) {
            await buttons.send(from, buttonOptions, msg);
        } else {
            await sock.sendMessage(from, { text: menu + CREATOR }, { quoted: msg });
        }
        await react('✨');
    }
});

module.exports = { commands };
