const axios = require('axios');

const fs = require('fs-extra');

const path = require('path');

const config = require('../../megan/config');

const commands = [];

// API Configuration

const API_ENDPOINTS = {

    flux: {

        url: 'https://eliteprotech-apis.zone.id/flux',

        method: 'GET',

        params: (prompt) => ({ prompt }),

        responseType: 'arraybuffer',

        directImage: true

    },

    dream: {

        url: 'https://api.gurusensei.workers.dev/dream',

        method: 'GET',

        params: (prompt) => ({ prompt }),

        responseType: 'arraybuffer',

        directImage: true

    },

    generate: {

        url: 'https://api-aswin-sparky.koyeb.app/api/search/imageai',

        method: 'GET',

        params: (prompt) => ({ search: prompt }),

        responseType: 'json',

        directImage: false

    },

    create: {

        url: 'https://eliteprotech-apis.zone.id/firelogo',

        method: 'GET',

        params: (prompt) => ({ text: prompt }),

        responseType: 'json',

        directImage: false

    }

};

// Temp directory

const TEMP_DIR = path.join(__dirname, '../../temp');

fs.ensureDirSync(TEMP_DIR);

// Helper function to download image

async function downloadImage(url, filename) {

    const filePath = path.join(TEMP_DIR, filename);

    

    try {

        const response = await axios({

            method: 'GET',

            url: url,

            responseType: 'arraybuffer',

            headers: {

                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',

                'Accept': 'image/*'

            },

            timeout: 60000

        });

        

        await fs.writeFile(filePath, response.data);

        return filePath;

    } catch (error) {

        throw new Error(`Failed to download image: ${error.message}`);

    }

}

// Helper to send image

async function sendImage(sock, from, imagePath, caption, quotedMsg) {

    try {

        const buffer = await fs.readFile(imagePath);

        const ext = path.extname(imagePath).toLowerCase();

        let mimeType = 'image/jpeg';

        

        if (ext === '.png') mimeType = 'image/png';

        else if (ext === '.gif') mimeType = 'image/gif';

        else if (ext === '.webp') mimeType = 'image/webp';

        

        await sock.sendMessage(from, {

            image: buffer,

            caption: caption,

            mimetype: mimeType

        }, { quoted: quotedMsg });

        

        await fs.unlink(imagePath).catch(() => {});

        return true;

    } catch (error) {

        if (await fs.pathExists(imagePath)) {

            await fs.unlink(imagePath).catch(() => {});

        }

        throw error;

    }

}

// ==================== FLUX COMMAND ====================

commands.push({

    name: 'flux',

    description: 'Generate AI images with Flux model',

    aliases: ['fluxai', 'aiimage'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('ℹ️');

            return reply(`✨ *Flux AI Image Generation*\n\nUsage: ${config.PREFIX}flux <prompt>\n\nExample: ${config.PREFIX}flux a beautiful sunset over mountains`);

        }

        

        const prompt = args.join(' ');

        let tempFile = null;

        

        await react('🎨');

        

        try {

            await sock.sendMessage(from, {

                text: `✨ *Generating Flux AI image...*\n\n*Prompt:* "${prompt}"\n\nPlease wait...`

            }, { quoted: msg });

            

            const response = await axios({

                method: API_ENDPOINTS.flux.method,

                url: API_ENDPOINTS.flux.url,

                params: API_ENDPOINTS.flux.params(prompt),

                responseType: API_ENDPOINTS.flux.responseType,

                headers: { 'User-Agent': 'Mozilla/5.0' },

                timeout: 45000

            });

            

            const filename = `flux_${Date.now()}.png`;

            tempFile = path.join(TEMP_DIR, filename);

            await fs.writeFile(tempFile, response.data);

            

            const caption = `✨ *Flux AI Generated*\n\n*Prompt:* ${prompt}\n*Model:* Flux AI\n\n> created by wanga`;

            

            await sendImage(sock, from, tempFile, caption, msg);

            await react('✅');

            

        } catch (error) {

            bot.logger.error('Flux error:', error);

            await react('❌');

            

            let errorMsg = `❌ *Flux AI Generation Failed*\n\n`;

            if (error.message.includes('timeout')) {

                errorMsg += `The image generation is taking too long.\nTry a simpler prompt.`;

            } else {

                errorMsg += `Error: ${error.message}`;

            }

            await reply(errorMsg);

            

            if (tempFile && await fs.pathExists(tempFile)) {

                await fs.unlink(tempFile).catch(() => {});

            }

        }

    }

});

// ==================== DREAM COMMAND ====================

commands.push({

    name: 'dream',

    description: 'Generate AI images with Dream model',

    aliases: ['dreamai', 'aiart'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('ℹ️');

            return reply(`🌌 *Dream AI Image Generation*\n\nUsage: ${config.PREFIX}dream <prompt>\n\nExample: ${config.PREFIX}dream fantasy castle in the clouds`);

        }

        

        const prompt = args.join(' ');

        let tempFile = null;

        

        await react('🌌');

        

        try {

            await sock.sendMessage(from, {

                text: `🌌 *Generating Dream AI image...*\n\n*Prompt:* "${prompt}"\n\nCreating your dream...`

            }, { quoted: msg });

            

            const response = await axios({

                method: API_ENDPOINTS.dream.method,

                url: API_ENDPOINTS.dream.url,

                params: API_ENDPOINTS.dream.params(prompt),

                responseType: API_ENDPOINTS.dream.responseType,

                headers: { 'User-Agent': 'Mozilla/5.0' },

                timeout: 45000

            });

            

            const filename = `dream_${Date.now()}.png`;

            tempFile = path.join(TEMP_DIR, filename);

            await fs.writeFile(tempFile, response.data);

            

            const caption = `🌌 *Dream AI Generated*\n\n*Prompt:* ${prompt}\n*Model:* Dream AI\n\n> created by wanga`;

            

            await sendImage(sock, from, tempFile, caption, msg);

            await react('✅');

            

        } catch (error) {

            bot.logger.error('Dream error:', error);

            await react('❌');

            

            let errorMsg = `❌ *Dream AI Generation Failed*\n\n`;

            if (error.message.includes('timeout')) {

                errorMsg += `Image generation timeout.\nTry a shorter prompt.`;

            } else {

                errorMsg += `Error: ${error.message}`;

            }

            await reply(errorMsg);

            

            if (tempFile && await fs.pathExists(tempFile)) {

                await fs.unlink(tempFile).catch(() => {});

            }

        }

    }

});

// ==================== GENERATE COMMAND ====================

commands.push({

    name: 'generate',

    description: 'Generate/Search for AI images',

    aliases: ['gen', 'image', 'searchimg'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('ℹ️');

            return reply(`🖼️ *AI Image Search*\n\nUsage: ${config.PREFIX}generate <prompt>\n\nExample: ${config.PREFIX}generate girl in dark aesthetic`);

        }

        

        const prompt = args.join(' ');

        

        await react('🔍');

        

        try {

            await sock.sendMessage(from, {

                text: `🔍 *Searching AI images...*\n\n*Query:* "${prompt}"\n\nFinding the best images...`

            }, { quoted: msg });

            

            const response = await axios({

                method: API_ENDPOINTS.generate.method,

                url: API_ENDPOINTS.generate.url,

                params: API_ENDPOINTS.generate.params(prompt),

                headers: { 'User-Agent': 'Mozilla/5.0' },

                timeout: 30000

            });

            

            if (!response.data?.status || !response.data.data || response.data.data.length === 0) {

                throw new Error('No images found');

            }

            

            const imageUrls = response.data.data.slice(0, 5);

            

            await sock.sendMessage(from, {

                text: `✅ *Found ${imageUrls.length} AI Images*\n\nDownloading and sending...`

            }, { quoted: msg });

            

            let sentCount = 0;

            for (let i = 0; i < Math.min(imageUrls.length, 3); i++) {

                try {

                    const url = imageUrls[i];

                    const filename = `gen_${Date.now()}_${i}.jpg`;

                    

                    const imagePath = await downloadImage(url, filename);

                    

                    const caption = `🖼️ *AI Image ${i+1}/${Math.min(imageUrls.length, 3)}*\n\n*Query:* ${prompt}\n\n> created by wanga`;

                    

                    await sendImage(sock, from, imagePath, caption, i === 0 ? msg : null);

                    sentCount++;

                    

                    if (i < Math.min(imageUrls.length, 3) - 1) {

                        await new Promise(resolve => setTimeout(resolve, 1000));

                    }

                } catch (imgError) {

                    bot.logger.error(`Failed to send image ${i+1}:`, imgError);

                }

            }

            

            await react('✅');

            

        } catch (error) {

            bot.logger.error('Generate error:', error);

            await react('❌');

            

            let errorMsg = `❌ *AI Image Search Failed*\n\n`;

            if (error.message.includes('No images found')) {

                errorMsg += `No AI images found for "${prompt}"\nTry different keywords.`;

            } else {

                errorMsg += `Error: ${error.message}`;

            }

            await reply(errorMsg);

        }

    }

});

// ==================== CREATE COMMAND ====================

commands.push({

    name: 'create',

    description: 'Create logo/text images with FireLogo',

    aliases: ['firelogo', 'logo'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('ℹ️');

            return reply(`🔥 *FireLogo Creator*\n\nUsage: ${config.PREFIX}create <text>\n\nExample: ${config.PREFIX}create Megan AI`);

        }

        

        const text = args.join(' ');

        let tempFile = null;

        

        await react('🔥');

        

        try {

            await sock.sendMessage(from, {

                text: `🔥 *Creating FireLogo...*\n\n*Text:* "${text}"`

            }, { quoted: msg });

            

            const response = await axios({

                method: API_ENDPOINTS.create.method,

                url: API_ENDPOINTS.create.url,

                params: API_ENDPOINTS.create.params(text),

                headers: { 'User-Agent': 'Mozilla/5.0' },

                timeout: 30000

            });

            

            if (!response.data?.success || !response.data.image) {

                throw new Error('No logo generated');

            }

            

            const imageUrl = response.data.image;

            const filename = `logo_${Date.now()}.png`;

            tempFile = await downloadImage(imageUrl, filename);

            

            const caption = `🔥 *FireLogo Created*\n\n*Text:* ${text}\n\n> created by wanga`;

            

            await sendImage(sock, from, tempFile, caption, msg);

            await react('✅');

            

        } catch (error) {

            bot.logger.error('Create error:', error);

            await react('❌');

            

            let errorMsg = `❌ *FireLogo Creation Failed*\n\n`;

            if (error.message.includes('No logo generated')) {

                errorMsg += `Could not generate logo for "${text}"\nTry different text.`;

            } else {

                errorMsg += `Error: ${error.message}`;

            }

            await reply(errorMsg);

            

            if (tempFile && await fs.pathExists(tempFile)) {

                await fs.unlink(tempFile).catch(() => {});

            }

        }

    }

});

// ==================== AIMENU COMMAND ====================

commands.push({

    name: 'aimage',

    description: 'Show AI image generation commands',

    aliases: ['aiimg', 'imageai'],

    async execute({ msg, from, sender, bot, sock, react, reply }) {

        const menu = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                    `*🖼️ AI IMAGE COMMANDS*\n\n` +

                    `• ${config.PREFIX}flux <prompt> - Flux AI generator\n` +

                    `• ${config.PREFIX}dream <prompt> - Dream AI generator\n` +

                    `• ${config.PREFIX}generate <prompt> - Search AI images\n` +

                    `• ${config.PREFIX}create <text> - FireLogo creator\n\n` +

                    `*📝 Examples:*\n` +

                    `• ${config.PREFIX}flux cyberpunk city\n` +

                    `• ${config.PREFIX}dream mystical forest\n` +

                    `• ${config.PREFIX}generate sunset beach\n` +

                    `• ${config.PREFIX}create Megan AI\n\n` +

                    `> created by wanga`;

        await sock.sendMessage(from, { text: menu }, { quoted: msg });

    }

});

module.exports = { commands };