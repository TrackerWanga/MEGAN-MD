const axios = require('axios');

const cheerio = require('cheerio');

const config = require('../../megan/config');

const commands = [];

// ==================== GOOGLE SEARCH (via DuckDuckGo) ====================

commands.push({

    name: 'google',

    description: 'Search Google via DuckDuckGo (no API key)',

    aliases: ['g', 'search'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            if (!args.length) {

                await react('🔍');

                return reply(`🔍 *GOOGLE SEARCH*\n\n*Usage:* ${config.PREFIX}google <query>\n*Example:* ${config.PREFIX}google Megan MD bot\n\n*Powered by DuckDuckGo*`);

            }

            const query = args.join(' ');

            await react('🔍');

            

            await reply(`🔍 *Searching for:* "${query}"`);

            const response = await axios.get('https://html.duckduckgo.com/html', {

                params: { q: query },

                headers: {

                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

                },

                timeout: 10000

            });

            const $ = cheerio.load(response.data);

            const results = [];

            $('.result').each((i, el) => {

                if (i < 5) {

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

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `🔍 *GOOGLE SEARCH RESULTS*\n\n`;

            resultText += `*Query:* "${query}"\n`;

            resultText += `━━━━━━━━━━━━━━━━━━━\n\n`;

            results.forEach((r, i) => {

                resultText += `*${i+1}. ${r.title}*\n`;

                resultText += `📎 ${r.url}\n`;

                if (r.snippet) resultText += `📝 ${r.snippet}\n`;

                resultText += `\n`;

            });

            resultText += `━━━━━━━━━━━━━━━━━━━\n`;

            resultText += `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Google search error:', error);

            await react('❌');

            await reply(`❌ Search failed.\n\nTry: ${config.PREFIX}google Megan MD`);

        }

    }

});

// ==================== WIKIPEDIA SEARCH ====================

commands.push({

    name: 'wikipedia',

    description: 'Search Wikipedia articles',

    aliases: ['wiki', 'pedia'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            if (!args.length) {

                await react('📚');

                return reply(`📚 *WIKIPEDIA SEARCH*\n\n*Usage:* ${config.PREFIX}wikipedia <topic>\n*Example:* ${config.PREFIX}wikipedia Artificial Intelligence\n\n*Powered by Wikipedia API*`);

            }

            const query = args.join(' ');

            await react('📚');

            

            await reply(`📚 *Searching Wikipedia for:* "${query}"`);

            const searchResponse = await axios.get('https://en.wikipedia.org/w/api.php', {

                params: {

                    action: 'query',

                    list: 'search',

                    srsearch: query,

                    format: 'json',

                    srlimit: 3

                }

            });

            const searchResults = searchResponse.data.query.search;

            if (!searchResults || searchResults.length === 0) {

                throw new Error('No Wikipedia articles found');

            }

            const pageTitle = searchResults[0].title;

            const summaryResponse = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(pageTitle));

            const data = summaryResponse.data;

            let wikiText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            wikiText += `📚 *WIKIPEDIA*\n\n`;

            wikiText += `*${data.title}*\n\n`;

            wikiText += `${data.extract}\n\n`;

            if (data.content_urls?.desktop?.page) {

                wikiText += `🔗 Read more: ${data.content_urls.desktop.page}\n\n`;

            }

            wikiText += `━━━━━━━━━━━━━━━━━━━\n`;

            wikiText += `*More results:*\n`;

            for (let i = 1; i < Math.min(searchResults.length, 3); i++) {

                wikiText += `• ${searchResults[i].title}\n`;

            }

            wikiText += `\n> created by wanga`;

            await sock.sendMessage(from, { text: wikiText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Wikipedia error:', error);

            await react('❌');

            await reply(`❌ Wikipedia search failed.\n\nTry: ${config.PREFIX}wikipedia Kenya`);

        }

    }

});

// ==================== BRAVE SEARCH ====================

commands.push({

    name: 'brave',

    description: 'Search Brave Search',

    aliases: ['bravesearch'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            if (!args.length) {

                await react('🦁');

                return reply(`🦁 *BRAVE SEARCH*\n\n*Usage:* ${config.PREFIX}brave <query>\n*Example:* ${config.PREFIX}brave privacy tools\n\n*Powered by Brave Search*`);

            }

            const query = args.join(' ');

            await react('🦁');

            

            await reply(`🦁 *Searching Brave for:* "${query}"`);

            const response = await axios.get('https://search.brave.com/search', {

                params: { q: query },

                headers: {

                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

                },

                timeout: 10000

            });

            const $ = cheerio.load(response.data);

            const results = [];

            $('.snippet').each((i, el) => {

                if (i < 5) {

                    const title = $(el).find('.title').text().trim();

                    const url = $(el).find('.url').text().trim();

                    const desc = $(el).find('.description').text().trim();

                    

                    if (title) {

                        results.push({

                            title,

                            url: url.startsWith('http') ? url : 'https://' + url,

                            description: desc

                        });

                    }

                }

            });

            if (results.length === 0) {

                $('.web-result').each((i, el) => {

                    if (i < 5) {

                        const title = $(el).find('a').first().text().trim();

                        const url = $(el).find('.url').text().trim() || $(el).find('cite').text().trim();

                        const desc = $(el).find('.description').text().trim();

                        

                        if (title) {

                            results.push({

                                title,

                                url,

                                description: desc

                            });

                        }

                    }

                });

            }

            if (results.length === 0) throw new Error('No results found');

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `🦁 *BRAVE SEARCH RESULTS*\n\n`;

            resultText += `*Query:* "${query}"\n`;

            resultText += `━━━━━━━━━━━━━━━━━━━\n\n`;

            results.forEach((r, i) => {

                resultText += `*${i+1}. ${r.title}*\n`;

                resultText += `📎 ${r.url}\n`;

                if (r.description) resultText += `📝 ${r.description}\n`;

                resultText += `\n`;

            });

            resultText += `━━━━━━━━━━━━━━━━━━━\n`;

            resultText += `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Brave search error:', error);

            await react('❌');

            await reply(`❌ Brave search failed.\n\nTry: ${config.PREFIX}brave Megan MD`);

        }

    }

});

// ==================== FIREFOX/BING SEARCH ====================

commands.push({

    name: 'firefox',

    description: 'Search using Firefox/Bing',

    aliases: ['ff', 'bing'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            if (!args.length) {

                await react('🦊');

                return reply(`🦊 *FIREFOX/BING SEARCH*\n\n*Usage:* ${config.PREFIX}firefox <query>\n*Example:* ${config.PREFIX}firefox web development\n\n*Powered by Bing*`);

            }

            const query = args.join(' ');

            await react('🦊');

            

            await reply(`🦊 *Searching with Bing for:* "${query}"`);

            const response = await axios.get('https://www.bing.com/search', {

                params: { q: query },

                headers: {

                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'

                },

                timeout: 10000

            });

            const $ = cheerio.load(response.data);

            const results = [];

            $('#b_results .b_algo').each((i, el) => {

                if (i < 5) {

                    const title = $(el).find('h2').text().trim();

                    const link = $(el).find('h2 a').attr('href');

                    const desc = $(el).find('.b_caption p').text().trim();

                    

                    if (title && link) {

                        results.push({

                            title,

                            url: link,

                            description: desc

                        });

                    }

                }

            });

            if (results.length === 0) throw new Error('No results found');

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `🦊 *FIREFOX/BING SEARCH RESULTS*\n\n`;

            resultText += `*Query:* "${query}"\n`;

            resultText += `━━━━━━━━━━━━━━━━━━━\n\n`;

            results.forEach((r, i) => {

                resultText += `*${i+1}. ${r.title}*\n`;

                resultText += `📎 ${r.url}\n`;

                if (r.description) resultText += `📝 ${r.description}\n`;

                resultText += `\n`;

            });

            resultText += `━━━━━━━━━━━━━━━━━━━\n`;

            resultText += `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Firefox search error:', error);

            await react('❌');

            await reply(`❌ Search failed.\n\nTry: ${config.PREFIX}firefox Megan MD`);

        }

    }

});

// ==================== SEARCH ALL ====================

commands.push({

    name: 'searchall',

    description: 'Search across multiple engines',

    aliases: ['allsearch', 'multisearch'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            if (!args.length) {

                await react('🌐');

                return reply(`🌐 *MULTI-SEARCH*\n\n*Usage:* ${config.PREFIX}searchall <query>\n*Example:* ${config.PREFIX}searchall Megan MD\n\n*Searches: Google, Wikipedia, Brave, Bing*`);

            }

            const query = args.join(' ');

            await react('🌐');

            

            await reply(`🌐 *Searching multiple engines for:* "${query}"\n\nPlease wait...`);

            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

            const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;

            const braveUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;

            const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `🌐 *MULTI-SEARCH RESULTS*\n\n`;

            resultText += `*Query:* "${query}"\n\n`;

            resultText += `🔍 *Google:*\n${googleUrl}\n\n`;

            resultText += `📚 *Wikipedia:*\n${wikiUrl}\n\n`;

            resultText += `🦁 *Brave:*\n${braveUrl}\n\n`;

            resultText += `🦊 *Bing:*\n${bingUrl}\n\n`;

            resultText += `━━━━━━━━━━━━━━━━━━━\n`;

            resultText += `💡 *Open links to see full results*\n\n`;

            resultText += `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Searchall error:', error);

            await react('❌');

            await reply(`❌ Search failed.\n\nTry: ${config.PREFIX}searchall Megan MD`);

        }

    }

});

module.exports = { commands };