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
        '.zip': 'application/zip'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}

// Upload to Catbox (free, no API key required)
async function uploadToCatbox(buffer, filename) {
    try {
        const form = new FormData();
        const stream = bufferToStream(buffer);
        
        form.append('reqtype', 'fileupload');
        form.append('userhash', ''); // Optional, can be empty for anonymous
        form.append('fileToUpload', stream, {
            filename: filename,
            contentType: getFileContentType(path.extname(filename))
        });

        const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        return { url: data.trim(), success: true };
    } catch (error) {
        console.error('Catbox upload error:', error);
        return { url: null, success: false, error: error.message };
    }
}

// Upload to ImgBB (needs API key, but more reliable for images)
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
            { headers: form.getHeaders() }
        );

        return { url: data.data.url, success: true };
    } catch (error) {
        console.error('ImgBB upload error:', error);
        return { url: null, success: false, error: error.message };
    }
}

module.exports = {
    uploadToCatbox,
    uploadToImgBB,
    bufferToStream,
    getFileContentType
};
