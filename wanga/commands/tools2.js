const axios = require('axios');

const CryptoJS = require('crypto-js');

const morse = require('morse');

const { v4: uuidv4 } = require('uuid');

const translate = require('@iamtraction/google-translate');

const cheerio = require('cheerio');

const { faker } = require('@faker-js/faker');

const config = require('../../megan/config');

// WhatsApp Channel Newsletter Context

const CHANNEL_JID = "120363423423870584@newsletter";

const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b";

const BOT_IMAGE = "https://files.catbox.moe/u29yah.jpg";

const createNewsletterContext = (userJid, options = {}) => ({

    contextInfo: {

        mentionedJid: [userJid],

        forwardingScore: 999,

        isForwarded: false,

        forwardedNewsletterMessageInfo: {

            newsletterJid: CHANNEL_JID,

            newsletterName: options.newsletterName || config.BOT_NAME,

            serverMessageId: Math.floor(100000 + Math.random() * 900000)

        },

        externalAdReply: {

            title: options.title || "📢 Official Channel",

            body: options.body || "Join for updates & announcements",

            thumbnailUrl: options.thumbnail || BOT_IMAGE,

            mediaType: 1,

            mediaUrl: CHANNEL_LINK,

            sourceUrl: CHANNEL_LINK,

            showAdAttribution: true,

            renderLargerThumbnail: true

        }

    }

});

const commands = [];

// ==================== BINARY ENCODER/DECODER ====================

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔢 Binary Encoded",

                    body: "Use .debinary to decode"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Binary error:', error);

            await react('❌');

            await reply(`❌ Encoding failed. Try: ${config.PREFIX}binary Hello World`);

        }

    }

});

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔢 Binary Decoded",

                    body: "Use .binary to encode"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Debinary error:', error);

            await react('❌');

            await reply(`❌ Decoding failed: ${error.message}\n\nTry: ${config.PREFIX}debinary 01001000 01100101 01101100 01101100 01101111`);

        }

    }

});

// ==================== ENCRYPTION/DECRYPTION ====================

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔐 Message Encrypted",

                    body: "Use .decrypt with same password"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Encrypt error:', error);

            await react('❌');

            await reply(`❌ Encryption failed: ${error.message}\n\nFormat: ${config.PREFIX}encrypt <password> <message>`);

        }

    }

});

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔐 Message Decrypted",

                    body: "Successfully decrypted"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Decrypt error:', error);

            await react('❌');

            await reply(`❌ Decryption failed: ${error.message}\n\nCheck your password and encrypted text.`);

        }

    }

});

// ==================== MORSE CODE ====================

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

            

            // Check if it's Morse code (contains only . - and spaces)

            if (/^[\.\-\s]+$/.test(text)) {

                const decoded = morse.decode(text);

                

                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                 `📡 *MORSE DECODED*\n\n` +

                                 `*Morse:* ${text}\n\n` +

                                 `*Text:*\n\`\`\`${decoded}\`\`\`\n\n` +

                                 `> created by wanga`;

                

                await sock.sendMessage(from, {

                    text: resultText,

                    ...createNewsletterContext(sender, {

                        title: "📡 Morse Decoded",

                        body: "Use .morse <text> to encode"

                    })

                }, { quoted: msg });

            } else {

                const encoded = morse.encode(text);

                

                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                 `📡 *MORSE ENCODED*\n\n` +

                                 `*Text:* ${text}\n\n` +

                                 `*Morse Code:*\n\`\`\`${encoded}\`\`\`\n\n` +

                                 `> created by wanga`;

                

                await sock.sendMessage(from, {

                    text: resultText,

                    ...createNewsletterContext(sender, {

                        title: "📡 Morse Encoded",

                        body: "Use .morse ... --- ... to decode"

                    })

                }, { quoted: msg });

            }

            await react('✅');

        } catch (error) {

            bot.logger.error('Morse error:', error);

            await react('❌');

            await reply(`❌ Morse code error.\n\nTry: ${config.PREFIX}morse SOS\nOr: ${config.PREFIX}morse ... --- ...`);

        }

    }

});

// ==================== TRANSLATION ====================

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: `🌍 ${fromName} → ${toName}`,

                    body: "Translation completed"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Translate error:', error);

            await react('❌');

            await reply(`❌ Translation failed.\n\nTry: ${config.PREFIX}translate Hello\nOr: ${config.PREFIX}translate sw en Habari yako?`);

        }

    }

});

// ==================== KENYAN NEWS ====================

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

                { name: "Standard Digital", url: "https://www.standardmedia.co.ke/" },

                { name: "Tuko Kenya", url: "https://www.tuko.co.ke/kenya/" },

                { name: "Business Daily", url: "https://www.businessdailyafrica.com/" },

                { name: "The Star", url: "https://www.the-star.co.ke/news" }

            ];

            

            let allNewsItems = [];

            

            for (const source of newsSources.slice(0, 3)) {

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

                    { source: "Standard", title: "Kenya launches new infrastructure project" },

                    { source: "Business Daily", title: "Shilling shows stability against dollar" },

                    { source: "The Star", title: "Sports teams prepare for international event" }

                ];

            }

            

            let newsText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            newsText += `🇰🇪 *KENYAN NEWS*\n\n`;

            

            allNewsItems.slice(0, 8).forEach((item, i) => {

                newsText += `*${i+1}. ${item.title}*\n📰 ${item.source}\n\n`;

            });

            

            newsText += `> created by wanga`;

            

            await sock.sendMessage(from, {

                text: newsText,

                ...createNewsletterContext(sender, {

                    title: "🇰🇪 Kenyan News",

                    body: "Latest headlines"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Kenyan news error:', error);

            

            const fallbackNews = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                `🇰🇪 *KENYAN NEWS HEADLINES*\n\n` +

                                `1. Government announces new economic policies\n📰 Nation\n\n` +

                                `2. President to address nation on development\n📰 Citizen\n\n` +

                                `3. Infrastructure projects launched nationwide\n📰 Standard\n\n` +

                                `4. Shilling stabilizes against major currencies\n📰 Business Daily\n\n` +

                                `5. Sports teams prepare for international events\n📰 The Star\n\n` +

                                `> created by wanga`;

            

            await sock.sendMessage(from, {

                text: fallbackNews,

                ...createNewsletterContext(sender, {

                    title: "🇰🇪 Kenya News",

                    body: "Local updates"

                })

            }, { quoted: msg });

            

            await react('✅');

        }

    }

});

// ==================== GENERATOR COMMANDS ====================

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "📧 Emails Generated",

                    body: "Test email addresses"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Email error:', error);

            await react('❌');

            await reply(`❌ Email generation failed. Usage: ${config.PREFIX}email [count]`);

        }

    }

});

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔐 Strong Passwords",

                    body: "Password security tools"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Password error:', error);

            await react('❌');

            await reply(`❌ Password generation failed. Usage: ${config.PREFIX}password [length]`);

        }

    }

});

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔑 UUIDs Generated",

                    body: "Unique identifiers"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('UUID error:', error);

            await react('❌');

            await reply(`❌ UUID generation failed. Usage: ${config.PREFIX}uuid [count]`);

        }

    }

});

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔒 Hashes Generated",

                    body: "Cryptographic hashing"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Hash error:', error);

            await react('❌');

            await reply(`❌ Hash generation failed. Try: ${config.PREFIX}hash hello`);

        }

    }

});

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

                

                await sock.sendMessage(from, {

                    text: resultText,

                    ...createNewsletterContext(sender, {

                        title: "📄 Base64 Decoded",

                        body: "Use .base64 <text> to encode"

                    })

                }, { quoted: msg });

            } else {

                const encodeText = lowerText.startsWith('encode ') ? text.substring(7) : text;

                const encoded = Buffer.from(encodeText, 'utf8').toString('base64');

                

                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                 `📄 *BASE64 ENCODED*\n\n` +

                                 `*Encoded:*\n\`\`\`${encoded}\`\`\`\n\n` +

                                 `*To decode:* ${config.PREFIX}base64 decode ${encoded.substring(0, 30)}...\n\n` +

                                 `> created by wanga`;

                

                await sock.sendMessage(from, {

                    text: resultText,

                    ...createNewsletterContext(sender, {

                        title: "📄 Base64 Encoded",

                        body: "Use .base64 decode to decode"

                    })

                }, { quoted: msg });

            }

            await react('✅');

        } catch (error) {

            bot.logger.error('Base64 error:', error);

            await react('❌');

            await reply(`❌ Base64 operation failed.\n\nFor encoding: ${config.PREFIX}base64 text\nFor decoding: ${config.PREFIX}base64 decode base64_string`);

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

                        `*News Tools:*\n` +

                        `• ${config.PREFIX}kenyanews - Kenyan news\n\n` +

                        `*Quick Examples:*\n` +

                        `• ${config.PREFIX}email 5 - Generate 5 emails\n` +

                        `• ${config.PREFIX}password 20 - Strong password\n` +

                        `• ${config.PREFIX}hash hello - Hash text\n` +

                        `• ${config.PREFIX}translate en sw Hello\n\n` +

                        `> created by wanga`;

        

        await sock.sendMessage(from, {

            text: helpText,

            ...createNewsletterContext(sender, {

                title: "🛠️ Tools Module",

                body: "Advanced utilities"

            })

        }, { quoted: msg });

        await react('✅');

    }

});

module.exports = { commands };

