const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');
const MediaProcessor = require('../../megan/lib/mediaProcessor');

const commands = [];
const mediaProcessor = new MediaProcessor();

// Helper to download media
async function downloadMedia(msg) {
    const { downloadMediaMessage } = require('gifted-baileys');
    return await downloadMediaMessage(msg, 'buffer', {}, { logger: console });
}

// ==================== STICKER COMMANDS ====================

commands.push({
    name: 'sticker',
    description: 'Create sticker from image/video',
    aliases: ['s', 'stick'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
            
            if (!hasImage && !hasVideo) {
                await react('❌');
                return reply(`🎨 *STICKER MAKER*\n\nUsage: Reply to image/video with ${config.PREFIX}sticker`);
            }
            await react('🎨');
            
            const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const stickerBuffer = await mediaProcessor.createSticker(buffer);
            
            await sock.sendMessage(from, {
                sticker: stickerBuffer
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Sticker error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'toimage',
    description: 'Convert sticker to image',
    aliases: ['img', 'toimg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasSticker = msg.message?.stickerMessage || quoted?.stickerMessage;
            
            if (!hasSticker) {
                await react('❌');
                return reply(`🖼️ *STICKER TO IMAGE*\n\nUsage: Reply to sticker with ${config.PREFIX}toimage`);
            }
            await react('🔄');
            
            const targetMsg = msg.message?.stickerMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const imageBuffer = await mediaProcessor.stickerToImage(buffer);
            
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `✅ Converted to image\n\n> created by wanga`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('ToImage error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== TTS COMMANDS ====================

commands.push({
    name: 'say',
    description: 'Convert text to voice note',
    aliases: ['tts'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            if (!args.length) {
                await react('🗣️');
                return reply(`🗣️ *TEXT TO SPEECH*\n\nUsage: ${config.PREFIX}say <text>\nExample: ${config.PREFIX}say Hello world\nMax: 200 chars`);
            }
            const text = args.join(' ').substring(0, 200);
            
            await react('🗣️');
            
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
            
            const response = await axios({
                method: 'GET',
                url: ttsUrl,
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 30000
            });
            const audioBuffer = Buffer.from(response.data);
            
            const formattedAudio = await mediaProcessor.toAudio(audioBuffer);
            
            await sock.sendMessage(from, {
                audio: formattedAudio,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('TTS error:', error);
            await react('❌');
            await reply(`❌ TTS failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'voice',
    description: 'Convert text to voice note (PTT)',
    aliases: ['vn', 'voicenote'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            if (!args.length) {
                await react('🎤');
                return reply(`🎤 *VOICE NOTE*\n\nUsage: ${config.PREFIX}voice <text>\nExample: ${config.PREFIX}voice Hello world`);
            }
            const text = args.join(' ').substring(0, 200);
            
            await react('🎤');
            
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
            
            const response = await axios({
                method: 'GET',
                url: ttsUrl,
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 30000
            });
            const audioBuffer = Buffer.from(response.data);
            
            const pttBuffer = await mediaProcessor.toPTT(audioBuffer);
            
            await sock.sendMessage(from, {
                audio: pttBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Voice error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== AUDIO PROCESSING ====================

commands.push({
    name: 'toaudio',
    description: 'Extract audio from video',
    aliases: ['mp3', 'extract'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
            
            if (!hasVideo) {
                await react('❌');
                return reply(`🎵 *AUDIO EXTRACTOR*\n\nUsage: Reply to video with ${config.PREFIX}toaudio`);
            }
            await react('🎵');
            
            const targetMsg = msg.message?.videoMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const audioBuffer = await mediaProcessor.extractAudio(buffer);
            
            await sock.sendMessage(from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('ToAudio error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'speed',
    description: 'Change audio speed (0.5x - 2.0x)',
    aliases: ['audiospeed'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const speed = parseFloat(args[0]) || 1.0;
            
            if (speed < 0.5 || speed > 2.0) {
                await react('❌');
                return reply(`⚡ *AUDIO SPEED*\n\nUsage: Reply to audio with ${config.PREFIX}speed <0.5-2.0>\nExample: ${config.PREFIX}speed 1.5`);
            }
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;
            
            if (!hasAudio) {
                await react('❌');
                return reply('❌ Reply to an audio message.');
            }
            await react('⚡');
            
            const targetMsg = msg.message?.audioMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const speedBuffer = await mediaProcessor.changeSpeed(buffer, speed);
            
            await sock.sendMessage(from, {
                audio: speedBuffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Speed error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'vol',
    description: 'Change audio volume (0.5x - 2.0x)',
    aliases: ['volume'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const volume = parseFloat(args[0]) || 1.0;
            
            if (volume < 0.5 || volume > 2.0) {
                await react('❌');
                return reply(`🔊 *AUDIO VOLUME*\n\nUsage: Reply to audio with ${config.PREFIX}vol <0.5-2.0>\nExample: ${config.PREFIX}vol 1.5`);
            }
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;
            
            if (!hasAudio) {
                await react('❌');
                return reply('❌ Reply to an audio message.');
            }
            await react('🔊');
            
            const targetMsg = msg.message?.audioMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const volumeBuffer = await mediaProcessor.changeVolume(buffer, volume);
            
            await sock.sendMessage(from, {
                audio: volumeBuffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Volume error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== IMAGE PROCESSING ====================

commands.push({
    name: 'filter',
    description: 'Apply filter to image',
    aliases: ['filt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const filter = args[0]?.toLowerCase() || 'greyscale';
            const validFilters = ['greyscale', 'grayscale', 'invert', 'sepia', 'brighten', 'darken', 'contrast', 'blur', 'sharpen'];
            
            if (!validFilters.includes(filter)) {
                await react('🎨');
                return reply(`🎨 *FILTERS*\n\nUsage: ${config.PREFIX}filter <type>\nAvailable: ${validFilters.join(', ')}\nExample: ${config.PREFIX}filter sepia`);
            }
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('❌');
                return reply('❌ Reply to an image.');
            }
            await react('🔄');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const filteredBuffer = await mediaProcessor.applyFilter(buffer, filter);
            await sock.sendMessage(from, {
                image: filteredBuffer,
                caption: `✅ ${filter} filter applied\n\n> created by wanga`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Filter error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'circle',
    description: 'Make circular image',
    aliases: ['round'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('⭕');
                return reply(`⭕ *CIRCLE IMAGE*\n\nUsage: Reply to image with ${config.PREFIX}circle`);
            }
            await react('🔄');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const circleBuffer = await mediaProcessor.createCircle(buffer);
            await sock.sendMessage(from, {
                image: circleBuffer,
                caption: `✅ Circular image created\n\n> created by wanga`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Circle error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'removebg',
    description: 'Remove white/light background',
    aliases: ['nobg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('✨');
                return reply(`✨ *REMOVE BACKGROUND*\n\nUsage: Reply to image with ${config.PREFIX}removebg`);
            }
            await react('✨');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const resultBuffer = await mediaProcessor.removeBackground(buffer);
            await sock.sendMessage(from, {
                image: resultBuffer,
                caption: `✅ Background removed\n\n> created by wanga`
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('RemoveBG error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== RELIGIOUS CONTENT ====================

commands.push({
    name: 'bible',
    description: 'Get Bible verses and chapters',
    aliases: ['bibleverse', 'holybible'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args.join(' ');
        try {
            if (!query) {
                await react('📖');
                return reply(`📖 *BIBLE COMMAND*\n\n*Usage:* ${config.PREFIX}bible <verse>\n\n*Examples:*\n• ${config.PREFIX}bible John 3:16\n• ${config.PREFIX}bible Genesis 1\n• ${config.PREFIX}bible Psalm 23:1-3`);
            }
            await react('📖');
            
            const cleanQuery = query.trim().replace(/\s+/g, '+');
            const response = await axios.get(`https://bible-api.com/${cleanQuery}`, { timeout: 10000 });
            const data = response.data;
            
            let bibleText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            bibleText += `📖 *THE HOLY BIBLE*\n\n`;
            bibleText += `✨ *Reference:* ${data.reference}\n`;
            bibleText += `📚 *Translation:* ${data.translation_name}\n`;
            bibleText += `━━━━━━━━━━━━━━━━━━━\n\n`;
            
            const cleanText = data.text.replace(/\n+/g, '\n').trim();
            bibleText += `${cleanText}\n\n`;
            bibleText += `━━━━━━━━━━━━━━━━━━━\n`;
            bibleText += `> created by wanga`;
            
            await sock.sendMessage(from, { text: bibleText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Bible error:', error);
            await react('❌');
            await reply(`❌ Could not fetch Bible verse.\n\nTry: ${config.PREFIX}bible John 3:16`);
        }
    }
});

commands.push({
    name: 'quran',
    description: 'Get Quran surahs and verses',
    aliases: ['surah', 'alquran'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args[0];
        try {
            if (!query) {
                await react('🕌');
                return reply(`🕌 *QURAN COMMANDS*\n\n*Usage:* ${config.PREFIX}quran <surah number>\n\n*Examples:*\n• ${config.PREFIX}quran 1 (Al-Fatihah)\n• ${config.PREFIX}quran 36 (Yasin)\n• Surah numbers: 1-114`);
            }
            
            const surahNumber = parseInt(query);
            if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
                await react('❌');
                return reply('❌ Invalid surah number. Use 1-114');
            }
            
            await react('🕌');
            
            const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/en.asad,ar.alafasy`, { timeout: 10000 });
            
            const surahData = response.data.data;
            const arabicEdition = surahData.find(ed => ed.edition.identifier.includes('ar.alafasy'));
            const englishEdition = surahData.find(ed => ed.edition.identifier.includes('en.asad'));
            
            if (!arabicEdition || !englishEdition) throw new Error('Could not fetch surah');
            
            let quranText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            quranText += `🕌 *THE HOLY QURAN*\n\n`;
            quranText += `✨ *Surah ${arabicEdition.number}: ${arabicEdition.englishName}*\n`;
            quranText += `🌍 *Arabic:* ${arabicEdition.name}\n`;
            quranText += `📖 *Type:* ${arabicEdition.revelationType}\n`;
            quranText += `🔢 *Verses:* ${arabicEdition.ayahs.length}\n`;
            quranText += `━━━━━━━━━━━━━━━━━━━\n\n`;
            
            for (let i = 0; i < Math.min(3, arabicEdition.ayahs.length); i++) {
                quranText += `*${arabicEdition.ayahs[i].numberInSurah}. *`;
                quranText += `${arabicEdition.ayahs[i].text}\n`;
                quranText += `${englishEdition.ayahs[i].text}\n\n`;
            }
            
            if (arabicEdition.ayahs.length > 3) {
                quranText += `... and ${arabicEdition.ayahs.length - 3} more verses\n\n`;
            }
            
            quranText += `> created by wanga`;
            
            await sock.sendMessage(from, { text: quranText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Quran error:', error);
            await react('❌');
            await reply(`❌ Could not fetch surah.\n\nTry: ${config.PREFIX}quran 1`);
        }
    }
});

commands.push({
    name: 'dailyverse',
    description: 'Get daily inspirational verse',
    aliases: ['inspire', 'daily', 'verseoftheday'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('📖');
            
            const bibleVerses = ['John 3:16', 'Psalm 23', 'Philippians 4:13', 'Jeremiah 29:11', 'Romans 8:28', 'Proverbs 3:5-6'];
            const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
            
            const formattedVerse = randomVerse.replace(/\s+/g, '+');
            const response = await axios.get(`https://bible-api.com/${formattedVerse}`, { timeout: 10000 });
            const data = response.data;
            
            const verseText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                            `📖 *DAILY VERSE*\n\n` +
                            `✨ *${data.reference}*\n\n` +
                            `${data.text.trim()}\n\n` +
                            `> created by wanga`;
            
            await sock.sendMessage(from, { text: verseText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('Daily verse error:', error);
            
            const fallbackVerse = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                `📖 *DAILY VERSE*\n\n` +
                                `✨ *John 3:16*\n\n` +
                                `For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.\n\n` +
                                `> created by wanga`;
            
            await sock.sendMessage(from, { text: fallbackVerse }, { quoted: msg });
            await react('✅');
        }
    }
});

// ==================== ENTERTAINMENT ====================

commands.push({
    name: 'movie',
    description: 'Get movie information from IMDb',
    aliases: ['imdb', 'film'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args.join(' ');
        try {
            if (!query) {
                await react('🎬');
                return reply(`🎬 *MOVIE SEARCH*\n\n*Usage:* ${config.PREFIX}movie <movie name>\n\n*Examples:*\n• ${config.PREFIX}movie Inception\n• ${config.PREFIX}movie Avengers`);
            }
            
            await react('🎬');
            
            let movieData = null;
            let posterUrl = null;
            
            // Try OMDb API
            try {
                const omdbResponse = await axios.get(`https://www.omdbapi.com/?apikey=9b5d7e52&t=${encodeURIComponent(query)}&plot=short`, { timeout: 10000 });
                
                if (omdbResponse.data.Response === "True") {
                    movieData = omdbResponse.data;
                    posterUrl = movieData.Poster !== 'N/A' ? movieData.Poster : null;
                }
            } catch (omdbError) {
                console.log('OMDb failed, trying TMDB...');
            }
            
            // If OMDb fails, try TMDB
            if (!movieData) {
                try {
                    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US`, { timeout: 10000 });
                    
                    if (tmdbResponse.data.results && tmdbResponse.data.results.length > 0) {
                        const tmdbMovie = tmdbResponse.data.results[0];
                        
                        const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovie.id}?language=en-US`);
                        const details = detailsResponse.data;
                        
                        movieData = {
                            Title: details.title || tmdbMovie.title,
                            Year: details.release_date ? details.release_date.substring(0, 4) : 'N/A',
                            Runtime: details.runtime ? `${details.runtime} min` : 'N/A',
                            Genre: details.genres ? details.genres.map(g => g.name).join(', ') : 'N/A',
                            Director: 'N/A',
                            Actors: 'N/A',
                            Plot: details.overview || 'No description available',
                            imdbRating: tmdbMovie.vote_average ? `${tmdbMovie.vote_average}/10` : 'N/A',
                            imdbVotes: tmdbMovie.vote_count ? tmdbMovie.vote_count.toLocaleString() : 'N/A'
                        };
                        
                        posterUrl = tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null;
                    }
                } catch (tmdbError) {
                    console.log('TMDB failed:', tmdbError.message);
                }
            }
            
            if (!movieData) throw new Error('Movie not found');
            
            let movieText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            movieText += `🎬 *${movieData.Title.toUpperCase()}*\n\n`;
            movieText += `⭐ *Rating:* ${movieData.imdbRating || 'N/A'}\n`;
            movieText += `📅 *Year:* ${movieData.Year || 'N/A'}\n`;
            if (movieData.Runtime && movieData.Runtime !== 'N/A') movieText += `⏱️ *Runtime:* ${movieData.Runtime}\n`;
            if (movieData.Genre && movieData.Genre !== 'N/A') movieText += `🎭 *Genre:* ${movieData.Genre}\n`;
            if (movieData.Director && movieData.Director !== 'N/A') movieText += `🎬 *Director:* ${movieData.Director}\n`;
            if (movieData.Actors && movieData.Actors !== 'N/A') movieText += `👥 *Cast:* ${movieData.Actors}\n`;
            if (movieData.imdbVotes && movieData.imdbVotes !== 'N/A') movieText += `📊 *Votes:* ${movieData.imdbVotes}\n\n`;
            
            movieText += `📖 *Plot:*\n${movieData.Plot}\n\n`;
            movieText += `> created by wanga`;
            
            if (posterUrl) {
                try {
                    await sock.sendMessage(from, {
                        image: { url: posterUrl },
                        caption: movieText
                    }, { quoted: msg });
                } catch (imgError) {
                    await sock.sendMessage(from, { text: movieText }, { quoted: msg });
                }
            } else {
                await sock.sendMessage(from, { text: movieText }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('Movie error:', error);
            await react('❌');
            await reply(`❌ Movie not found: "${query}"\n\nTry: ${config.PREFIX}movie The Matrix`);
        }
    }
});

commands.push({
    name: 'anime',
    description: 'Get anime information',
    aliases: ['animesearch', 'animeinfo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args.join(' ');
        try {
            if (!query) {
                await react('🎌');
                return reply(`🎌 *ANIME SEARCH*\n\n*Usage:* ${config.PREFIX}anime <anime name>\n\n*Examples:*\n• ${config.PREFIX}anime Naruto\n• ${config.PREFIX}anime Attack on Titan`);
            }
            
            await react('🎌');
            
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`, { timeout: 10000 });
            
            const anime = response.data.data?.[0];
            if (!anime) throw new Error('Anime not found');
            
            let animeText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            animeText += `🎌 *${anime.title}*\n\n`;
            animeText += `⭐ *Score:* ${anime.score || 'N/A'}/10\n`;
            animeText += `📺 *Episodes:* ${anime.episodes || 'Unknown'}\n`;
            animeText += `📅 *Aired:* ${anime.aired?.string || 'Unknown'}\n`;
            animeText += `🎭 *Type:* ${anime.type}\n`;
            animeText += `📊 *Status:* ${anime.status}\n`;
            animeText += `🎭 *Genres:* ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n`;
            animeText += `📖 *Synopsis:*\n${(anime.synopsis || 'No synopsis').substring(0, 300)}...\n\n`;
            animeText += `> created by wanga`;
            
            if (anime.images?.jpg?.large_image_url) {
                try {
                    await sock.sendMessage(from, {
                        image: { url: anime.images.jpg.large_image_url },
                        caption: animeText
                    }, { quoted: msg });
                } catch (imgError) {
                    await sock.sendMessage(from, { text: animeText }, { quoted: msg });
                }
            } else {
                await sock.sendMessage(from, { text: animeText }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('Anime error:', error);
            await react('❌');
            await reply(`❌ Anime not found: "${query}"\n\nTry: ${config.PREFIX}anime Naruto`);
        }
    }
});

commands.push({
    name: 'tv',
    description: 'Get TV show information',
    aliases: ['tvshow', 'tvprogram'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args.join(' ');
        try {
            if (!query) {
                await react('📺');
                return reply(`📺 *TV SHOW SEARCH*\n\n*Usage:* ${config.PREFIX}tv <show name>\n\n*Examples:*\n• ${config.PREFIX}tv Breaking Bad\n• ${config.PREFIX}tv Stranger Things`);
            }
            
            await react('📺');
            
            const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { timeout: 10000 });
            
            const show = response.data[0]?.show;
            if (!show) throw new Error('TV show not found');
            
            let tvText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            tvText += `📺 *${show.name}*\n\n`;
            tvText += `⭐ *Rating:* ${show.rating?.average || 'N/A'}/10\n`;
            tvText += `📅 *Status:* ${show.status}\n`;
            tvText += `🎭 *Genres:* ${show.genres?.join(', ') || 'N/A'}\n`;
            tvText += `📡 *Network:* ${show.network?.name || show.webChannel?.name || 'N/A'}\n`;
            tvText += `📅 *Premiered:* ${show.premiered || 'Unknown'}\n\n`;
            tvText += `📖 *Summary:*\n${(show.summary?.replace(/<[^>]*>/g, '') || 'No summary').substring(0, 300)}...\n\n`;
            tvText += `> created by wanga`;
            
            if (show.image?.medium) {
                try {
                    await sock.sendMessage(from, {
                        image: { url: show.image.medium },
                        caption: tvText
                    }, { quoted: msg });
                } catch (imgError) {
                    await sock.sendMessage(from, { text: tvText }, { quoted: msg });
                }
            } else {
                await sock.sendMessage(from, { text: tvText }, { quoted: msg });
            }
            await react('✅');
        } catch (error) {
            bot.logger.error('TV error:', error);
            await react('❌');
            await reply(`❌ TV show not found: "${query}"\n\nTry: ${config.PREFIX}tv Friends`);
        }
    }
});

// ==================== NEWS ====================

commands.push({
    name: 'news',
    description: 'Get latest news headlines',
    aliases: ['headlines', 'breakingnews'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('📰');
            
            const newsItems = [];
            
            try {
                const bbcResponse = await axios.get('https://feeds.bbci.co.uk/news/world/rss.xml', { timeout: 10000 });
                const bbcXml = bbcResponse.data;
                const itemMatches = bbcXml.match(/<item>[\s\S]*?<\/item>/g);
                
                if (itemMatches) {
                    itemMatches.slice(0, 5).forEach(item => {
                        const titleMatch = item.match(/<title>([^<]+)<\/title>/);
                        const descMatch = item.match(/<description>([^<]+)<\/description>/);
                        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
                        
                        if (titleMatch && titleMatch[1]) {
                            newsItems.push({
                                title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
                                description: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '',
                                url: linkMatch ? linkMatch[1] : ''
                            });
                        }
                    });
                }
            } catch (rssError) {
                console.log('RSS fetch failed');
            }
            
            if (newsItems.length === 0) {
                newsItems.push(
                    { title: 'Tech: New AI developments', description: 'Latest advancements in artificial intelligence' },
                    { title: 'Sports: Championship results', description: 'Major tournament updates' },
                    { title: 'Entertainment: New releases', description: 'Upcoming movies and shows' },
                    { title: 'Business: Market updates', description: 'Global economy news' },
                    { title: 'Health: Wellness tips', description: 'Medical breakthroughs' }
                );
            }
            
            let newsText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            newsText += `📰 *BREAKING NEWS*\n\n`;
            
            newsItems.slice(0, 5).forEach((item, index) => {
                newsText += `*${index + 1}. ${item.title}*\n`;
                if (item.description) newsText += `${item.description.substring(0, 80)}...\n`;
                if (item.url) newsText += `🔗 ${item.url}\n`;
                newsText += `\n`;
            });
            
            newsText += `> created by wanga`;
            
            await sock.sendMessage(from, { text: newsText }, { quoted: msg });
            await react('✅');
        } catch (error) {
            bot.logger.error('News error:', error);
            await react('❌');
            await reply('❌ Could not fetch news. Try again later.');
        }
    }
});

// ==================== CLEANUP ====================

commands.push({
    name: 'cleantemp',
    description: 'Clean temporary files',
    aliases: ['cleantemp'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        await react('🧹');
        const result = await mediaProcessor.cleanup();
        await sock.sendMessage(from, {
            text: `🧹 *Cleanup Complete*\n\n🗑️ Deleted: ${result.deleted} temp files`
        }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };