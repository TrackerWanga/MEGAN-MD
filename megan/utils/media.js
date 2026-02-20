const { downloadContentFromMessage } = require('gifted-baileys');
const fs = require('fs-extra');
const path = require('path');
const { Readable } = require('stream');
const FormData = require('form-data');
const axios = require('axios');

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

async function getMediaBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
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
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.zip': 'application/zip',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.txt': 'text/plain'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}

async function uploadToCatbox(buffer, filename) {
    const form = new FormData();
    const stream = bufferToStream(buffer);
    form.append('reqtype', 'fileupload');
    form.append('userhash', 'ae78e7174c674f133a271261b');
    form.append('fileToUpload', stream, {
        filename: filename,
        contentType: getFileContentType(path.extname(filename))
    });

    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });

    return { url: data.trim() };
}

async function uploadToImgBB(buffer, filename) {
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

    return { url: data.data.url };
}

module.exports = {
    getMediaBuffer,
    getFileContentType,
    bufferToStream,
    uploadToCatbox,
    uploadToImgBB
};
