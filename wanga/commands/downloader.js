// MEGAN-MD Downloader Commands - Simplified 2-Response Flow

const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');

const commands = [];

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';
const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

// Auto-clean temp files every 30 minutes
setInterval(async () => {
    try {
        const files = await fs.readdir(TEMP_DIR);
        let deleted = 0;
        for (const file of files) {
            try {
                await fs.unlink(path.join(TEMP_DIR, file));
                deleted++;
            } catch (e) {}
        }
        if (deleted > 0) console.log(`🧹 Cleaned ${deleted} temp files`);
    } catch (error) {}
}, 30 * 60 * 1000);

// ==================== HELPER FUNCTIONS ====================

// Same button function as basic.js
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

async function downloadFile(url, filename) {
    const filePath = path.join(TEMP_DIR, filename);
    
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 300000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
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

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatNumber(num) {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function getThumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

function extractSpotifyId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

// ==================== PLAY - Main downloader ====================

commands.push({
    name: 'play',
    description: 'Search and download audio',
    aliases: ['song'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '🎵 𝐏𝐋𝐀𝐘',
                text: `_Usage:_ ${config.PREFIX}play <song name>\n_Example:_ ${config.PREFIX}play siski by meja\n\n_🎧 Search and download any song_`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        // Response 1: Searching
        await react('🔍');
        await sendButtonMenu(sock, from, {
            title: '🔍 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆',
            text: `_Query:_ "${query}"\n\n_🎵 Looking for your song..._`,
            footer: '> created by wanga',
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);

        try {
            const search = await yts(query);
            const videos = search.videos.slice(0, 5);
            if (videos.length === 0) throw new Error('No results found');

            const video = videos[0];
            const videoId = video.videoId;
            const title = video.title;
            const duration = video.timestamp || formatDuration(video.duration);
            const channel = video.author?.name || 'Unknown';
            const views = formatNumber(video.views);
            const thumbnailUrl = getThumbnailUrl(videoId);
            
            // Response 2: Song Found - with thumbnail and buttons
            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: `🎵 *𝐒𝐎𝐍𝐆 𝐅𝐎𝐔𝐍𝐃*\n━━━━━━━━━━━━━━━━━━━\n_🎤 Title:_ *${title}*\n_⏱️ Duration:_ ${duration}\n_👤 Channel:_ ${channel}\n_👁️ Views:_ ${views}\n\n_⬇️ Downloading your track..._`
            }, { quoted: msg });

            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            let downloadUrl = null;
            
            // Try XWolf dlmp3
            try {
                const response = await axios.get(`https://apis.xwolf.space/download/dlmp3`, {
                    params: { url: youtubeUrl },
                    timeout: 20000
                });
                if (response.data?.success && response.data?.downloadUrl) {
                    downloadUrl = response.data.downloadUrl;
                }
            } catch (e) {}
            
            // Fallback to XWolf audio
            if (!downloadUrl) {
                try {
                    const response = await axios.get(`https://apis.xwolf.space/download/audio`, {
                        params: { url: youtubeUrl },
                        timeout: 20000
                    });
                    if (response.data?.success && response.data?.downloadUrl) {
                        downloadUrl = response.data.downloadUrl;
                    }
                } catch (e) {}
            }
            
            if (!downloadUrl) throw new Error('Download failed');

            const filename = `play_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadUrl, filename);
            const buffer = await fs.readFile(tempFile);
            const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
            
            // Response 3: File with small caps formatting
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: cleanFilename(title) + '.mp3',
                caption: `🎵 *${title}*\n\n_ᴄʀᴇᴀᴛᴏʀ:_ Wanga\n_sɪᴢᴇ:_ ${fileSizeMB} MB\n\n_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`
            }, { quoted: msg });
            
            // Send buttons after file
            await sendButtonMenu(sock, from, {
                title: '✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄',
                text: `_Enjoy your music!_`,
                footer: '> created by wanga',
                buttons: [
                    { id: `${config.PREFIX}play`, text: '🎵 Another Song' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);

            await react('✅');
            
        } catch (error) {
            bot.logger.error('Play error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃',
                text: `_Try again later._\n\n> created by wanga`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) await fs.unlink(tempFile).catch(() => {});
        }
    }
});

// ==================== YTMP3 - YouTube URL to MP3 ====================

commands.push({
    name: 'ytmp3',
    description: 'Convert YouTube URL to MP3 audio',
    aliases: ['ytaudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '🎵 𝐘𝐓𝐌𝐏𝟑',
                text: `_Usage:_ ${config.PREFIX}ytmp3 <YouTube URL>\n_Example:_ ${config.PREFIX}ytmp3 https://youtu.be/...\n\n_🎧 Convert YouTube to MP3_`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const url = args[0];
        let tempFile = null;
        
        await react('🔗');
        await sendButtonMenu(sock, from, {
            title: '🔗 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆',
            text: `_URL:_ ${url}\n\n_🎵 Converting to MP3..._`,
            footer: '> created by wanga',
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        
        try {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                throw new Error('Invalid YouTube URL');
            }

            const videoId = extractVideoId(url);
            if (!videoId) throw new Error('Invalid video ID');

            const videoInfo = await yts({ videoId });
            const video = videoInfo.videos[0];
            if (!video) throw new Error('Video not found');
            
            const title = video.title;
            const duration = video.timestamp || formatDuration(video.duration);
            const channel = video.author?.name || 'Unknown';
            const thumbnailUrl = getThumbnailUrl(videoId);
            
            // Response: Video Found
            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: `🎵 *𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐔𝐍𝐃*\n━━━━━━━━━━━━━━━━━━━\n_🎤 Title:_ *${title}*\n_⏱️ Duration:_ ${duration}\n_👤 Channel:_ ${channel}\n\n_⬇️ Converting to MP3..._`
            }, { quoted: msg });

            const downloadUrls = [
                `https://apis.xwolf.space/download/ytmp3?url=${encodeURIComponent(url)}`,
                `https://apis.xwolf.space/download/audio?url=${encodeURIComponent(url)}`,
                `https://apis.xwolf.space/download/dlmp3?url=${encodeURIComponent(url)}`
            ];

            let downloadUrl = null;
            for (const endpoint of downloadUrls) {
                try {
                    const response = await axios.get(endpoint, { timeout: 30000 });
                    if (response.data?.success && response.data?.downloadUrl) {
                        downloadUrl = response.data.downloadUrl;
                        break;
                    }
                } catch (e) {}
            }
            
            if (!downloadUrl) throw new Error('Download failed');

            const filename = `ytmp3_${Date.now()}.mp3`;
            tempFile = await downloadFile(downloadUrl, filename);
            const buffer = await fs.readFile(tempFile);
            const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
            
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: cleanFilename(title) + '.mp3',
                caption: `🎵 *${title}*\n\n_ᴄʀᴇᴀᴛᴏʀ:_ Wanga\n_sɪᴢᴇ:_ ${fileSizeMB} MB\n\n_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`
            }, { quoted: msg });
            
            await sendButtonMenu(sock, from, {
                title: '✅ 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄',
                text: `_Enjoy your audio!_`,
                footer: '> created by wanga',
                buttons: [
                    { id: `${config.PREFIX}ytmp3`, text: '🎵 Another URL' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);

            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTMP3 error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '❌ 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃',
                text: `_Check URL and try again._\n\n> created by wanga`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) await fs.unlink(tempFile).catch(() => {});
        }
    }
});

// ==================== YTMP4 - YouTube URL to MP4 ====================

commands.push({
    name: 'ytmp4',
    description: 'Convert YouTube URL to MP4 video',
    aliases: ['ytvideo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '🎬 𝐘𝐓𝐌𝐏𝟒',
                text: `_Usage:_ ${config.PREFIX}ytmp4 <YouTube URL>\n_Example:_ ${config.PREFIX}ytmp4 https://youtu.be/...\n\n_🎬 Download YouTube videos_`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const url = args[0];
        let tempFile = null;
        
        await react('🔗');
        await sendButtonMenu(sock, from, {
            title: '🔗 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆',
            text: `_URL:_ ${url}\n\n_🎬 Fetching video..._`,
            footer: '> created by wanga',
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        
        try {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                throw new Error('Invalid YouTube URL');
            }

            const videoId = extractVideoId(url);
            if (!videoId) throw new Error('Invalid video ID');

            const videoInfo = await yts({ videoId });
            const video = videoInfo.videos[0];
            if (!video) throw new Error('Video not found');
            
            const title = video.title;
            const duration = video.timestamp || formatDuration(video.duration);
            const channel = video.author?.name || 'Unknown';
            const views = formatNumber(video.views);
            const thumbnailUrl = getThumbnailUrl(videoId);
            
            await sock.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: `🎬 *𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐔𝐍𝐃*\n━━━━━━━━━━━━━━━━━━━\n_🎤 Title:_ *${title}*\n_⏱️ Duration:_ ${duration}\n_👤 Channel:_ ${channel}\n_👁️ Views:_ ${views}\n\n_⬇️ Downloading video..._`
            }, { quoted: msg });

            const downloadUrls = [
                `https://apis.xwolf.space/download/mp4?url=${encodeURIComponent(url)}`,
                `https://apis.xwolf.space/download/video?url=${encodeURIComponent(url)}`
            ];

            let downloadUrl = null;
            for (const endpoint of downloadUrls) {
                try {
                    const response = await axios.get(endpoint, { timeout: 30000 });
                    if (response.data?.success && response.data?.downloadUrl) {
                        downloadUrl = response.data.downloadUrl;
                        break;
                    }
                } catch (e) {}
            }
            
            if (!downloadUrl) throw new Error('Download failed');

            const filename = `ytmp4_${Date.now()}.mp4`;
            tempFile = await downloadFile(downloadUrl, filename);
            const buffer = await fs.readFile(tempFile);
            const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
            
            await sock.sendMessage(from, {
                video: buffer,
                caption: `🎬 *${title}*\n\n_ᴄʀᴇᴀᴛᴏʀ:_ Wanga\n_sɪᴢᴇ:_ ${fileSizeMB} MB\n\n_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎬`
            }, { quoted: msg });
            
            await sendButtonMenu(sock, from, {
                title: '✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄',
                text: `_Enjoy your video!_`,
                footer: '> created by wanga',
                buttons: [
                    { id: `${config.PREFIX}ytmp4`, text: '🎬 Another URL' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);

            await react('✅');
            
        } catch (error) {
            bot.logger.error('YTMP4 error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃',
                text: `_Check URL and try again._\n\n> created by wanga`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) await fs.unlink(tempFile).catch(() => {});
        }
    }
});

// ==================== SPOTIFY DOWNLOAD ====================

commands.push({
    name: 'spotifydl',
    description: 'Download Spotify track',
    aliases: ['spdl', 'sdd'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '🎵 𝐒𝐏𝐎𝐓𝐈𝐅𝐘',
                text: `_Usage:_ ${config.PREFIX}spotifydl <song name or URL>\n_Example:_ ${config.PREFIX}spotifydl Maintain by ssaru\n\n_🎧 Download from Spotify_`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const query = args.join(' ');
        let tempFile = null;
        
        await react('🔍');
        await sendButtonMenu(sock, from, {
            title: '🔍 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆',
            text: `_Query:_ "${query}"\n\n_🎵 Looking for track..._`,
            footer: '> created by wanga',
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        
        try {
            const isUrl = query.includes('spotify.com') || query.includes('open.spotify');
            let response;
            
            if (isUrl) {
                const trackId = extractSpotifyId(query);
                if (!trackId) throw new Error('Invalid Spotify URL');
                response = await axios.get(`https://apis.xwolf.space/api/spotify/download`, {
                    params: { id: trackId },
                    timeout: 30000
                });
            } else {
                response = await axios.get(`https://apis.xwolf.space/api/spotify/download`, {
                    params: { q: query },
                    timeout: 30000
                });
            }

            if (!response.data?.success) throw new Error('Track not found');

            const data = response.data;
            
            if (data.albumArt) {
                await sock.sendMessage(from, {
                    image: { url: data.albumArt },
                    caption: `🎵 *𝐓𝐑𝐀𝐂𝐊 𝐅𝐎𝐔𝐍𝐃*\n━━━━━━━━━━━━━━━━━━━\n_🎤 Title:_ *${data.title}*\n_👤 Artist:_ ${data.artist}\n_💿 Album:_ ${data.album || 'Single'}\n\n_⬇️ Downloading track..._`
                }, { quoted: msg });
            }

            const filename = `spotify_${Date.now()}.mp3`;
            tempFile = await downloadFile(data.downloadUrl, filename);
            const buffer = await fs.readFile(tempFile);
            const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
            
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: cleanFilename(data.title) + '.mp3',
                caption: `🎵 *${data.title}*\n\n_ᴄʀᴇᴀᴛᴏʀ:_ Wanga\n_sɪᴢᴇ:_ ${fileSizeMB} MB\n\n_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`
            }, { quoted: msg });
            
            await sendButtonMenu(sock, from, {
                title: '✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄',
                text: `_Enjoy your track!_`,
                footer: '> created by wanga',
                buttons: [
                    { id: `${config.PREFIX}spotifydl`, text: '🎵 Another Track' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);

            await react('✅');
            
        } catch (error) {
            bot.logger.error('Spotify error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃',
                text: `_Try again later._\n\n> created by wanga`,
                footer: '> created by wanga',
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } finally {
            if (tempFile && await fs.pathExists(tempFile)) await fs.unlink(tempFile).catch(() => {});
        }
    }
});

// ==================== DOWNLOADER HELP ====================

commands.push({
    name: 'downloadhelp',
    description: 'Show all downloader commands',
    aliases: ['dlhelp', 'playhelp', 'downloader'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;
        
        const helpText = `🎵 *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*🎬 YOUTUBE*\n` +
            `_${prefix}play <song name>_ - Search & download audio\n` +
            `_${prefix}ytmp3 <URL>_ - YouTube to MP3\n` +
            `_${prefix}ytmp4 <URL>_ - YouTube to MP4\n\n` +
            
            `*🎵 SPOTIFY*\n` +
            `_${prefix}spotifydl <song/URL>_ - Download Spotify\n\n` +
            
            `*🎧 SOUNDCLOUD*\n` +
            `_${prefix}soundcloud <URL>_ - Download SoundCloud\n\n` +
            
            `*📱 SOCIAL MEDIA*\n` +
            `_${prefix}tiktokdl <URL>_ - TikTok videos\n` +
            `_${prefix}instagramdl <URL>_ - Instagram posts/reels\n` +
            `_${prefix}facebookdl <URL>_ - Facebook videos\n\n` +
            
            `*🌐 UNIVERSAL*\n` +
            `_${prefix}savefrom <URL>_ - Download from any platform\n` +
            `_${prefix}dlfiles <URL>_ - Direct file download\n\n` +
            
            `> created by wanga`;

        await sendButtonMenu(sock, from, {
            title: '🎵 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
            text: helpText,
            footer: '> created by wanga',
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// Keep other social media commands (facebookdl, instagramdl, tiktokdl, soundcloud, savefrom) from original file...

module.exports = { commands };
