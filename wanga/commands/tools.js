// MEGAN-MD Tools Commands - Consistent styling with buttons

const axios = require('axios');
const CryptoJS = require('crypto-js');
const morse = require('morse');
const { v4: uuidv4 } = require('uuid');
const translate = require('@iamtraction/google-translate');
const { faker } = require('@faker-js/faker');
const math = require('mathjs');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');

const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

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

// ==================== HELPER FUNCTIONS ====================

async function translateToEnglish(text) {
    if (!text || text.length < 10) return text;
    try {
        const result = await translate(text, { to: 'en' });
        return result.text;
    } catch (e) {
        return text;
    }
}

// ==================== SECTION 1: ENCODING TOOLS ====================

// 1. BINARY ENCODER
commands.push({
    name: 'binary',
    description: 'Convert text to binary code',
    aliases: ['bin', 'texttobinary'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('🔢');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔢 *BINARY ENCODER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}binary <text>\n_Example:_ ${config.PREFIX}binary Hello\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');
        const binaryResult = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔢 *Binary Encoder*\n━━━━━━━━━━━━━━━━━━━\n_Original:_ ${text}\n\n_Binary:_\n${binaryResult}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Binary', copy_code: binaryResult }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 2. BINARY DECODER
commands.push({
    name: 'debinary',
    description: 'Convert binary code to text',
    aliases: ['unbinary'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('🔢');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔢 *BINARY DECODER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}debinary <binary>\n_Example:_ ${config.PREFIX}debinary 01001000 01100101\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');
        const cleanBinary = text.replace(/\s+/g, '');
        if (!/^[01]+$/.test(cleanBinary)) return reply('❌ Invalid binary code');

        let result = '';
        for (let i = 0; i < cleanBinary.length; i += 8) {
            const byte = cleanBinary.substr(i, 8);
            if (byte.length === 8) result += String.fromCharCode(parseInt(byte, 2));
        }

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔢 *Binary Decoder*\n━━━━━━━━━━━━━━━━━━━\n_Binary:_ ${text}\n\n_Text:_ ${result}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Text', copy_code: result }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 3. BASE64
commands.push({
    name: 'base64',
    description: 'Encode/decode Base64',
    aliases: ['b64'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('📄');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📄 *BASE64*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n• ${config.PREFIX}base64 <text> (encode)\n• ${config.PREFIX}base64 decode <base64> (decode)\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');

        if (text.toLowerCase().startsWith('decode ')) {
            const base64Text = text.substring(7);
            const decoded = Buffer.from(base64Text, 'base64').toString('utf8');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📄 *Base64 Decoder*\n━━━━━━━━━━━━━━━━━━━\n_Decoded:_\n${decoded}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: decoded }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } else {
            const encodeText = text.toLowerCase().startsWith('encode ') ? text.substring(7) : text;
            const encoded = Buffer.from(encodeText, 'utf8').toString('base64');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📄 *Base64 Encoder*\n━━━━━━━━━━━━━━━━━━━\n_Encoded:_\n${encoded}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: encoded }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        await react('✅');
    }
});

// 4. HASH GENERATOR
commands.push({
    name: 'hash',
    description: 'Generate hash values',
    aliases: ['hashgen'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('🔒');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔒 *HASH GENERATOR*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}hash <text>\n_Example:_ ${config.PREFIX}hash password123\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');

        const md5 = CryptoJS.MD5(text).toString();
        const sha1 = CryptoJS.SHA1(text).toString();
        const sha256 = CryptoJS.SHA256(text).toString();

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔒 *Hash Generator*\n━━━━━━━━━━━━━━━━━━━\n_MD5:_ \`${md5}\`\n\n_SHA1:_ \`${sha1}\`\n\n_SHA256:_ \`${sha256}\`\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy MD5', copy_code: md5 }) },
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy SHA256', copy_code: sha256 }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 5. MORSE CODE
commands.push({
    name: 'morse',
    description: 'Convert text to Morse code',
    aliases: ['morsecode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('📡');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📡 *MORSE CODE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n• ${config.PREFIX}morse <text> (encode)\n• ${config.PREFIX}morse .... . .-.. .-.. --- (decode)\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');

        if (/^[\.\-\s]+$/.test(text)) {
            const decoded = morse.decode(text);
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📡 *Morse Decoder*\n━━━━━━━━━━━━━━━━━━━\n_Morse:_ ${text}\n\n_Text:_ ${decoded}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Text', copy_code: decoded }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } else {
            const encoded = morse.encode(text);
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📡 *Morse Encoder*\n━━━━━━━━━━━━━━━━━━━\n_Text:_ ${text}\n\n_Morse:_ ${encoded}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Morse', copy_code: encoded }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
        await react('✅');
    }
});

// ==================== SECTION 2: SECURITY TOOLS ====================

// 6. ENCRYPT
commands.push({
    name: 'encrypt',
    description: 'Encrypt text with password',
    aliases: ['encode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('🔐');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔐 *ENCRYPT*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}encrypt <password> <text>\n_Example:_ ${config.PREFIX}encrypt mysecret Hello World\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const [password, ...messageParts] = text.split(' ');
        const message = messageParts.join(' ');
        if (!password || !message) return reply('❌ Need both password and message');

        await react('🔄');
        const encrypted = CryptoJS.AES.encrypt(message, password).toString();

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔐 *Encrypted*\n━━━━━━━━━━━━━━━━━━━\n_Password:_ ||${password}||\n\n_Encrypted:_\n${encrypted}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: encrypted }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 7. DECRYPT
commands.push({
    name: 'decrypt',
    description: 'Decrypt text with password',
    aliases: ['decode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const text = args.join(' ');
        if (!text) {
            await react('🔐');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔐 *DECRYPT*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}decrypt <password> <encrypted>\n_Example:_ ${config.PREFIX}decrypt mysecret U2FsdGVkX1...\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const [password, ...encryptedParts] = text.split(' ');
        const encrypted = encryptedParts.join(' ');
        if (!password || !encrypted) return reply('❌ Need both password and encrypted text');

        await react('🔄');
        const bytes = CryptoJS.AES.decrypt(encrypted, password);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) return reply('❌ Wrong password or corrupted data');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔐 *Decrypted*\n━━━━━━━━━━━━━━━━━━━\n_Password:_ ||${password}||\n\n_Decrypted:_\n${decrypted}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: decrypted }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 8. PASSWORD GENERATOR
commands.push({
    name: 'password',
    description: 'Generate strong passwords',
    aliases: ['pass', 'genpass'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
        await react('🔐');

        const passwords = [];
        for (let i = 0; i < 3; i++) {
            const lowercase = 'abcdefghijklmnopqrstuvwxyz';
            const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const allChars = lowercase + uppercase + numbers + symbols;

            let password = '';
            password += lowercase[Math.floor(Math.random() * lowercase.length)];
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
            password += numbers[Math.floor(Math.random() * numbers.length)];
            password += symbols[Math.floor(Math.random() * symbols.length)];

            for (let j = 4; j < length; j++) {
                password += allChars[Math.floor(Math.random() * allChars.length)];
            }
            password = password.split('').sort(() => Math.random() - 0.5).join('');
            passwords.push(password);
        }

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔐 *Strong Passwords*\n━━━━━━━━━━━━━━━━━━━\n_Length:_ ${length} characters\n\n_Password 1:_ \`${passwords[0]}\`\n\n_Password 2:_ \`${passwords[1]}\`\n\n_Password 3:_ \`${passwords[2]}\`\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy 1', copy_code: passwords[0] }) },
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy 2', copy_code: passwords[1] }) },
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy 3', copy_code: passwords[2] }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 9. VCC GENERATOR
commands.push({
    name: 'vcc',
    description: 'Generate fake credit cards',
    aliases: ['vccgen'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const type = args[0]?.toUpperCase() || 'Visa';
        const count = Math.min(parseInt(args[1]) || 1, 5);

        const validTypes = ['Visa', 'MasterCard', 'Amex', 'JCB', 'Diners'];
        if (!validTypes.includes(type)) {
            return reply(`❌ Invalid type. Use: ${validTypes.join(', ')}`);
        }

        await react('💳');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/vcc-generator`, {
                params: { type, count },
                timeout: 20000
            });

            if (response.data?.data?.length) {
                const cards = response.data.data;
                let resultText = `💳 *${type} Cards (${cards.length})*\n━━━━━━━━━━━━━━━━━━━\n\n`;
                cards.forEach((card, i) => {
                    resultText += `*${i+1}.* \`${card.cardNumber}\`\n   Exp: ${card.expirationDate} | CVV: ${card.cvv}\n   Name: ${card.cardholderName}\n\n`;
                });
                resultText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

                await sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: resultText,
                    image: BOT_LOGO,
                    buttons: cards.slice(0, 3).map((card, i) => ({
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({ display_text: `📋 Copy Card ${i+1}`, copy_code: `${card.cardNumber}|${card.expirationDate}|${card.cvv}` })
                    }))
                }, msg);
                await react('✅');
                return;
            }
        } catch (apiError) {}

        // Fallback: Generate fake data locally
        const cards = [];
        for (let i = 0; i < count; i++) {
            const cardNumber = Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
            const expMonth = Math.floor(Math.random() * 12) + 1;
            const expYear = 25 + Math.floor(Math.random() * 5);
            const cvv = Math.floor(Math.random() * 900) + 100;
            const names = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Brown'];
            const cardholderName = names[Math.floor(Math.random() * names.length)];

            cards.push({
                cardNumber,
                expirationDate: `${expMonth.toString().padStart(2, '0')}/${expYear}`,
                cardholderName,
                cvv: cvv.toString()
            });
        }

        let resultText = `💳 *${type} Cards (${cards.length})* [Fallback]\n━━━━━━━━━━━━━━━━━━━\n\n`;
        cards.forEach((card, i) => {
            resultText += `*${i+1}.* \`${card.cardNumber}\`\n   Exp: ${card.expirationDate} | CVV: ${card.cvv}\n   Name: ${card.cardholderName}\n\n`;
        });
        resultText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: resultText,
            image: BOT_LOGO,
            buttons: cards.slice(0, 3).map((card, i) => ({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({ display_text: `📋 Copy Card ${i+1}`, copy_code: `${card.cardNumber}|${card.expirationDate}|${card.cvv}` })
            }))
        }, msg);
        await react('✅');
    }
});

// ==================== SECTION 3: GENERATOR TOOLS ====================

// 10. EMAIL GENERATOR
commands.push({
    name: 'email',
    description: 'Generate random email addresses',
    aliases: ['genemail'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const count = Math.min(parseInt(args[0]) || 1, 20);
        await react('📧');

        const emails = [];
        for (let i = 0; i < count; i++) {
            emails.push(faker.internet.email());
        }

        let resultText = `📧 *Random Emails*\n━━━━━━━━━━━━━━━━━━━\n_${count} Email(s)_\n\n`;
        emails.forEach((e, i) => {
            resultText += `${i+1}. \`${e}\`\n`;
        });
        resultText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: resultText,
            image: BOT_LOGO,
            buttons: emails.slice(0, 3).map((email, i) => ({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({ display_text: `📋 Copy ${i+1}`, copy_code: email })
            }))
        }, msg);
        await react('✅');
    }
});

// 11. UUID GENERATOR
commands.push({
    name: 'uuid',
    description: 'Generate UUIDs',
    aliases: ['guid'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const count = Math.min(parseInt(args[0]) || 5, 20);
        await react('🔑');

        const uuids = [];
        for (let i = 0; i < count; i++) {
            uuids.push(uuidv4());
        }

        let resultText = `🔑 *UUID Generator*\n━━━━━━━━━━━━━━━━━━━\n_${count} UUID(s)_\n\n`;
        uuids.forEach((u, i) => {
            resultText += `${i+1}. \`${u}\`\n`;
        });
        resultText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: resultText,
            image: BOT_LOGO,
            buttons: uuids.slice(0, 3).map((uuid, i) => ({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({ display_text: `📋 Copy ${i+1}`, copy_code: uuid })
            }))
        }, msg);
        await react('✅');
    }
});

// ==================== SECTION 4: WEB TOOLS ====================

// 12. BROWSE WEB
commands.push({
    name: 'browse',
    description: 'Fetch webpage content',
    aliases: ['fetch'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🌐');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌐 *BROWSE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}browse <url>\n_Example:_ ${config.PREFIX}browse https://example.com\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const url = args[0];
        if (!url.startsWith('http')) return reply('❌ Please include http:// or https://');

        await react('🌐');

        try {
            const response = await axios.get(url, { timeout: 15000 });
            const textData = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            const truncated = textData.length > 4000 ? textData.substring(0, 4000) + '...' : textData;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌐 *Web Content*\n━━━━━━━━━━━━━━━━━━━\n${truncated}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: truncated }) },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🔗 Open URL', url: url }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Error fetching URL: ${error.message}`);
        }
    }
});

// 13. TINYURL SHORTENER
commands.push({
    name: 'tinyurl',
    description: 'Shorten URLs',
    aliases: ['short'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔗');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔗 *SHORTEN URL*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}tinyurl <url>\n_Example:_ ${config.PREFIX}tinyurl https://example.com\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const url = args[0];
        if (!url.startsWith('http')) return reply('❌ Please include http:// or https://');

        await react('🔗');

        try {
            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
                timeout: 15000
            });
            const shortUrl = response.data;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔗 *Short URL*\n━━━━━━━━━━━━━━━━━━━\n_Original:_ ${url}\n\n_Short:_ ${shortUrl}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: shortUrl }) },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🔗 Open', url: shortUrl }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply('❌ Failed to shorten URL.');
        }
    }
});

// 14. SCREENSHOT
commands.push({
    name: 'screenshot',
    description: 'Take screenshot of a website',
    aliases: ['ss', 'ssweb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('📸');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📸 *SCREENSHOT*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}screenshot <url>\n_Example:_ ${config.PREFIX}screenshot https://google.com\n\n_Options:_\n• Desktop (default)\n• Add 'mobile' for mobile view\n• Add 'full' for full page\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let url = args[0];
        let device = 'desktop';
        let fullPage = false;

        if (args[1]) {
            if (args[1].toLowerCase() === 'mobile') device = 'mobile';
            if (args[1].toLowerCase() === 'full') fullPage = true;
            if (args[2] && args[2].toLowerCase() === 'full') fullPage = true;
        }

        if (!url.startsWith('http')) url = 'https://' + url;

        await react('📸');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/ssweb`, {
                params: { url, device, theme: 'light', fullPage },
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            const imageBuffer = Buffer.from(response.data);
            const caption = `📸 *Screenshot*\n━━━━━━━━━━━━━━━━━━━\n_🌐 URL:_ ${url}\n_📱 Device:_ ${device}\n_📄 Full Page:_ ${fullPage ? 'Yes' : 'No'}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sock.sendMessage(from, { image: imageBuffer, caption: caption }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Screenshot failed.\n\nTry: ${config.PREFIX}screenshot https://google.com`);
        }
    }
});

// 15. SUBDOMAINS FINDER
commands.push({
    name: 'subdomains',
    description: 'Find subdomains for a domain',
    aliases: ['subdomain'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔍');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔍 *SUBDOMAINS*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}subdomains <domain>\n_Example:_ ${config.PREFIX}subdomains github.com\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const domain = args[0];
        await react('🔍');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains`, {
                params: { domain },
                timeout: 20000
            });

            if (!response.data?.data?.length) throw new Error('No subdomains found');

            const subdomains = response.data.data.slice(0, 20);
            let resultText = `🔍 *Subdomains for ${domain}*\n━━━━━━━━━━━━━━━━━━━\n\n`;
            subdomains.forEach((s, i) => {
                resultText += `${i+1}. ${s}\n`;
            });
            resultText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy List', copy_code: subdomains.join('\n') }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Failed to find subdomains.`);
        }
    }
});

// ==================== SECTION 5: INFO TOOLS ====================

// 16. COUNTRY INFO
commands.push({
    name: 'countryinfo',
    description: 'Get information about a country',
    aliases: ['country'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🌍');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌍 *COUNTRY INFO*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}countryinfo <country>\n_Example:_ ${config.PREFIX}countryinfo Kenya\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const country = args.join(' ');
        await react('🌍');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo`, {
                params: { name: country },
                timeout: 15000
            });

            if (!response.data?.data) throw new Error('Country not found');

            const data = response.data.data;

            let languages = 'N/A';
            if (data.languages) {
                if (Array.isArray(data.languages)) {
                    languages = data.languages.join(', ');
                } else if (typeof data.languages === 'object') {
                    languages = Object.values(data.languages).join(', ');
                } else {
                    languages = data.languages.toString();
                }
            }

            let resultText = `🌍 *${data.name}*\n━━━━━━━━━━━━━━━━━━━\n\n` +
                `_🏛️ Capital:_ ${data.capital || 'N/A'}\n` +
                `_👥 Population:_ ${data.population?.toLocaleString() || 'N/A'}\n` +
                `_🗺️ Area:_ ${data.area?.toLocaleString() || 'N/A'} km²\n` +
                `_💰 Currency:_ ${data.currency || 'N/A'}\n` +
                `_🗣️ Languages:_ ${languages}\n` +
                `_⏰ Timezones:_ ${data.timezones?.join(', ') || 'N/A'}\n\n` +
                `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: resultText.replace(/\*/g, '') }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Country not found.`);
        }
    }
});

// ==================== SECTION 6: SOCIAL STALKING ====================

// 17. GITHUB STALK
commands.push({
    name: 'githubstalk',
    description: 'Get GitHub user info',
    aliases: ['ghstalk'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🐙');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🐙 *GITHUB STALK*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}githubstalk <username>\n_Example:_ ${config.PREFIX}githubstalk torvalds\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const username = args[0];
        await react('🐙');

        try {
            let user = null;
            let htmlUrl = `https://github.com/${username}`;

            try {
                const response = await axios.get(`https://api.github.com/users/${username}`, {
                    timeout: 10000,
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                user = response.data;
            } catch (githubError) {
                try {
                    const response = await axios.get(`https://api.siputzx.my.id/api/stalk/github`, {
                        params: { user: username },
                        timeout: 10000
                    });
                    if (response.data?.data) user = response.data.data;
                } catch (siputzxError) {
                    user = {
                        login: username,
                        name: username,
                        bio: 'GitHub user',
                        public_repos: 0,
                        followers: 0,
                        following: 0,
                        created_at: new Date().toISOString(),
                        html_url: htmlUrl
                    };
                }
            }

            let resultText = `🐙 *${user.login || username}*\n━━━━━━━━━━━━━━━━━━━\n\n` +
                `_📛 Name:_ ${user.name || 'N/A'}\n` +
                `_📝 Bio:_ ${user.bio || 'N/A'}\n` +
                `_📦 Public Repos:_ ${user.public_repos || 0}\n` +
                `_👥 Followers:_ ${user.followers || 0}\n` +
                `_👤 Following:_ ${user.following || 0}\n` +
                `_📅 Created:_ ${new Date(user.created_at).toLocaleDateString()}\n\n` +
                `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🔗 View Profile', url: user.html_url || htmlUrl }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ User not found.`);
        }
    }
});

// 18. YOUTUBE STALK
commands.push({
    name: 'youtubestalk',
    description: 'Get YouTube channel info',
    aliases: ['ytstalk'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('📺');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📺 *YOUTUBE STALK*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}youtubestalk <channel>\n_Example:_ ${config.PREFIX}youtubestalk MrBeast\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const channel = args[0];
        await react('📺');

        try {
            let channelData = null;
            let channelUrl = `https://youtube.com/@${channel}`;

            try {
                const response = await axios.get(`https://api.siputzx.my.id/api/stalk/youtube`, {
                    params: { username: channel },
                    timeout: 15000
                });
                if (response.data?.data) channelData = response.data.data;
            } catch (apiError) {
                channelData = {
                    channelName: channel,
                    subscribers: 'N/A',
                    totalViews: 'N/A',
                    totalVideos: 'N/A',
                    joinedDate: 'N/A',
                    channelUrl: channelUrl
                };
            }

            let resultText = `📺 *${channelData.channelName || channel}*\n━━━━━━━━━━━━━━━━━━━\n\n` +
                `_👥 Subscribers:_ ${channelData.subscribers || 'N/A'}\n` +
                `_👁️ Total Views:_ ${channelData.totalViews || 'N/A'}\n` +
                `_🎬 Total Videos:_ ${channelData.totalVideos || 'N/A'}\n` +
                `_📅 Joined:_ ${channelData.joinedDate || 'N/A'}\n\n` +
                `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🔗 View Channel', url: channelData.channelUrl || channelUrl }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Channel not found.`);
        }
    }
});

// ==================== SECTION 7: MATH & TEXT TOOLS ====================

// 19. CALCULATE
commands.push({
    name: 'calculate',
    description: 'Solve math equations',
    aliases: ['calc', 'math'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🧮');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🧮 *CALCULATOR*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}calc <equation>\n_Example:_ ${config.PREFIX}calc 2+2\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const equation = args.join(' ').replace(/×/g, '*').replace(/÷/g, '/');
        await react('🧮');

        try {
            const result = math.evaluate(equation);

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🧮 *Calculator*\n━━━━━━━━━━━━━━━━━━━\n_Equation:_ ${equation}\n\n_Result:_ ${result}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: result.toString() }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Invalid equation: ${error.message}`);
        }
    }
});

// 20. FLIP TEXT
commands.push({
    name: 'fliptext',
    description: 'Flip text upside down',
    aliases: ['flip'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔄');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔄 *FLIP TEXT*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}fliptext <text>\n_Example:_ ${config.PREFIX}fliptext Hello\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const text = args.join(' ');

        const flipMap = {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
            'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
            'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
            'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': '𐐒',
            'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I',
            'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
            'Q': 'Q', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ', 'W': 'M',
            'X': 'X', 'Y': '⅄', 'Z': 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ',
            '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '!': '¡',
            '?': '¿', '.': '˙', ',': "'", '"': '„', "'": ',', '(': ')', ')': '(',
            '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
        };

        const flipped = text.split('').map(char => flipMap[char] || char).reverse().join('');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔄 *Flipped Text*\n━━━━━━━━━━━━━━━━━━━\n_Original:_ ${text}\n\n_Flipped:_ ${flipped}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: flipped }) },
                { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 21. EMOJI MIX
commands.push({
    name: 'emojimix',
    description: 'Mix two emojis together',
    aliases: ['emix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length < 1 || !args[0].includes('+')) {
            await react('😊');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `😊 *EMOJI MIX*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}emojimix 😅+🤔\n_Example:_ ${config.PREFIX}emojimix 🐱+🐶\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const [emoji1, emoji2] = args[0].split('+').map(e => e.trim());
        if (!emoji1 || !emoji2) return reply('❌ Please provide two emojis separated by +');

        await react('🎨');

        try {
            const response = await axios.get(
                `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`,
                { timeout: 15000 }
            );

            if (!response.data.results?.length) return reply('❌ Could not mix these emojis.');

            const result = response.data.results[0];

            await sock.sendMessage(from, {
                image: { url: result.url },
                caption: `🎨 *Emoji Mix*\n\n${emoji1} + ${emoji2}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply('❌ Failed to mix emojis.');
        }
    }
});

// 22. ZODIAK
commands.push({
    name: 'zodiak',
    description: 'Get zodiac information',
    aliases: ['zodiac'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('⭐');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⭐ *ZODIAK*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}zodiak <sign>\n_Example:_ ${config.PREFIX}zodiak gemini\n\n_Signs:_ aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const sign = args[0].toLowerCase();
        await react('⭐');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/primbon/zodiak`, {
                params: { zodiak: sign },
                timeout: 15000
            });

            if (!response.data?.data) throw new Error('Zodiac not found');

            const data = response.data.data;
            const translatedDesc = await translateToEnglish(data.zodiak);

            let resultText = `⭐ *${sign.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━\n\n` +
                `_📝 Description:_ ${translatedDesc}\n\n` +
                `_🔢 Lucky Numbers:_ ${data.nomor_keberuntungan || 'N/A'}\n` +
                `_🌸 Lucky Flowers:_ ${data.bunga_keberuntungan || 'N/A'}\n` +
                `_🎨 Lucky Color:_ ${data.warna_keberuntungan || 'N/A'}\n` +
                `_💧 Element:_ ${data.elemen_keberuntungan || 'N/A'}\n` +
                `_🪐 Planet:_ ${data.planet_yang_mengitari || 'N/A'}\n\n` +
                `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy', copy_code: resultText.replace(/\*/g, '') }) },
                    { id: `${config.PREFIX}tools`, text: '🛠️ Tools' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ Zodiac not found.\n\nTry: ${config.PREFIX}zodiak gemini`);
        }
    }
});

// ==================== SECTION 8: HELP ====================

// 23. TOOLS HELP
commands.push({
    name: 'tools',
    description: 'Show all tool commands',
    aliases: ['toolhelp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `🛠️ *MEGAN TOOLS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*🔢 ENCODING*\n` +
            `_${prefix}binary_ - Text to binary\n` +
            `_${prefix}debinary_ - Binary to text\n` +
            `_${prefix}base64_ - Encode/decode\n` +
            `_${prefix}hash_ - MD5, SHA1, SHA256\n` +
            `_${prefix}morse_ - Morse code\n\n` +

            `*🔐 SECURITY*\n` +
            `_${prefix}encrypt_ - AES encrypt\n` +
            `_${prefix}decrypt_ - AES decrypt\n` +
            `_${prefix}password_ - Strong passwords\n` +
            `_${prefix}vcc_ - Credit cards\n\n` +

            `*🎲 GENERATORS*\n` +
            `_${prefix}email_ - Random emails\n` +
            `_${prefix}uuid_ - UUIDs\n\n` +

            `*🌐 WEB*\n` +
            `_${prefix}browse_ - Fetch webpage\n` +
            `_${prefix}tinyurl_ - Shorten URL\n` +
            `_${prefix}screenshot_ - Website screenshot\n` +
            `_${prefix}subdomains_ - Find subdomains\n\n` +

            `*🌍 INFO*\n` +
            `_${prefix}countryinfo_ - Country details\n` +
            `_${prefix}githubstalk_ - GitHub profile\n` +
            `_${prefix}youtubestalk_ - Channel info\n\n` +

            `*🧮 MATH & TEXT*\n` +
            `_${prefix}calc_ - Calculate\n` +
            `_${prefix}fliptext_ - Flip text\n` +
            `_${prefix}emojimix_ - Mix emojis\n` +
            `_${prefix}zodiak_ - Zodiac info\n\n` +

            `> created by wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: helpText,
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
