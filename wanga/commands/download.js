const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');

const commands = [];

// API Configuration
const API_BASE = 'https://api-aswin-sparky.koyeb.app/api/downloader';
const API_ENDPOINTS = {
    song: (url) => `${API_BASE}/song?search=${encodeURIComponent(url)}`,
    ytv: (url) => `${API_BASE}/ytv?url=${encodeURIComponent(url)}`,
    spotify: (url) => `${API_BASE}/spotify?url=${encodeURIComponent(url)}`,
    tiktok: (url) => `${API_BASE}/tiktok?url=${encodeURIComponent(url)}`,
};

// Temp directory
const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

// Helper functions
async function searchYoutube(query, limit = 10) {
    try {
        const search = await yts(query);
        return search.videos.slice(0, limit);
    } catch (error) {
        return [];
    }
}

async function downloadFile(url, filename) {
    const filePath = path.join(TEMP_DIR, filename);
    
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 300000
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}

function cleanFilename(filename) {
    return filename.replace(/[^\w\s.-]/gi, '').substring(0, 50);
}

function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

function getThumbnailUrl(videoId, quality = 'medium') {
    const qualities = {
        'default': 'default.jpg',
        'medium': 'mqdefault.jpg',
        'high': 'hqdefault.jpg',
        'standard': 'sddefault.jpg',
        'maxres': 'maxresdefault.jpg'
    };
    return `https://img.youtube.com/vi/${videoId}/${qualities[quality] || qualities.medium}`;
}

function formatNumber(num) {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ==================== PLAY COMMAND (AUDIO MESSAGE - NOT VOICENOTE) ====================
commands.push({
    name: 'play',
    description: 'Search and download song as audio message',
    aliases: ['song'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎵 *Usage:* ${config.PREFIX}play <song name>\nExample: ${config.PREFIX}play nandy asante\n\n*Returns:* Audio message (music)`);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        await react('🎵');
        
        try {
            await reply(`🔍 *Searching:* "${query}"...`);

            const videos = await searchYoutube(query, 5);
            if (videos.length === 0) {
                await react('❌');
                return reply('❌ No results found.');
            }

            const video = videos[0];
            const videoId = video.videoId;
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            const views = formatNumber(video.views);
            const author = video.author?.name || 'Unknown';
            
            // Send thumbnail with search result
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const searchCaption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                                 `┃ *${config.BOT_NAME}*\n` +
                                 `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `🎵 *SONG FOUND*\n\n` +
                                 `📀 *Title:* ${title}\n` +
                                 `⏱️ *Duration:* ${duration}\n` +
                                 `👤 *Channel:* ${author}\n` +
                                 `👁️ *Views:* ${views}\n` +
                                 `🔗 *URL:* ${video.url}\n\n` +
                                 `⬇️ *Downloading audio...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: searchCaption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.song(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No audio link');

            const { url: downloadURL } = response.data.data;
            const filename = `audio_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            
            // Send as AUDIO message (ptt: false = music, NOT voice note)
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false, // CRITICAL: false = audio message, true = voice note
                fileName: cleanFilename(title) + '.mp3'
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('Play error:', error);
            await react('❌');
            await reply(`❌ Download failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== MUSIC COMMAND (VOICE NOTE - PTT) ====================
commands.push({
    name: 'music',
    description: 'Search and download song as voice note (PTT)',
    aliases: ['voicenote', 'vn'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎤 *Usage:* ${config.PREFIX}music <song name>\nExample: ${config.PREFIX}music nandy asante\n\n*Returns:* Voice note (PTT) - shorter format`);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        await react('🎤');
        
        try {
            await reply(`🔍 *Searching:* "${query}"...`);

            const videos = await searchYoutube(query, 5);
            if (videos.length === 0) {
                await react('❌');
                return reply('❌ No results found.');
            }

            const video = videos[0];
            const videoId = video.videoId;
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            const views = formatNumber(video.views);
            const author = video.author?.name || 'Unknown';
            
            // Send thumbnail with search result
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const searchCaption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                                 `┃ *${config.BOT_NAME}*\n` +
                                 `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `🎤 *VOICE NOTE*\n\n` +
                                 `📀 *Title:* ${title}\n` +
                                 `⏱️ *Duration:* ${duration}\n` +
                                 `👤 *Channel:* ${author}\n` +
                                 `👁️ *Views:* ${views}\n` +
                                 `🔗 *URL:* ${video.url}\n\n` +
                                 `⬇️ *Downloading as voice note...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: searchCaption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.song(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No audio link');

            const { url: downloadURL } = response.data.data;
            const filename = `vn_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            
            // Send as VOICE NOTE (ptt: true)
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/ogg; codecs=opus', // Voice notes use OGG
                ptt: true, // CRITICAL: true = voice note
                fileName: cleanFilename(title) + '.ogg'
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('Music error:', error);
            await react('❌');
            await reply(`❌ Download failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== MP3 COMMAND (Document) ====================
commands.push({
    name: 'mp3',
    description: 'Search and download song as MP3 document',
    aliases: ['songdoc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`📁 *Usage:* ${config.PREFIX}mp3 <song name>\nExample: ${config.PREFIX}mp3 nandy asante\n\n*Returns:* MP3 document file`);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        await react('📁');
        
        try {
            await reply(`🔍 *Searching:* "${query}"...`);

            const videos = await searchYoutube(query, 5);
            if (videos.length === 0) {
                await react('❌');
                return reply('❌ No results found.');
            }

            const video = videos[0];
            const videoId = video.videoId;
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            const views = formatNumber(video.views);
            const author = video.author?.name || 'Unknown';
            
            // Send thumbnail with search result
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const searchCaption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                                 `┃ *${config.BOT_NAME}*\n` +
                                 `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `📁 *MP3 DOCUMENT*\n\n` +
                                 `📀 *Title:* ${title}\n` +
                                 `⏱️ *Duration:* ${duration}\n` +
                                 `👤 *Channel:* ${author}\n` +
                                 `👁️ *Views:* ${views}\n` +
                                 `🔗 *URL:* ${video.url}\n\n` +
                                 `⬇️ *Downloading MP3 document...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: searchCaption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.song(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No audio link');

            const { url: downloadURL } = response.data.data;
            const filename = `mp3doc_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            const stats = await fs.stat(tempFile);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            // Send as DOCUMENT
            await sock.sendMessage(from, {
                document: buffer,
                fileName: cleanFilename(title) + '.mp3',
                mimetype: 'audio/mpeg',
                caption: `📁 *MP3 Document*\n🎵 ${title}\n⏰ ${duration}\n💾 ${fileSizeMB} MB\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('MP3 error:', error);
            await react('❌');
            await reply(`❌ Download failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== YTS COMMAND (with thumbnails) ====================
commands.push({
    name: 'yts',
    description: 'Search YouTube videos',
    aliases: ['ytsearch', 'search'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🔍 *Usage:* ${config.PREFIX}yts <search query>\nExample: ${config.PREFIX}yts gospel music`);
        }

        const query = args.join(' ');
        
        await react('🔍');
        
        try {
            const videos = await searchYoutube(query, 10);
            if (videos.length === 0) {
                await react('❌');
                return reply('❌ No results found.');
            }

            // Send first result with thumbnail
            const firstVideo = videos[0];
            const firstThumb = getThumbnailUrl(firstVideo.videoId, 'high');
            const firstCaption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                                `┃ *${config.BOT_NAME}*\n` +
                                `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                `🎥 *TOP RESULT*\n\n` +
                                `📺 *${firstVideo.title}*\n` +
                                `⏱️ *Duration:* ${firstVideo.timestamp || firstVideo.duration}\n` +
                                `👤 *Channel:* ${firstVideo.author?.name || 'Unknown'}\n` +
                                `👁️ *Views:* ${formatNumber(firstVideo.views)}\n` +
                                `🔗 *URL:* ${firstVideo.url}\n\n` +
                                `📋 *More results below...*`;

            await sock.sendMessage(from, {
                image: { url: firstThumb },
                caption: firstCaption
            }, { quoted: msg });

            // Send list of all results
            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                            `┃ *${config.BOT_NAME}*\n` +
                            `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                            `📺 *YouTube Search Results*\n` +
                            `🔍 *Query:* "${query}"\n` +
                            `📊 *Found:* ${videos.length} videos\n\n`;

            videos.forEach((video, i) => {
                resultText += `*${i+1}.* ${video.title.substring(0, 50)}\n`;
                resultText += `   ├─ ⏱️ ${video.timestamp || video.duration}\n`;
                resultText += `   ├─ 👁️ ${formatNumber(video.views)}\n`;
                resultText += `   ├─ 👤 ${video.author?.name || 'Unknown'}\n`;
                resultText += `   └─ 🔗 ${video.url}\n\n`;
            });

            resultText += `━━━━━━━━━━━━━━━━━━━\n`;
            resultText += `📥 *Download Options:*\n`;
            resultText += `• Reply with number 1-${videos.length}\n`;
            resultText += `• Or use URL with ${config.PREFIX}ytmp3/ytmp4\n\n`;
            resultText += `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTS error:', error);
            await react('❌');
            await reply('❌ Search failed.');
        }
    }
});

// ==================== YTV COMMAND ====================
commands.push({
    name: 'ytv',
    description: 'Download YouTube video',
    aliases: ['ytvideo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎬 *Usage:* ${config.PREFIX}ytv <video name>\nExample: ${config.PREFIX}ytv funny cats`);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        await react('🎬');
        
        try {
            const videos = await searchYoutube(query, 1);
            if (videos.length === 0) {
                await react('❌');
                return reply('❌ No videos found.');
            }

            const video = videos[0];
            const videoId = video.videoId;
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            const views = formatNumber(video.views);
            const author = video.author?.name || 'Unknown';
            
            // Send thumbnail
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const searchCaption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                                 `┃ *${config.BOT_NAME}*\n` +
                                 `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                                 `🎬 *VIDEO FOUND*\n\n` +
                                 `📹 *Title:* ${title}\n` +
                                 `⏱️ *Duration:* ${duration}\n` +
                                 `👤 *Channel:* ${author}\n` +
                                 `👁️ *Views:* ${views}\n` +
                                 `🔗 *URL:* ${video.url}\n\n` +
                                 `⬇️ *Downloading video...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: searchCaption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.ytv(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No video link');

            const { url: downloadURL } = response.data.data;
            const filename = `video_${Date.now()}.mp4`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            const stats = await fs.stat(tempFile);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            if (parseFloat(fileSizeMB) > 50) {
                await sock.sendMessage(from, {
                    document: buffer,
                    fileName: cleanFilename(title) + '.mp4',
                    mimetype: 'video/mp4',
                    caption: `🎬 *Large Video*\n📹 ${title}\n💾 ${fileSizeMB} MB\n🔗 ${video.url}\n\n> created by wanga`
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, {
                    video: buffer,
                    caption: `🎬 ${title}\n⏰ ${duration}\n🔗 ${video.url}\n\n> created by wanga`
                }, { quoted: msg });
            }

            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTV error:', error);
            await react('❌');
            await reply(`❌ Download failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== YTMP3 COMMAND ====================
commands.push({
    name: 'ytmp3',
    description: 'Convert YouTube URL to audio',
    aliases: ['ytaudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎵 *Usage:* ${config.PREFIX}ytmp3 <YouTube URL>\nExample: ${config.PREFIX}ytmp3 https://youtube.com/watch?v=...`);
        }

        const url = args[0];
        let tempFile = null;
        
        await react('🎵');
        
        try {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                await react('❌');
                return reply('❌ Invalid YouTube URL.');
            }

            const videoId = extractVideoId(url);
            if (!videoId) throw new Error('Invalid video ID');

            const videoInfo = await yts({ videoId });
            if (!videoInfo.videos || videoInfo.videos.length === 0) {
                throw new Error('Video not found');
            }

            const video = videoInfo.videos[0];
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            
            // Send thumbnail
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const caption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                           `┃ *${config.BOT_NAME}*\n` +
                           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                           `🎵 *YouTube Audio*\n\n` +
                           `📀 *Title:* ${title}\n` +
                           `⏱️ *Duration:* ${duration}\n` +
                           `🔗 *URL:* ${url}\n\n` +
                           `⬇️ *Downloading audio...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: caption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.song(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No audio link');

            const { url: downloadURL } = response.data.data;
            const filename = `ytmp3_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            
            // Send as AUDIO message (ptt: false = music, not voice note)
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: cleanFilename(title) + '.mp3'
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTMP3 error:', error);
            await react('❌');
            await reply(`❌ Conversion failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== YTMP4 COMMAND ====================
commands.push({
    name: 'ytmp4',
    description: 'Convert YouTube URL to video',
    aliases: ['ytvideo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎬 *Usage:* ${config.PREFIX}ytmp4 <YouTube URL>\nExample: ${config.PREFIX}ytmp4 https://youtube.com/watch?v=...`);
        }

        const url = args[0];
        let tempFile = null;
        
        await react('🎬');
        
        try {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                await react('❌');
                return reply('❌ Invalid YouTube URL.');
            }

            const videoId = extractVideoId(url);
            if (!videoId) throw new Error('Invalid video ID');

            const videoInfo = await yts({ videoId });
            if (!videoInfo.videos || videoInfo.videos.length === 0) {
                throw new Error('Video not found');
            }

            const video = videoInfo.videos[0];
            const title = video.title;
            const duration = video.timestamp || video.duration || 'Unknown';
            
            // Send thumbnail
            const thumbnailUrl = getThumbnailUrl(videoId, 'high');
            const caption = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                           `┃ *${config.BOT_NAME}*\n` +
                           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                           `🎬 *YouTube Video*\n\n` +
                           `📹 *Title:* ${title}\n` +
                           `⏱️ *Duration:* ${duration}\n` +
                           `🔗 *URL:* ${url}\n\n` +
                           `⬇️ *Downloading video...*`;

            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: caption
            }, { quoted: msg });

            const apiUrl = API_ENDPOINTS.ytv(video.url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('No video link');

            const { url: downloadURL } = response.data.data;
            const filename = `ytmp4_${Date.now()}.mp4`;
            tempFile = await downloadFile(downloadURL, filename);

            const buffer = await fs.readFile(tempFile);
            const stats = await fs.stat(tempFile);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            if (parseFloat(fileSizeMB) > 50) {
                await sock.sendMessage(from, {
                    document: buffer,
                    fileName: cleanFilename(title) + '.mp4',
                    mimetype: 'video/mp4',
                    caption: `🎬 *Large Video*\n📹 ${title}\n💾 ${fileSizeMB} MB\n🔗 ${url}\n\n> created by wanga`
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, {
                    video: buffer,
                    caption: `🎬 ${title}\n⏰ ${duration}\n🔗 ${url}\n\n> created by wanga`
                }, { quoted: msg });
            }

            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTMP4 error:', error);
            await react('❌');
            await reply(`❌ Conversion failed: ${error.message}`);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) {
                await fs.unlink(tempFile).catch(() => {});
            }
        }
    }
});

// ==================== SPOTIFY COMMAND ====================
commands.push({
    name: 'spotify',
    description: 'Download from Spotify',
    aliases: ['spoti'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`🎵 *Usage:* ${config.PREFIX}spotify <Spotify URL>\nExample: ${config.PREFIX}spotify https://open.spotify.com/track/...`);
        }

        const url = args[0];
        
        await react('🎵');
        
        try {
            await reply('⬇️ *Downloading from Spotify...*');

            const apiUrl = API_ENDPOINTS.spotify(url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('Download failed');

            const { title, artist, thumbnail, download } = response.data.data;

            // Send thumbnail if available
            if (thumbnail) {
                await sock.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: `🎵 *Spotify Track Found*\n\n📀 ${title}\n👤 ${artist || 'Unknown'}\n\n⬇️ Downloading...`
                }, { quoted: msg });
            }

            const fileResponse = await axios.get(download, {
                responseType: 'arraybuffer',
                timeout: 120000
            });

            const buffer = Buffer.from(fileResponse.data);

            await sock.sendMessage(from, {
                document: buffer,
                fileName: `${cleanFilename(title)}.mp3`,
                mimetype: 'audio/mpeg',
                caption: `🎵 *Spotify Track*\n📀 ${title}\n👤 ${artist || 'Unknown'}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('Spotify error:', error);
            await react('❌');
            await reply('❌ Spotify download failed. Check URL.');
        }
    }
});

// ==================== TIKTOK COMMAND ====================
commands.push({
    name: 'tiktok',
    description: 'Download from TikTok',
    aliases: ['tt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`📱 *Usage:* ${config.PREFIX}tiktok <TikTok URL>\nExample: ${config.PREFIX}tiktok https://vt.tiktok.com/...`);
        }

        const url = args[0];
        
        await react('📱');
        
        try {
            await reply('⬇️ *Downloading from TikTok...*');

            const apiUrl = API_ENDPOINTS.tiktok(url);
            const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });

            if (!response.data?.status) throw new Error('Download failed');

            const { title, author, video, thumbnail } = response.data.data;
            const authorName = author?.nickname || 'Unknown';

            // Send thumbnail if available
            if (thumbnail) {
                await sock.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: `📱 *TikTok Video Found*\n\n📝 ${title || 'No caption'}\n👤 ${authorName}\n\n⬇️ Downloading...`
                }, { quoted: msg });
            }

            const videoResponse = await axios.get(video, {
                responseType: 'arraybuffer',
                timeout: 120000
            });

            const buffer = Buffer.from(videoResponse.data);

            await sock.sendMessage(from, {
                video: buffer,
                caption: `📱 *TikTok Video*\n📝 ${title || 'No caption'}\n👤 ${authorName}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
            
        } catch (error) {
            bot.logger.error('TikTok error:', error);
            await react('❌');
            await reply('❌ TikTok download failed. Check URL.');
        }
    }
});

// ==================== DL COMMAND ====================
commands.push({
    name: 'dl',
    description: 'Download from any platform (auto-detect)',
    aliases: ['download'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            await react('ℹ️');
            return reply(`📥 *Usage:* ${config.PREFIX}dl <URL>\nExample: ${config.PREFIX}dl https://youtube.com/...`);
        }

        const url = args[0];

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            await react('🎵');
            await reply(`🎵 *YouTube Detected*\n\nUse:\n• ${config.PREFIX}ytmp3 ${url} (audio)\n• ${config.PREFIX}ytmp4 ${url} (video)`);
                
        } else if (url.includes('spotify.com')) {
            await commands.find(c => c.name === 'spotify').execute({ msg, from, sender, args: [url], bot, sock, react, reply });
            
        } else if (url.includes('tiktok.com')) {
            await commands.find(c => c.name === 'tiktok').execute({ msg, from, sender, args: [url], bot, sock, react, reply });
            
        } else {
            await react('❌');
            await reply('❌ Platform not recognized.\nSupported: YouTube, Spotify, TikTok');
        }
    }
});

// ==================== CLEANUP COMMAND ====================
commands.push({
    name: 'cleanup',
    description: 'Clean temporary files',
    aliases: ['cleantemp'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        await react('🧹');
        
        try {
            const files = await fs.readdir(TEMP_DIR);
            let deleted = 0;
            let totalSize = 0;

            for (const file of files) {
                try {
                    const filePath = path.join(TEMP_DIR, file);
                    const stats = await fs.stat(filePath);
                    totalSize += stats.size;
                    await fs.unlink(filePath);
                    deleted++;
                } catch (e) {}
            }

            const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
            
            await reply(`🧹 *Cleanup Complete*\n\n🗑️ Deleted: ${deleted} files\n💾 Freed: ${totalMB} MB`);
            
            await react('✅');
            
        } catch (error) {
            await react('✅');
            await reply('Temp directory is already clean.');
        }
    }
});

module.exports = { commands };