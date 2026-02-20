// megan/lib/autoNews.js

const config = require('../config');

class AutoNewsHandler {

    constructor(bot) {

        this.bot = bot;

        this.sock = bot.sock;

        this.logger = bot.logger;

        this.ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;

    }

    start() {

        // Auto news is disabled by default

        this.logger.info('Auto news feature is disabled');

    }

}

module.exports = AutoNewsHandler;