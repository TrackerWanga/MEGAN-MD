// MEGAN-MD Upload Handler - Enhanced with Multiple Fallbacks

const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs-extra');

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

function getFileContentType(ext) {
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.zip': 'application/zip',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}

// ==================== UPLOAD SERVICES ====================

// 1. Catbox (free, no API key, reliable)
async function uploadToCatbox(buffer, filename) {
    try {
        const form = new FormData();
        const stream = bufferToStream(buffer);

        form.append('reqtype', 'fileupload');
        form.append('userhash', '');
        form.append('fileToUpload', stream, {
            filename: filename,
            contentType: getFileContentType(path.extname(filename))
        });

        const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000
        });

        return { url: data.trim(), success: true, service: '📦 Catbox' };
    } catch (error) {
        console.error('Catbox upload error:', error.message);
        return { url: null, success: false, service: '📦 Catbox', error: error.message };
    }
}

// 2. ImgBB (requires API key, but reliable for images)
async function uploadToImgBB(buffer, filename) {
    try {
        const form = new FormData();
        const stream = bufferToStream(buffer);

        form.append('image', stream, {
            filename: filename,
            contentType: getFileContentType(path.extname(filename))
        });

        const { data } = await axios.post(
            'https://api.imgbb.com/1/upload?key=bbc0c59714520ebcd0af58caf995bd08',
            form,
            { headers: form.getHeaders(), timeout: 30000 }
        );

        return { url: data.data.url, success: true, service: '🖼️ ImgBB' };
    } catch (error) {
        console.error('ImgBB upload error:', error.message);
        return { url: null, success: false, service: '🖼️ ImgBB', error: error.message };
    }
}

// 3. FreeImage.host (alternative free host)
async function uploadToFreeImage(buffer, filename) {
    try {
        const form = new FormData();
        const stream = bufferToStream(buffer);

        form.append('source', stream, {
            filename: filename,
            contentType: getFileContentType(path.extname(filename))
        });
        form.append('type', 'file');

        const { data } = await axios.post('https://freeimage.host/api/1/upload', form, {
            headers: form.getHeaders(),
            params: { key: '6d207e02198a847aa98d0a2a901485a5' },
            timeout: 30000
        });

        if (data?.image?.url) {
            return { url: data.image.url, success: true, service: '🆓 FreeImage' };
        }
        throw new Error('No URL in response');
    } catch (error) {
        console.error('FreeImage upload error:', error.message);
        return { url: null, success: false, service: '🆓 FreeImage', error: error.message };
    }
}

// 4. Temp.sh (temporary file hosting)
async function uploadToTempSh(buffer, filename) {
    try {
        const form = new FormData();
        const stream = bufferToStream(buffer);

        form.append('file', stream, {
            filename: filename,
            contentType: getFileContentType(path.extname(filename))
        });

        const { data } = await axios.post('https://tmp.sh/upload.php', form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        if (data?.url) {
            return { url: data.url, success: true, service: '📎 Temp.sh' };
        }
        throw new Error('No URL in response');
    } catch (error) {
        console.error('Temp.sh upload error:', error.message);
        return { url: null, success: false, service: '📎 Temp.sh', error: error.message };
    }
}

// ==================== RETRY & FALLBACK ====================

async function uploadWithRetry(uploadFn, buffer, filename, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await uploadFn(buffer, filename);
            if (result.success) return result;
            
            if (attempt < maxRetries) {
                console.log(`Retry ${attempt}/${maxRetries} for ${uploadFn.name}...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        } catch (error) {
            if (attempt === maxRetries) {
                return { success: false, error: error.message };
            }
        }
    }
    return { success: false, error: 'Max retries exceeded' };
}

async function uploadAuto(buffer, filename) {
    const errors = [];

    // Try Catbox first (most reliable)
    console.log('📤 Uploading to Catbox...');
    const catboxResult = await uploadWithRetry(uploadToCatbox, buffer, filename);
    if (catboxResult.success) {
        console.log(`✅ Uploaded via ${catboxResult.service}`);
        return catboxResult;
    }
    errors.push(`Catbox: ${catboxResult.error}`);

    // Try ImgBB second
    console.log('📤 Uploading to ImgBB...');
    const imgbbResult = await uploadWithRetry(uploadToImgBB, buffer, filename);
    if (imgbbResult.success) {
        console.log(`✅ Uploaded via ${imgbbResult.service}`);
        return imgbbResult;
    }
    errors.push(`ImgBB: ${imgbbResult.error}`);

    // Try FreeImage third
    console.log('📤 Uploading to FreeImage...');
    const freeImageResult = await uploadWithRetry(uploadToFreeImage, buffer, filename);
    if (freeImageResult.success) {
        console.log(`✅ Uploaded via ${freeImageResult.service}`);
        return freeImageResult;
    }
    errors.push(`FreeImage: ${freeImageResult.error}`);

    // Try Temp.sh last
    console.log('📤 Uploading to Temp.sh...');
    const tempShResult = await uploadWithRetry(uploadToTempSh, buffer, filename);
    if (tempShResult.success) {
        console.log(`✅ Uploaded via ${tempShResult.service}`);
        return tempShResult;
    }
    errors.push(`Temp.sh: ${tempShResult.error}`);

    // All failed
    console.error('❌ All upload services failed');
    return { 
        url: null, 
        success: false, 
        error: 'All upload services failed',
        details: errors
    };
}

// ==================== EXPORTS ====================

module.exports = {
    uploadToCatbox,
    uploadToImgBB,
    uploadToFreeImage,
    uploadToTempSh,
    uploadAuto,
    bufferToStream,
    getFileContentType
};
