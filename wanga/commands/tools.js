const axios = require('axios');
const CryptoJS = require('crypto-js');
const morse = require('morse');
const { v4: uuidv4 } = require('uuid');
const translate = require('@iamtraction/google-translate');
const cheerio = require('cheerio');
const { faker } = require('@faker-js/faker');
const math = require('mathjs');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');

// Temp directory
const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

const commands = [];

// ==================== ENCODING TOOLS ====================

// BINARY ENCODER
commands.push({
    name: 'binary',
    description: 'Convert text to binary code',
    aliases: ['bin', 'texttobinary'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🔢');
                return reply(`🔢 *BINARY ENCODER*\n\n*Usage:* ${config.PREFIX}binary <text>\n\n*Examples:*\n• ${config.PREFIX}binary Hello\n• ${config.PREFIX}binary MEGAN MD`);
            }
            await react('🔄');
            const binaryResult = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join(' ');
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔢 *BINARY ENCODING*\n\n` +
                             `*Original:* ${text}\n\n` +
                             `*Binary:*\n\`\`\`${binaryResult}\`\`\`\n\n` +
                             `*How to decode:* ${config.PREFIX}debinary\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Binary error:', error);
            await react('❌');
            await reply(`❌ Encoding failed. Try: ${config.PREFIX}binary Hello World`);
        }
    }
});

// BINARY DECODER
commands.push({
    name: 'debinary',
    description: 'Convert binary code to text',
    aliases: ['unbinary', 'binarytotext'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🔢');
                return reply(`🔢 *BINARY DECODER*\n\n*Usage:* ${config.PREFIX}debinary <binary code>\n\n*Examples:*\n• ${config.PREFIX}debinary 01001000 01100101 01101100`);
            }
            await react('🔄');
            const cleanBinary = text.replace(/\s+/g, '');
            if (!/^[01]+$/.test(cleanBinary)) {
                throw new Error('Invalid binary code (only 0 and 1 allowed)');
            }
            let result = '';
            for (let i = 0; i < cleanBinary.length; i += 8) {
                const byte = cleanBinary.substr(i, 8);
                if (byte.length === 8) {
                    result += String.fromCharCode(parseInt(byte, 2));
                }
            }
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔢 *BINARY DECODING*\n\n` +
                             `*Binary:* ${text}\n\n` +
                             `*Decoded Text:*\n\`\`\`${result}\`\`\`\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Debinary error:', error);
            await react('❌');
            await reply(`❌ Decoding failed: ${error.message}\n\nTry: ${config.PREFIX}debinary 01001000 01100101 01101100 01101100 01101111`);
        }
    }
});

// BASE64
commands.push({
    name: 'base64',
    description: 'Encode/decode Base64',
    aliases: ['b64'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('📄');
                return reply(`📄 *BASE64 TOOLS*\n\n*Usage:*\n• ${config.PREFIX}base64 <text> (encode)\n• ${config.PREFIX}base64 decode <base64> (decode)`);
            }
            await react('🔄');
            const lowerText = text.toLowerCase();
            if (lowerText.startsWith('decode ')) {
                const base64Text = text.substring(7);
                const decoded = Buffer.from(base64Text, 'base64').toString('utf8');
                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `📄 *BASE64 DECODED*\n\n` +
                                 `*Decoded:*\n\`\`\`${decoded}\`\`\`\n\n` +
                                 `> created by wanga`;
                await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            } else {
                const encodeText = lowerText.startsWith('encode ') ? text.substring(7) : text;
                const encoded = Buffer.from(encodeText, 'utf8').toString('base64');
                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `📄 *BASE64 ENCODED*\n\n` +
                                 `*Encoded:*\n\`\`\`${encoded}\`\`\`\n\n` +
                                 `*To decode:* ${config.PREFIX}base64 decode ${encoded.substring(0, 30)}...\n\n` +
                                 `> created by wanga`;
                await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('Base64 error:', error);
            await react('❌');
            await reply(`❌ Base64 operation failed.\n\nFor encoding: ${config.PREFIX}base64 text\nFor decoding: ${config.PREFIX}base64 decode base64_string`);
        }
    }
});

// HASH
commands.push({
    name: 'hash',
    description: 'Generate hash values (MD5, SHA1, SHA256, SHA512)',
    aliases: ['hashgen', 'checksum'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🔒');
                return reply(`🔒 *HASH GENERATOR*\n\n*Usage:* ${config.PREFIX}hash <text>\n\n*Examples:*\n• ${config.PREFIX}hash password123\n• ${config.PREFIX}hash "secret message"`);
            }
            await react('🔄');
            const md5Hash = CryptoJS.MD5(text).toString();
            const sha1Hash = CryptoJS.SHA1(text).toString();
            const sha256Hash = CryptoJS.SHA256(text).toString();
            const sha512Hash = CryptoJS.SHA512(text).toString();
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔒 *HASH VALUES*\n\n` +
                             `*Original:* ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n\n` +
                             `*MD5:*\n\`${md5Hash}\`\n\n` +
                             `*SHA1:*\n\`${sha1Hash}\`\n\n` +
                             `*SHA256:*\n\`${sha256Hash}\`\n\n` +
                             `*SHA512:*\n\`${sha512Hash}\`\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Hash error:', error);
            await react('❌');
            await reply(`❌ Hash generation failed. Try: ${config.PREFIX}hash hello`);
        }
    }
});

// MORSE CODE
commands.push({
    name: 'morse',
    description: 'Convert text to Morse code and vice versa',
    aliases: ['morsecode', 'cw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('📡');
                return reply(`📡 *MORSE CODE*\n\n*Usage:*\n• ${config.PREFIX}morse <text> (encode)\n• ${config.PREFIX}morse .... . .-.. .-.. --- (decode)`);
            }
            await react('🔄');
            if (/^[\.\-\s]+$/.test(text)) {
                const decoded = morse.decode(text);
                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `📡 *MORSE DECODED*\n\n` +
                                 `*Morse:* ${text}\n\n` +
                                 `*Text:*\n\`\`\`${decoded}\`\`\`\n\n` +
                                 `> created by wanga`;
                await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            } else {
                const encoded = morse.encode(text);
                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `📡 *MORSE ENCODED*\n\n` +
                                 `*Text:* ${text}\n\n` +
                                 `*Morse Code:*\n\`\`\`${encoded}\`\`\`\n\n` +
                                 `> created by wanga`;
                await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('Morse error:', error);
            await react('❌');
            await reply(`❌ Morse code error.\n\nTry: ${config.PREFIX}morse SOS\nOr: ${config.PREFIX}morse ... --- ...`);
        }
    }
});

// ==================== SECURITY TOOLS ====================

// ENCRYPT
commands.push({
    name: 'encrypt',
    description: 'Encrypt text with password',
    aliases: ['encode', 'crypt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🔐');
                return reply(`🔐 *ENCRYPTION*\n\n*Usage:* ${config.PREFIX}encrypt <password> <text>\n\n*Examples:*\n• ${config.PREFIX}encrypt mysecret Hello World\n\n*Warning:* Remember your password!`);
            }
            const [password, ...messageParts] = text.split(' ');
            const message = messageParts.join(' ');
            if (!password || !message) {
                throw new Error('Need both password and message');
            }
            await react('🔄');
            const encrypted = CryptoJS.AES.encrypt(message, password).toString();
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔐 *ENCRYPTED MESSAGE*\n\n` +
                             `*Password:* ||${password}||\n` +
                             `*Original:* ${message}\n\n` +
                             `*Encrypted:*\n\`\`\`${encrypted}\`\`\`\n\n` +
                             `*To decrypt:* ${config.PREFIX}decrypt ${password} [encrypted]\n\n` +
                             `⚠️ *Save your password!*\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Encrypt error:', error);
            await react('❌');
            await reply(`❌ Encryption failed: ${error.message}\n\nFormat: ${config.PREFIX}encrypt <password> <message>`);
        }
    }
});

// DECRYPT
commands.push({
    name: 'decrypt',
    description: 'Decrypt text with password',
    aliases: ['decode', 'uncrypt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🔐');
                return reply(`🔐 *DECRYPTION*\n\n*Usage:* ${config.PREFIX}decrypt <password> <encrypted text>\n\n*Examples:*\n• ${config.PREFIX}decrypt mysecret U2FsdGVkX1/...\n\n*Note:* Use the same password used for encryption`);
            }
            const [password, ...encryptedParts] = text.split(' ');
            const encrypted = encryptedParts.join(' ');
            if (!password || !encrypted) {
                throw new Error('Need both password and encrypted text');
            }
            await react('🔄');
            const bytes = CryptoJS.AES.decrypt(encrypted, password);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                throw new Error('Wrong password or invalid encrypted text');
            }
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔐 *DECRYPTED MESSAGE*\n\n` +
                             `*Password:* ||${password}||\n` +
                             `*Encrypted:* ${encrypted.substring(0, 50)}...\n\n` +
                             `*Decrypted:*\n\`\`\`${decrypted}\`\`\`\n\n` +
                             `✅ *Successfully decrypted!*\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Decrypt error:', error);
            await react('❌');
            await reply(`❌ Decryption failed: ${error.message}\n\nCheck your password and encrypted text.`);
        }
    }
});

// ==================== GENERATOR TOOLS ====================

// PASSWORD GENERATOR
commands.push({
    name: 'password',
    description: 'Generate strong passwords',
    aliases: ['pass', 'genpass'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
        try {
            await react('🔐');
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            resultText += `🔐 *PASSWORD GENERATOR*\n\n`;
            resultText += `*Length:* ${length} characters\n\n`;
            for (let i = 1; i <= 3; i++) {
                const lowercase = 'abcdefghijklmnopqrstuvwxyz';
                const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const numbers = '0123456789';
                const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let password = '';
                const allChars = lowercase + uppercase + numbers + symbols;
                password += lowercase[Math.floor(Math.random() * lowercase.length)];
                password += uppercase[Math.floor(Math.random() * uppercase.length)];
                password += numbers[Math.floor(Math.random() * numbers.length)];
                password += symbols[Math.floor(Math.random() * symbols.length)];
                for (let j = 4; j < length; j++) {
                    password += allChars[Math.floor(Math.random() * allChars.length)];
                }
                password = password.split('').sort(() => Math.random() - 0.5).join('');
                resultText += `*Password ${i}:*\n\`\`\`${password}\`\`\`\n\n`;
            }
            resultText += `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Password error:', error);
            await react('❌');
            await reply(`❌ Password generation failed. Usage: ${config.PREFIX}password [length]`);
        }
    }
});

// EMAIL GENERATOR
commands.push({
    name: 'email',
    description: 'Generate random email addresses',
    aliases: ['genemail', 'fakeemail'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const count = Math.min(parseInt(args[0]) || 1, 20);
        try {
            await react('📧');
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            resultText += `📧 *EMAIL GENERATOR*\n\n`;
            resultText += `*Count:* ${count} email(s)\n\n`;
            for (let i = 1; i <= count; i++) {
                const email = faker.internet.email();
                resultText += `*${i}.* \`${email}\`\n`;
            }
            resultText += `\n⚠️ *FOR TESTING PURPOSES ONLY!*\n\n> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Email error:', error);
            await react('❌');
            await reply(`❌ Email generation failed. Usage: ${config.PREFIX}email [count]`);
        }
    }
});

// UUID GENERATOR
commands.push({
    name: 'uuid',
    description: 'Generate UUIDs (Universally Unique Identifiers)',
    aliases: ['guid', 'uniqueid'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const count = Math.min(parseInt(args[0]) || 5, 20);
        try {
            await react('🔑');
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            resultText += `🔑 *UUID GENERATOR*\n\n`;
            resultText += `*Count:* ${count} UUID(s)\n\n`;
            for (let i = 1; i <= count; i++) {
                const uuid = uuidv4();
                resultText += `*${i}.* \`${uuid}\`\n`;
            }
            resultText += `\n> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('UUID error:', error);
            await react('❌');
            await reply(`❌ UUID generation failed. Usage: ${config.PREFIX}uuid [count]`);
        }
    }
});

// ==================== LANGUAGE TOOLS ====================

// TRANSLATE
commands.push({
    name: 'translate',
    description: 'Translate text between languages',
    aliases: ['tr', 'trans'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const text = args.join(' ');
        try {
            if (!text) {
                await react('🌍');
                return reply(`🌍 *TRANSLATION*\n\n*Usage:* ${config.PREFIX}translate <text>\n• ${config.PREFIX}translate en sw Hello\n• ${config.PREFIX}translate sw en Habari\n\n*Language codes:*\nen=English, sw=Swahili, fr=French, es=Spanish, ar=Arabic`);
            }
            await react('🌍');
            const parts = text.split(' ');
            let fromLang = 'auto';
            let toLang = 'en';
            let textToTranslate = text;
            if (parts.length >= 3 && parts[0].length === 2 && parts[1].length === 2) {
                fromLang = parts[0];
                toLang = parts[1];
                textToTranslate = parts.slice(2).join(' ');
            } else if (parts.length >= 2 && parts[0].length === 2) {
                toLang = parts[0];
                textToTranslate = parts.slice(1).join(' ');
            }
            const result = await translate(textToTranslate, { from: fromLang, to: toLang });
            const languageNames = {
                'en': 'English', 'sw': 'Swahili', 'fr': 'French', 'es': 'Spanish',
                'de': 'German', 'ar': 'Arabic', 'zh': 'Chinese', 'hi': 'Hindi',
                'ru': 'Russian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean'
            };
            const fromName = fromLang === 'auto' ? 'Auto-detected' : (languageNames[fromLang] || fromLang);
            const toName = languageNames[toLang] || toLang;
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🌍 *TRANSLATION*\n\n` +
                             `*From:* ${fromName}\n` +
                             `*To:* ${toName}\n\n` +
                             `*Original:*\n${textToTranslate}\n\n` +
                             `*Translated:*\n${result.text}\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Translate error:', error);
            await react('❌');
            await reply(`❌ Translation failed.\n\nTry: ${config.PREFIX}translate Hello\nOr: ${config.PREFIX}translate sw en Habari yako?`);
        }
    }
});

// ==================== WEB TOOLS ====================

// BROWSE
commands.push({
    name: 'browse',
    description: 'Fetch and display webpage content',
    aliases: ['fetch', 'geturl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('🌐');
            return reply(`🌐 *BROWSE WEB*\n\nUsage: ${config.PREFIX}browse <url>\nExample: ${config.PREFIX}browse https://example.com`);
        }
        const url = args[0];
        if (!url.startsWith('http')) {
            return reply('❌ Please include http:// or https://');
        }
        await react('🌐');
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                const jsonData = JSON.stringify(response.data, null, 2);
                const truncated = jsonData.length > 4000 
                    ? jsonData.substring(0, 4000) + '...\n\n(Content truncated)'
                    : jsonData;
                await sock.sendMessage(from, {
                    text: `🌐 *JSON Response:*\n\n\`\`\`${truncated}\`\`\``
                }, { quoted: msg });
            } else {
                const textData = typeof response.data === 'string' 
                    ? response.data 
                    : JSON.stringify(response.data);
                const truncated = textData.length > 4000 
                    ? textData.substring(0, 4000) + '...\n\n(Content truncated)'
                    : textData;
                await sock.sendMessage(from, {
                    text: `🌐 *Webpage Content:*\n\n${truncated}`
                }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('Browse error:', error);
            await react('❌');
            await reply(`❌ Error fetching URL: ${error.message}`);
        }
    }
});

// TINYURL
commands.push({
    name: 'tinyurl',
    description: 'Shorten URLs',
    aliases: ['short', 'shortlink'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('🔗');
            return reply(`🔗 *URL SHORTENER*\n\nUsage: ${config.PREFIX}tinyurl <url>\nExample: ${config.PREFIX}tinyurl https://example.com`);
        }
        const url = args[0];
        if (!url.startsWith('http')) {
            return reply('❌ Please include http:// or https://');
        }
        await react('🔗');
        try {
            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
                timeout: 10000
            });
            const shortUrl = response.data;
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                              `🔗 *URL SHORTENED*\n\n` +
                              `*Original:* ${url}\n\n` +
                              `*Short:* ${shortUrl}\n\n` +
                              `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('TinyURL error:', error);
            await react('❌');
            await reply('❌ Failed to shorten URL.');
        }
    }
});

// ==================== MATH TOOLS ====================

// CALCULATE
commands.push({
    name: 'calculate',
    description: 'Solve math equations',
    aliases: ['calc', 'math', 'solve'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('🧮');
            return reply(`🧮 *CALCULATOR*\n\nUsage: ${config.PREFIX}calc <equation>\nExamples:\n• ${config.PREFIX}calc 2 + 2\n• ${config.PREFIX}calc sqrt(16)\n• ${config.PREFIX}calc sin(30deg)\n• ${config.PREFIX}calc 5^3`);
        }
        const equation = args.join(' ').replace(/×/g, '*').replace(/÷/g, '/');
        await react('🧮');
        try {
            const result = math.evaluate(equation);
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            resultText += `🧮 *CALCULATION*\n\n`;
            resultText += `📝 *Equation:* ${equation}\n`;
            resultText += `✅ *Result:* ${result}\n\n`;
            resultText += `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Invalid equation: ${error.message}`);
        }
    }
});

// ==================== TEXT TOOLS ====================

// FLIP TEXT
commands.push({
    name: 'fliptext',
    description: 'Flip text upside down',
    aliases: ['flip', 'upsidedown'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('🔄');
            return reply(`🔄 *FLIP TEXT*\n\nUsage: ${config.PREFIX}fliptext <text>\nExample: ${config.PREFIX}fliptext Hello World`);
        }
        const text = args.join(' ');
        const flipMap = {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
            'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
            'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
            'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ',
            'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'N',
            'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ',
            'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ',
            '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '!': '¡', '?': '¿',
            '.': '˙', ',': '\'', '"': '„', '\'': ',', '(': ')', ')': '(', '[': ']', ']': '[',
            '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
        };
        const flipped = text.split('').map(char => flipMap[char] || char).reverse().join('');
        const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                          `🔄 *FLIPPED TEXT*\n\n` +
                          `*Original:* ${text}\n\n` +
                          `*Flipped:* ${flipped}\n\n` +
                          `> created by wanga`;

        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
        await react('✅');
    }
});

// ==================== FUN TOOLS ====================

// EMOJI MIX
commands.push({
    name: 'emojimix',
    description: 'Mix two emojis together',
    aliases: ['emix', 'emojimix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length < 1 || !args[0].includes('+')) {
            await react('😊');
            return reply(`😊 *EMOJI MIX*\n\nUsage: ${config.PREFIX}emojimix 😅+🤔\nExample: ${config.PREFIX}emojimix 🐱+🐶`);
        }
        const [emoji1, emoji2] = args[0].split('+').map(e => e.trim());
        if (!emoji1 || !emoji2) {
            return reply('❌ Please provide two emojis separated by +');
        }
        await react('🎨');
        try {
            const response = await axios.get(
                `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`,
                { timeout: 10000 }
            );
            if (!response.data.results || !response.data.results.length) {
                return reply('❌ Could not mix these emojis. Try different ones.');
            }
            const result = response.data.results[0];
            await sock.sendMessage(from, {
                image: { url: result.url },
                caption: `🎨 *Emoji Mix*\n${emoji1} + ${emoji2}`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Emoji mix error:', error);
            await react('❌');
            await reply('❌ Failed to mix emojis. Try again later.');
        }
    }
});

// ==================== INFO TOOLS ====================

// GET PROFILE PIC
commands.push({
    name: 'getpp',
    description: 'Get user profile picture',
    aliases: ['profilepic', 'pp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = sender;
        
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (args[0]) {
            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
                target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            } else {
                let phone = args[0].replace(/\D/g, '');
                if (phone) {
                    target = phone + '@s.whatsapp.net';
                }
            }
        }
        await react('🖼️');
        try {
            const ppUrl = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(from, {
                image: { url: ppUrl },
                caption: `🖼️ *Profile Picture*\n👤 @${target.split('@')[0]}`,
                mentions: [target]
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await sock.sendMessage(from, {
                image: { url: 'https://files.catbox.moe/u29yah.jpg' },
                caption: `⚠️ No profile picture found for @${target.split('@')[0]}`,
                mentions: [target]
            }, { quoted: msg });
            await react('✅');
        }
    }
});

// GET ABOUT/BIO
commands.push({
    name: 'getabout',
    description: 'Get user about/bio',
    aliases: ['bio', 'about'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = sender;
        
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (args[0]) {
            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
                target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            } else {
                let phone = args[0].replace(/\D/g, '');
                if (phone) {
                    target = phone + '@s.whatsapp.net';
                }
            }
        }
        await react('📝');
        try {
            const { status, setAt } = await sock.fetchStatus(target);
            const date = new Date(setAt).toLocaleString('en-KE', {
                dateStyle: 'full',
                timeStyle: 'short'
            });
            const aboutText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `📝 *ABOUT INFO*\n\n` +
                             `👤 *User:* @${target.split('@')[0]}\n` +
                             `💬 *About:* ${status}\n` +
                             `🕒 *Set at:* ${date}\n\n` +
                             `> created by wanga`;
            await sock.sendMessage(from, {
                text: aboutText,
                mentions: [target]
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Could not fetch about info. User may have privacy settings.`);
        }
    }
});

// ==================== TECH TOOLS ====================

// GSM ARENA
commands.push({
    name: 'gsmarena',
    description: 'Search smartphone specs',
    aliases: ['gsm', 'phonespec'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('📱');
            return reply(`📱 *GSM ARENA*\n\nUsage: ${config.PREFIX}gsmarena <phone name>\nExample: ${config.PREFIX}gsmarena Samsung S23`);
        }
        const query = args.join(' ');
        await react('📱');
        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/s/gsmarena?query=${encodeURIComponent(query)}`, {
                timeout: 15000
            });
            if (!response.data?.status || !response.data.data || !response.data.data.length) {
                return reply('❌ No phones found. Try another model.');
            }
            const results = response.data.data.slice(0, 5);
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            resultText += `📱 *GSM ARENA RESULTS*\n\n`;
            resultText += `*Search:* ${query}\n`;
            resultText += `*Found:* ${response.data.data.length} phones\n`;
            resultText += `━━━━━━━━━━━━━━━━━━━\n\n`;
            results.forEach((phone, i) => {
                resultText += `*${i+1}. ${phone.name}*\n`;
                resultText += `📝 ${phone.description}\n`;
                if (phone.thumbnail) resultText += `🖼️ ${phone.thumbnail}\n`;
                resultText += `\n`;
            });
            resultText += `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('GSM Arena error:', error);
            await react('❌');
            await reply('❌ Failed to search phones. Try again later.');
        }
    }
});

// DEVICE DETECTION
commands.push({
    name: 'device',
    description: 'Detect device of a message',
    aliases: ['getdevice'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) {
            await react('📱');
            return reply(`📱 *DETECT DEVICE*\n\nUsage: Reply to any message with ${config.PREFIX}device`);
        }
        await react('📱');
        try {
            const messageId = msg.message.extendedTextMessage.contextInfo.stanzaId;
            const deviceSignatures = [
                { pattern: '3A0', name: 'WhatsApp Web' },
                { pattern: '3A1', name: 'iPhone' },
                { pattern: '3A2', name: 'iPad' },
                { pattern: '3A3', name: 'Android' },
                { pattern: '3A4', name: 'Windows Phone' },
                { pattern: '3A5', name: 'BlackBerry' },
                { pattern: '3A6', name: 'Nokia' },
                { pattern: '3A7', name: 'Windows 10' },
                { pattern: '3A8', name: 'macOS' },
                { pattern: '3A9', name: 'Linux' },
                { pattern: '3AA', name: 'Samsung' },
                { pattern: '3AB', name: 'Huawei' },
                { pattern: '3AC', name: 'Xiaomi' },
                { pattern: '3AD', name: 'Oppo' },
                { pattern: '3AE', name: 'Vivo' },
                { pattern: '3AF', name: 'Google Pixel' }
            ];
            let device = 'Unknown';
            const idPrefix = messageId.substring(0, 3);
            for (const sig of deviceSignatures) {
                if (idPrefix === sig.pattern) {
                    device = sig.name;
                    break;
                }
            }
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                              `📱 *DEVICE DETECTION*\n\n` +
                              `🆔 *Message ID:* ${messageId}\n` +
                              `📱 *Device:* ${device}\n\n` +
                              `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Device detection error:', error);
            await react('❌');
            await reply('❌ Could not detect device.');
        }
    }
});

// ==================== NEWS TOOLS ====================

// KENYAN NEWS
commands.push({
    name: 'kenyanews',
    description: 'Get detailed Kenyan news from multiple sources',
    aliases: ['knews', 'localnews', 'newske'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const category = args.join(' ').toLowerCase() || 'latest';
        try {
            await react('🇰🇪');
            const newsSources = [
                { name: "Nation Africa", url: "https://nation.africa/kenya" },
                { name: "Citizen TV", url: "https://citizentv.co.ke/news" },
                { name: "Standard Digital", url: "https://www.standardmedia.co.ke/" }
            ];
            let allNewsItems = [];
            for (const source of newsSources) {
                try {
                    const response = await axios.get(source.url, {
                        timeout: 10000,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    const $ = cheerio.load(response.data);
                    const headlines = $('h2, h3, .title, .headline').slice(0, 5);
                    headlines.each((i, el) => {
                        const title = $(el).text().trim();
                        if (title && title.length > 20) {
                            allNewsItems.push({
                                source: source.name,
                                title: title.substring(0, 150)
                            });
                        }
                    });
                } catch (e) {
                    continue;
                }
            }
            if (allNewsItems.length === 0) {
                allNewsItems = [
                    { source: "Nation", title: "Government announces new economic reforms" },
                    { source: "Citizen", title: "President addresses nation on development" },
                    { source: "Standard", title: "Kenya launches new infrastructure project" }
                ];
            }
            let newsText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            newsText += `🇰🇪 *KENYAN NEWS*\n\n`;
            allNewsItems.slice(0, 6).forEach((item, i) => {
                newsText += `*${i+1}. ${item.title}*\n📰 ${item.source}\n\n`;
            });
            newsText += `> created by wanga`;
            await sock.sendMessage(from, { text: newsText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Kenyan news error:', error);
            const fallbackNews = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                `🇰🇪 *KENYAN NEWS HEADLINES*\n\n` +
                                `1. Government announces new economic policies\n📰 Nation\n\n` +
                                `2. President to address nation on development\n📰 Citizen\n\n` +
                                `3. Infrastructure projects launched nationwide\n📰 Standard\n\n` +
                                `> created by wanga`;
            await sock.sendMessage(from, { text: fallbackNews }, { quoted: msg });
            await react('✅');
        }
    }
});

// ==================== MEDIA TOOLS ====================

// UPLOAD TO CATBOX
commands.push({
    name: 'tourl',
    description: 'Upload media to Catbox',
    aliases: ['upload', 'url'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
        const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;
        const hasDocument = msg.message?.documentMessage || quoted?.documentMessage;
        
        if (!hasImage && !hasVideo && !hasAudio && !hasDocument) {
            await react('📤');
            return reply(`📤 *UPLOAD MEDIA*\n\nUsage: Reply to any media with ${config.PREFIX}upload\n\nUploads to Catbox.moe and returns URL.`);
        }
        await react('📤');
        try {
            const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage || 
                             msg.message?.audioMessage || msg.message?.documentMessage 
                             ? msg : { ...msg, message: quoted };
            const { downloadMediaMessage } = require('gifted-baileys');
            const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', buffer, { filename: 'media.jpg' });
            const uploadResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders()
            });
            const url = uploadResponse.data.trim();
            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                              `📤 *MEDIA UPLOADED*\n\n` +
                              `🔗 *URL:* ${url}\n\n` +
                              `> created by wanga`;
            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Upload error:', error);
            await react('❌');
            await reply(`❌ Upload failed: ${error.message}`);
        }
    }
});

// ==================== TOOLS HELP ====================

commands.push({
    name: 'tools',
    description: 'Show all available tools',
    aliases: ['tool', 'toolshelp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('🛠️');
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME} TOOLS*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `*🛠️ ADVANCED TOOLS*\n\n` +
                        `*Encoding Tools:*\n` +
                        `• ${config.PREFIX}binary - Text to binary\n` +
                        `• ${config.PREFIX}debinary - Binary to text\n` +
                        `• ${config.PREFIX}base64 - Base64 encode/decode\n` +
                        `• ${config.PREFIX}hash - Generate hashes\n` +
                        `• ${config.PREFIX}morse - Morse code\n\n` +
                        `*Security Tools:*\n` +
                        `• ${config.PREFIX}encrypt - Encrypt text\n` +
                        `• ${config.PREFIX}decrypt - Decrypt text\n` +
                        `• ${config.PREFIX}password - Generate passwords\n\n` +
                        `*Generator Tools:*\n` +
                        `• ${config.PREFIX}email - Generate emails\n` +
                        `• ${config.PREFIX}uuid - Generate UUIDs\n\n` +
                        `*Language Tools:*\n` +
                        `• ${config.PREFIX}translate - Translate text\n\n` +
                        `*Web Tools:*\n` +
                        `• ${config.PREFIX}browse - Fetch webpage\n` +
                        `• ${config.PREFIX}tinyurl - Shorten URLs\n\n` +
                        `*Math Tools:*\n` +
                        `• ${config.PREFIX}calculate - Solve equations\n\n` +
                        `*Text Tools:*\n` +
                        `• ${config.PREFIX}fliptext - Flip text upside down\n\n` +
                        `*Fun Tools:*\n` +
                        `• ${config.PREFIX}emojimix - Mix two emojis\n\n` +
                        `*Info Tools:*\n` +
                        `• ${config.PREFIX}getpp - Get profile picture\n` +
                        `• ${config.PREFIX}getabout - Get user bio\n\n` +
                        `*Tech Tools:*\n` +
                        `• ${config.PREFIX}gsmarena - Search phone specs\n` +
                        `• ${config.PREFIX}device - Detect device\n\n` +
                        `*News Tools:*\n` +
                        `• ${config.PREFIX}kenyanews - Kenyan news\n\n` +
                        `*Media Tools:*\n` +
                        `• ${config.PREFIX}upload - Upload media to Catbox\n\n` +
                        `*Quick Examples:*\n` +
                        `• ${config.PREFIX}email 5 - Generate 5 emails\n` +
                        `• ${config.PREFIX}password 20 - Strong password\n` +
                        `• ${config.PREFIX}hash hello - Hash text\n` +
                        `• ${config.PREFIX}translate en sw Hello\n\n` +
                        `> created by wanga`;
        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };