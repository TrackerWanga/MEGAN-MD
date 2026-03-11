const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');
const { fromBuffer } = require('file-type');
const { Readable } = require('stream');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../config');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

class MediaProcessor {
    constructor() {
        this.tempDir = path.join(__dirname, '../../temp');
        fs.ensureDirSync(this.tempDir);
    }

    // ==================== STICKER TOOLS ====================

    /**
     * Create sticker from image/video buffer
     */
    async createSticker(buffer, options = {}) {
        try {
            const sticker = new Sticker(buffer, {
                pack: options.pack || config.BOT_NAME || 'MEGAN-MD',
                author: options.author || config.OWNER_NAME || 'Wanga',
                type: options.type || StickerTypes.DEFAULT,
                quality: options.quality || 80,
                background: options.background || 'transparent'
            });

            return await sticker.toBuffer();
        } catch (error) {
            console.error('Sticker creation error:', error);
            throw error;
        }
    }

    /**
     * Convert sticker to image
     */
    async stickerToImage(buffer) {
        try {
            // Try sharp first (better for WebP)
            try {
                const image = await sharp(buffer)
                    .png()
                    .toBuffer();
                return image;
            } catch (sharpError) {
                // Fallback to Jimp
                const image = await Jimp.read(buffer);
                return await image.getBufferAsync(Jimp.MIME_PNG);
            }
        } catch (error) {
            console.error('Sticker to image error:', error);
            throw error;
        }
    }

    /**
     * Create GIF from video (for animated stickers)
     */
    async videoToGif(buffer, options = {}) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.mp4`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.gif`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .outputOptions([
                        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
                        '-loop', '0'
                    ])
                    .toFormat('gif')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            const result = await fs.readFile(outputPath);
            return result;
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    // ==================== AUDIO TOOLS ====================

    /**
     * Convert any audio to MP3
     */
    async toAudio(buffer) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .noVideo()
                    .audioCodec('libmp3lame')
                    .audioBitrate(128)
                    .audioChannels(2)
                    .audioFrequency(44100)
                    .toFormat('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    /**
     * Convert audio to voice note (PTT - Push to Talk)
     */
    async toPTT(buffer) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.ogg`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .noVideo()
                    .audioCodec('libopus')
                    .audioBitrate(24)
                    .audioChannels(1)
                    .audioFrequency(16000)
                    .toFormat('ogg')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    /**
     * Change audio speed
     */
    async changeSpeed(buffer, speed = 1.0) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .audioFilter(`atempo=${speed}`)
                    .toFormat('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    /**
     * Change audio volume
     */
    async changeVolume(buffer, volume = 1.0) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .audioFilter(`volume=${volume}`)
                    .toFormat('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    // ==================== VIDEO TOOLS ====================

    /**
     * Convert video to MP4 format
     */
    async toVideo(buffer) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.video`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp4`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .outputOptions([
                        '-preset ultrafast',
                        '-movflags +faststart',
                        '-pix_fmt yuv420p',
                        '-crf 23',
                        '-r 30'
                    ])
                    .toFormat('mp4')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    /**
     * Extract audio from video
     */
    async extractAudio(buffer) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.video`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);

        try {
            await fs.writeFile(inputPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .noVideo()
                    .audioCodec('libmp3lame')
                    .toFormat('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            return await fs.readFile(outputPath);
        } finally {
            await fs.remove(inputPath).catch(() => {});
            await fs.remove(outputPath).catch(() => {});
        }
    }

    // ==================== IMAGE TOOLS ====================

    /**
     * Resize image
     */
    async resizeImage(buffer, width, height) {
        try {
            return await sharp(buffer)
                .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();
        } catch (error) {
            console.error('Resize error:', error);
            throw error;
        }
    }

    /**
     * Apply filter to image
     */
    async applyFilter(buffer, filter) {
        try {
            const image = await Jimp.read(buffer);

            switch(filter.toLowerCase()) {
                case 'greyscale':
                case 'grayscale':
                    image.greyscale();
                    break;
                case 'invert':
                    image.invert();
                    break;
                case 'sepia':
                    image.sepia();
                    break;
                case 'brighten':
                    image.brightness(0.2);
                    break;
                case 'darken':
                    image.brightness(-0.2);
                    break;
                case 'contrast':
                    image.contrast(0.2);
                    break;
                case 'blur':
                    image.blur(5);
                    break;
                case 'sharpen':
                    image.convolution([[0,-1,0],[-1,5,-1],[0,-1,0]]);
                    break;
                default:
                    throw new Error('Unknown filter');
            }

            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (error) {
            console.error('Filter error:', error);
            throw error;
        }
    }

    /**
     * Create circle image
     */
    async createCircle(buffer) {
        try {
            const image = await Jimp.read(buffer);
            image.resize(512, 512);
            image.circle();
            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (error) {
            console.error('Circle error:', error);
            throw error;
        }
    }

    /**
     * Remove white background
     */
    async removeBackground(buffer) {
        try {
            const image = await Jimp.read(buffer);

            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                const r = this.bitmap.data[idx + 0];
                const g = this.bitmap.data[idx + 1];
                const b = this.bitmap.data[idx + 2];

                // Remove white/light backgrounds
                if (r > 200 && g > 200 && b > 200) {
                    this.bitmap.data[idx + 3] = 0;
                }
            });

            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (error) {
            console.error('Remove background error:', error);
            throw error;
        }
    }

    // ==================== UTILITY ====================

    /**
     * Get media info
     */
    async getMediaInfo(buffer) {
        try {
            const type = await fromBuffer(buffer);
            return {
                mime: type?.mime || 'unknown',
                ext: type?.ext || 'bin',
                size: buffer.length,
                sizeFormatted: this.formatBytes(buffer.length)
            };
        } catch (error) {
            return {
                mime: 'unknown',
                ext: 'bin',
                size: buffer.length,
                sizeFormatted: this.formatBytes(buffer.length)
            };
        }
    }

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes >= 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        } else if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return bytes + ' bytes';
        }
    }

    /**
     * Clean temp directory
     */
    async cleanup() {
        try {
            const files = await fs.readdir(this.tempDir);
            let deleted = 0;

            for (const file of files) {
                try {
                    await fs.remove(path.join(this.tempDir, file));
                    deleted++;
                } catch (e) {}
            }

            return { deleted };
        } catch (error) {
            return { deleted: 0 };
        }
    }
}

module.exports = MediaProcessor;