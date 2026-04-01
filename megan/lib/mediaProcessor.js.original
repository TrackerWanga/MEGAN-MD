// MEGAN-MD Media Processor - Complete with all methods

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

ffmpeg.setFfmpegPath(ffmpegPath);

class MediaProcessor {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        fs.ensureDirSync(this.tempDir);
    }

    // ==================== STICKER METHODS ====================
    
    async createSticker(buffer, options = {}) {
        try {
            const sticker = new Sticker(buffer, {
                pack: options.pack || 'MEGAN-MD',
                author: options.author || 'Wanga',
                type: StickerTypes.DEFAULT,
                quality: options.quality || 80
            });
            return await sticker.toBuffer();
        } catch (error) {
            throw error;
        }
    }

    async stickerToImage(buffer) {
        try {
            try {
                return await sharp(buffer).png().toBuffer();
            } catch {
                const image = await Jimp.read(buffer);
                return await image.getBufferAsync(Jimp.MIME_PNG);
            }
        } catch (error) {
            throw error;
        }
    }

    // ==================== AUDIO METHODS ====================
    
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

    async extractAudio(buffer) {
        return await this.toAudio(buffer);
    }

    async changeSpeed(buffer, speed) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);
        
        try {
            await fs.writeFile(inputPath, buffer);
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .audioFilters(`atempo=${speed}`)
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

    async changeVolume(buffer, volume) {
        const inputPath = path.join(this.tempDir, `input_${Date.now()}.audio`);
        const outputPath = path.join(this.tempDir, `output_${Date.now()}.mp3`);
        
        try {
            await fs.writeFile(inputPath, buffer);
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .audioFilters(`volume=${volume}`)
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

    // ==================== IMAGE METHODS ====================
    
    async createCircle(buffer) {
        try {
            const image = await Jimp.read(buffer);
            const size = Math.min(image.bitmap.width, image.bitmap.height);
            const x = (image.bitmap.width - size) / 2;
            const y = (image.bitmap.height - size) / 2;
            
            image.crop(x, y, size, size);
            image.circle();
            
            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (error) {
            // Fallback using sharp
            try {
                return await sharp(buffer)
                    .resize(512, 512, { fit: 'cover' })
                    .png()
                    .toBuffer();
            } catch (e) {
                throw error;
            }
        }
    }

    async applyFilter(buffer, filter) {
        let image = await Jimp.read(buffer);
        
        switch (filter) {
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
                image.brightness(0.3);
                break;
            case 'darken':
                image.brightness(-0.3);
                break;
            case 'contrast':
                image.contrast(0.3);
                break;
            case 'blur':
                image.blur(5);
                break;
            case 'sharpen':
                image.convolute([
                    [0, -1, 0],
                    [-1, 5, -1],
                    [0, -1, 0]
                ]);
                break;
            default:
                image.greyscale();
        }
        
        return await image.getBufferAsync(Jimp.MIME_PNG);
    }

    async removeBackground(buffer) {
        try {
            // Simple white/light background removal
            const image = await Jimp.read(buffer);
            
            // Get color at top-left corner (assumed background)
            const bgColor = image.getPixelColor(0, 0);
            const { r, g, b } = Jimp.intToRGBA(bgColor);
            
            // Make similar colors transparent
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                const pixelR = image.bitmap.data[idx];
                const pixelG = image.bitmap.data[idx + 1];
                const pixelB = image.bitmap.data[idx + 2];
                
                // If pixel is similar to background, make transparent
                if (Math.abs(pixelR - r) < 30 && 
                    Math.abs(pixelG - g) < 30 && 
                    Math.abs(pixelB - b) < 30) {
                    image.bitmap.data[idx + 3] = 0; // Alpha to 0
                }
            });
            
            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (error) {
            throw new Error('Background removal failed');
        }
    }

    // ==================== MEME METHODS ====================
    
    async createMeme(topText, bottomText, baseImageBuffer) {
        const image = await Jimp.read(baseImageBuffer);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        
        // Draw top text
        if (topText) {
            const textWidth = Jimp.measureText(font, topText);
            const x = (image.bitmap.width - textWidth) / 2;
            image.print(font, x, 10, topText);
        }
        
        // Draw bottom text
        if (bottomText) {
            const textWidth = Jimp.measureText(font, bottomText);
            const x = (image.bitmap.width - textWidth) / 2;
            image.print(font, x, image.bitmap.height - 50, bottomText);
        }
        
        return await image.getBufferAsync(Jimp.MIME_JPEG);
    }

    // ==================== CLEANUP ====================
    
    async cleanup() {
        try {
            const files = await fs.readdir(this.tempDir);
            let deleted = 0;
            let freed = 0;
            
            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                const stats = await fs.stat(filePath);
                freed += stats.size;
                await fs.remove(filePath);
                deleted++;
            }
            
            return { deleted, freed };
        } catch (error) {
            return { deleted: 0, freed: 0 };
        }
    }
}

module.exports = MediaProcessor;
