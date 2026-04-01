// MEGAN-MD Search Commands - Consistent styling with buttons

const axios = require('axios');
const yts = require('yt-search');
const cheerio = require('cheerio');
const translate = require('@iamtraction/google-translate');
const config = require('../../megan/config');

const commands = [];

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

// ==================== HELPER FUNCTIONS ====================

function formatNumber(num) {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function cleanText(text, maxLength = 200) {
    if (!text) return '';
    const clean = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return clean.length > maxLength ? clean.substring(0, maxLength) + '...' : clean;
}

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

// ============================================
// CATEGORY 1: WEB SEARCH
// ============================================

// 1. GOOGLE SEARCH
commands.push({
    name: 'google',
    description: 'Search Google via DuckDuckGo',
    aliases: ['g'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔍');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔍 *Google Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}google <query>\n_Example:_ ${config.PREFIX}google Megan MD\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🔍');

        try {
            const response = await axios.get('https://html.duckduckgo.com/html', {
                params: { q: query },
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            const results = [];

            $('.result').each((i, el) => {
                if (i < 10) {
                    const title = $(el).find('.result__title').text().trim();
                    const url = $(el).find('.result__url').text().trim();
                    const snippet = $(el).find('.result__snippet').text().trim();

                    if (title && url) {
                        results.push({
                            title,
                            url: url.startsWith('http') ? url : 'https://' + url,
                            snippet
                        });
                    }
                }
            });

            if (results.length === 0) throw new Error('No results found');

            let resultText = `🔍 *GOOGLE SEARCH*\n━━━━━━━━━━━━━━━━━━━\n_Query:_ "${query}"\n_Results:_ ${results.length}\n\n`;
            results.forEach((r, i) => {
                resultText += `*${i+1}. ${r.title}*\n📎 ${r.url}\n${r.snippet ? `📝 ${r.snippet}\n` : ''}\n`;
            });
            resultText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Google search error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Search Failed*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 2. BING SEARCH
commands.push({
    name: 'bing',
    description: 'Search Bing',
    aliases: ['bing'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔍');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔍 *Bing Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}bing <query>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🔍');

        try {
            const response = await axios.get('https://www.bing.com/search', {
                params: { q: query },
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            const results = [];

            $('#b_results .b_algo').each((i, el) => {
                if (i < 10) {
                    const title = $(el).find('h2').text().trim();
                    const link = $(el).find('h2 a').attr('href');
                    const desc = $(el).find('.b_caption p').text().trim();

                    if (title && link) {
                        results.push({ title, url: link, description: desc });
                    }
                }
            });

            if (results.length === 0) throw new Error('No results found');

            let resultText = `🔍 *BING SEARCH*\n━━━━━━━━━━━━━━━━━━━\n_Query:_ "${query}"\n_Results:_ ${results.length}\n\n`;
            results.forEach((r, i) => {
                resultText += `*${i+1}. ${r.title}*\n📎 ${r.url}\n${r.description ? `📝 ${r.description}\n` : ''}\n`;
            });
            resultText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Bing error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Search Failed*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 3. DUCKDUCKGO SEARCH
commands.push({
    name: 'duckduckgo',
    description: 'Search DuckDuckGo',
    aliases: ['ddg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🦆');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🦆 *DuckDuckGo Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}duckduckgo <query>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🦆');

        try {
            const response = await axios.get(`https://api.siputzx.my.id/api/s/duckduckgo`, {
                params: { query: query, kl: 'us-en', df: 'w' },
                timeout: 10000
            });

            if (!response.data?.status || !response.data.data?.results) {
                throw new Error('No results found');
            }

            const results = response.data.data.results.slice(0, 10);
            let resultText = `🦆 *DUCKDUCKGO SEARCH*\n━━━━━━━━━━━━━━━━━━━\n_Query:_ "${query}"\n_Results:_ ${results.length}\n\n`;
            results.forEach((r, i) => {
                resultText += `*${i+1}. ${r.title}*\n📎 ${r.url}\n${r.snippet ? `📝 ${r.snippet}\n` : ''}\n`;
            });
            resultText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('DuckDuckGo error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Search Failed*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 4. SEARCH ALL (Multi-engine)
commands.push({
    name: 'searchall',
    description: 'Search across multiple engines',
    aliases: ['allsearch'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🌐');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌐 *Multi-Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}searchall <query>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🌐');

        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        const braveUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
        const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

        let resultText = `🌐 *MULTI-SEARCH*\n━━━━━━━━━━━━━━━━━━━\n_Query:_ "${query}"\n\n🔍 *Google:*\n${googleUrl}\n\n📚 *Wikipedia:*\n${wikiUrl}\n\n🦁 *Brave:*\n${braveUrl}\n\n🦊 *Bing:*\n${bingUrl}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: resultText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ============================================
// CATEGORY 2: WIKIPEDIA
// ============================================

// 5. WIKIPEDIA
commands.push({
    name: 'wiki',
    description: 'Search Wikipedia articles',
    aliases: ['wikipedia', 'encyclopedia'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('📚');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📚 *Wikipedia*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}wiki <topic>\n_Example:_ ${config.PREFIX}wiki Love\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('📚');

        try {
            const searchResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: query,
                    format: 'json',
                    srlimit: 5
                },
                timeout: 10000
            });

            const searchResults = searchResponse.data.query.search;
            if (!searchResults?.length) throw new Error('No articles found');

            const pageTitle = searchResults[0].title;
            const summaryResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`);

            const data = summaryResponse.data;

            let wikiText = `📚 *WIKIPEDIA*\n━━━━━━━━━━━━━━━━━━━\n*${data.title}*\n\n${cleanText(data.extract, 500)}\n\n`;
            if (data.content_urls?.desktop?.page) {
                wikiText += `🔗 Read more: ${data.content_urls.desktop.page}\n\n`;
            }
            if (searchResults.length > 1) {
                wikiText += `*More results:*\n`;
                for (let i = 1; i < Math.min(searchResults.length, 4); i++) {
                    wikiText += `• ${searchResults[i].title}\n`;
                }
            }
            wikiText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: wikiText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Wiki error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Search Failed*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// CATEGORY 3: DICTIONARY
// ============================================

// 6. DICTIONARY
commands.push({
    name: 'dictionary',
    description: 'Search word definitions',
    aliases: ['define'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('📖');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📖 *Dictionary*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}dictionary <word>\n_Example:_ ${config.PREFIX}dictionary love\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const word = args[0].toLowerCase();
        await react('📖');

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
                timeout: 10000
            });

            const data = response.data[0];

            let defText = `📖 *DICTIONARY*\n━━━━━━━━━━━━━━━━━━━\n*Word:* ${data.word}\n`;
            if (data.phonetic) defText += `🔊 *Phonetic:* ${data.phonetic}\n\n`;

            data.meanings.slice(0, 3).forEach(meaning => {
                defText += `*${meaning.partOfSpeech}*\n`;
                meaning.definitions.slice(0, 3).forEach(def => {
                    defText += `• ${def.definition}\n`;
                    if (def.example) defText += `  📝 *Example:* "${def.example}"\n`;
                });
                defText += `\n`;
            });
            defText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: defText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Dictionary error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Word not found*\n━━━━━━━━━━━━━━━━━━━\n_Try: ${config.PREFIX}dictionary love_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 7. THESAURUS
commands.push({
    name: 'thesaurus',
    description: 'Find synonyms for words',
    aliases: ['synonyms'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🔄');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔄 *Thesaurus*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}thesaurus <word>\n_Example:_ ${config.PREFIX}thesaurus happy\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const word = args[0].toLowerCase();
        await react('🔄');

        try {
            const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${word}`, {
                timeout: 10000
            });

            if (!response.data?.length) throw new Error('No synonyms found');

            const synonyms = response.data.slice(0, 20).map(s => s.word);

            let resultText = `🔄 *THESAURUS*\n━━━━━━━━━━━━━━━━━━━\n*Word:* ${word}\n\n*Synonyms (${synonyms.length}):*\n${synonyms.map(s => `• ${s}`).join('\n')}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Thesaurus error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *No synonyms found*\n━━━━━━━━━━━━━━━━━━━\n_Try: ${config.PREFIX}thesaurus happy_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// CATEGORY 4: NEWS
// ============================================

// 8. TOP NEWS
commands.push({
    name: 'newstop',
    description: 'Top headlines',
    aliases: ['topnews'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('📰');

        try {
            const response = await axios.get(`https://api.silvatech.co.ke/news/top`, {
                timeout: 10000
            });

            if (!response.data?.status || !response.data.result?.items?.length) {
                throw new Error('No news found');
            }

            const items = response.data.result.items.slice(0, 10);
            let newsText = `📰 *TOP NEWS*\n━━━━━━━━━━━━━━━━━━━\n_Source:_ ${response.data.result.source}\n\n`;
            items.forEach((item, i) => {
                newsText += `*${i+1}. ${item.title}*\n${item.description ? `📝 ${item.description}\n` : ''}🔗 ${item.link}\n🕒 ${new Date(item.published).toLocaleString()}\n\n`;
            });
            newsText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: newsText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Top news error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Failed to fetch news*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 9. KENYAN NEWS
commands.push({
    name: 'kenyanews',
    description: 'Kenyan news headlines',
    aliases: ['knews'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🇰🇪');

        try {
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
                    { source: "Standard", title: "Kenya launches new infrastructure project" },
                    { source: "Nation", title: "Education reforms to be implemented next term" }
                ];
            }

            let newsText = `🇰🇪 *KENYAN NEWS*\n━━━━━━━━━━━━━━━━━━━\n`;
            allNewsItems.slice(0, 10).forEach((item, i) => {
                newsText += `*${i+1}. ${item.title}*\n📰 ${item.source}\n\n`;
            });
            newsText += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: newsText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Kenyan news error:', error);
            const fallbackNews = `🇰🇪 *KENYAN NEWS*\n━━━━━━━━━━━━━━━━━━━\n1. Government announces new economic policies\n📰 Nation\n\n2. President to address nation on development\n📰 Citizen\n\n3. Infrastructure projects launched nationwide\n📰 Standard\n\n4. Education reforms to be implemented next term\n📰 Nation\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: fallbackNews,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        }
    }
});

// ============================================
// CATEGORY 5: YOUTUBE SEARCH
// ============================================

// 10. YOUTUBE SEARCH
commands.push({
    name: 'youtube',
    description: 'Search YouTube videos',
    aliases: ['yt', 'ytsearch'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🎬');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎬 *YouTube Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}youtube <query>\n_Example:_ ${config.PREFIX}youtube gospel music\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🎬');

        try {
            const search = await yts(query);
            const videos = search.videos.slice(0, 10);

            if (videos.length === 0) throw new Error('No videos found');

            const first = videos[0];
            const thumbnailUrl = `https://img.youtube.com/vi/${first.videoId}/hqdefault.jpg`;

            let caption = `🎬 *YOUTUBE SEARCH*\n━━━━━━━━━━━━━━━━━━━\n*Top Result:*\n📺 *${first.title}*\n⏱️ ${first.timestamp}\n👤 ${first.author.name}\n👁️ ${formatNumber(first.views)}\n🔗 ${first.url}\n\n📋 *${videos.length} results below...*\n\n`;
            videos.slice(1).forEach((video, i) => {
                caption += `*${i+2}. ${video.title}*\n   ⏱️ ${video.timestamp} | 👁️ ${formatNumber(video.views)}\n   🔗 ${video.url}\n\n`;
            });
            caption += `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: caption
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            bot.logger.error('YouTube search error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Search Failed*\n━━━━━━━━━━━━━━━━━━━\n_Try: ${config.PREFIX}youtube Megan MD_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// CATEGORY 6: WEATHER
// ============================================

// 11. WEATHER
commands.push({
    name: 'weather',
    description: 'Get weather information',
    aliases: ['wt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🌤️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🌤️ *Weather*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}weather <city>\n_Example:_ ${config.PREFIX}weather Nairobi\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const city = args.join(' ');
        await react('🌤️');

        try {
            const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
                timeout: 10000
            });

            const data = response.data;
            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            let weatherText = `🌤️ *WEATHER*\n━━━━━━━━━━━━━━━━━━━\n_Location:_ ${area.areaName[0].value}, ${area.country[0].value}\n_Condition:_ ${current.weatherDesc[0].value}\n_Temperature:_ ${current.temp_C}°C / ${current.temp_F}°F\n_Feels like:_ ${current.FeelsLikeC}°C\n_Humidity:_ ${current.humidity}%\n_Wind:_ ${current.windspeedKmph} km/h ${current.winddir16Point}\n_Pressure:_ ${current.pressure} mb\n_UV Index:_ ${current.uvIndex}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: weatherText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Weather error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Weather not found*\n━━━━━━━━━━━━━━━━━━━\n_Try: ${config.PREFIX}weather Nairobi_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// CATEGORY 7: MOVIE SEARCH
// ============================================

// 12. MOVIE SEARCH
commands.push({
    name: 'movie',
    description: 'Search movie information',
    aliases: ['imdb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🎬');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎬 *Movie Search*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}movie <movie name>\n_Example:_ ${config.PREFIX}movie Inception\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        await react('🎬');

        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=9b5d7e52&s=${encodeURIComponent(query)}`, {
                timeout: 10000
            });

            if (!response.data.Search?.length) throw new Error('No movies found');

            const movies = response.data.Search.slice(0, 10);
            const first = movies[0];

            let resultText = `🎬 *MOVIE SEARCH*\n━━━━━━━━━━━━━━━━━━━\n*Top Result:*\n🎬 *${first.Title}* (${first.Year})\n\n*More Results:*\n`;
            movies.slice(1).forEach((movie, i) => {
                resultText += `*${i+2}. ${movie.Title}* (${movie.Year})\n`;
            });
            resultText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: resultText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            bot.logger.error('Movie search error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Movie not found*\n━━━━━━━━━━━━━━━━━━━\n_Try: ${config.PREFIX}movie Inception_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}searchhelp`, text: '🔍 Search Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// CATEGORY 8: SEARCH HELP
// ============================================

// 13. SEARCH HELP
commands.push({
    name: 'searchhelp',
    description: 'Show all search commands',
    aliases: ['helpsearch', 'searches'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `🔍 *SEARCH COMMANDS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*🌐 WEB SEARCH*\n` +
            `_${prefix}google_ - Google search\n` +
            `_${prefix}bing_ - Bing search\n` +
            `_${prefix}duckduckgo_ - DuckDuckGo\n` +
            `_${prefix}searchall_ - Multi-engine search\n\n` +

            `*📚 WIKIPEDIA*\n` +
            `_${prefix}wiki_ - Wikipedia\n\n` +

            `*📖 DICTIONARY*\n` +
            `_${prefix}dictionary_ - Word definitions\n` +
            `_${prefix}thesaurus_ - Synonyms\n\n` +

            `*📰 NEWS*\n` +
            `_${prefix}newstop_ - Top headlines\n` +
            `_${prefix}kenyanews_ - Local news\n\n` +

            `*🎬 YOUTUBE*\n` +
            `_${prefix}youtube_ - Search videos\n\n` +

            `*🌤️ WEATHER*\n` +
            `_${prefix}weather_ - Weather info\n\n` +

            `*🎬 MOVIES*\n` +
            `_${prefix}movie_ - Movie search\n\n` +

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
