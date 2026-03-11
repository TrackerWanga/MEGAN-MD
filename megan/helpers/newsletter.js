// megan/helpers/newsletter.js

const config = require('../config');

// Your channel details

const CHANNEL_JID = "120363423423870584@newsletter";

const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b";

const BOT_IMAGE = "https://files.catbox.moe/kubc8p.png";

/**

 * Create newsletter-style context for messages

 * Shows as forwarded from channel with clean look

 */

const createNewsletterContext = (userJid, options = {}) => ({

    contextInfo: {

        mentionedJid: [userJid],

        forwardingScore: 1, // Just 1, not multiple forwards

        isForwarded: true,

        forwardedNewsletterMessageInfo: {

            newsletterJid: CHANNEL_JID,

            newsletterName: options.newsletterName || config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",

            serverMessageId: Math.floor(100000 + Math.random() * 900000)

        },

        externalAdReply: {

            title: options.title || config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",

            body: options.body || "Powered by Tracker Wanga Tech",

            thumbnailUrl: options.thumbnail || BOT_IMAGE,

            mediaType: 1,

            mediaUrl: options.mediaUrl || BOT_IMAGE,

            sourceUrl: options.sourceUrl || CHANNEL_LINK,

            showAdAttribution: true,

            renderLargerThumbnail: false

        }

    }

});

/**

 * Alternative context with larger thumbnail

 */

const createNewsletterContext2 = (userJid, options = {}) => ({

    contextInfo: {

        mentionedJid: [userJid],

        forwardingScore: 1,

        isForwarded: true,

        forwardedNewsletterMessageInfo: {

            newsletterJid: CHANNEL_JID,

            newsletterName: options.newsletterName || config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",

            serverMessageId: Math.floor(100000 + Math.random() * 900000)

        },

        externalAdReply: {

            title: options.title || config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐍-𝐓𝐄𝐂𝐇",

            body: options.body || "Powered by Tracker Wanga Tech",

            thumbnailUrl: options.thumbnail || BOT_IMAGE,

            mediaType: 1,

            showAdAttribution: true,

            renderLargerThumbnail: true

        }

    }

});

module.exports = {

    createNewsletterContext,

    createNewsletterContext2,

    CHANNEL_JID,

    CHANNEL_LINK,

    BOT_IMAGE

};