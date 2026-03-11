// megan/helpers/designs.js

/**

 * MEGAN-MD Design Helper

 * Collection of ASCII designs for beautiful bot responses

 */

class Designs {



    // ==================== HEADERS & FOOTERS ====================



    /**

     * Main header with title

     * @param {string} title - The title to display

     * @returns {string} Formatted header

     */

    static header(title) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   *${title}*   ┃

╰━━━━━━━━━━━━━━━━━━━╯`;

    }

    /**

     * Simple header without title (just lines)

     * @returns {string} Simple header line

     */

    static headerLine() {

        return `╭━━━━━━━━━━━━━━━━━━━╮`;

    }

    /**

     * Simple footer line

     * @returns {string} Simple footer line

     */

    static footerLine() {

        return `╰━━━━━━━━━━━━━━━━━━━╯`;

    }

    /**

     * Decorative footer with creator credit

     * @returns {string} Formatted footer

     */

    static footer() {

        return `✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Mini footer (shorter version)

     * @returns {string} Short footer

     */

    static footerMini() {

        return `✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    // ==================== POINTERS ====================

    /**

     * Get pointer for commands

     * @returns {string} Command pointer

     */

    static pointer() {

        return `➣`;

    }

    /**

     * Get all available pointers

     * @returns {Array} Array of pointers

     */

    static pointers() {

        return ['➣', '➢', '➤', '➡'];

    }

    /**

     * Format a command with pointer

     * @param {string} cmd - Command name

     * @param {string} desc - Optional description

     * @returns {string} Formatted command line

     */

    static command(cmd, desc = '') {

        if (desc) {

            return `➣ ${cmd} - ${desc}`;

        }

        return `➣ ${cmd}`;

    }

    // ==================== LOADING ANIMATIONS ====================

    /**

     * Nature-themed loading message

     * @param {string} message - Optional custom message

     * @returns {string} Nature loading text

     */

    static loadingNature(message = 'Processing your request...') {

        return `🍃🍂🍃 ${message} 🍂🍃🍂`;

    }

    /**

     * Star-themed loading message

     * @param {string} message - Optional custom message

     * @returns {string} Star loading text

     */

    static loadingStars(message = 'Please wait') {

        return `⭐·🌟·⭐ ${message} ·🌟·⭐·🌟`;

    }

    /**

     * Simple loading message

     * @param {string} message - Loading message

     * @returns {string} Simple loading

     */

    static loading(message = 'Loading...') {

        return `◷ ${message} ◶`;

    }

    // ==================== STATUS MESSAGES ====================

    /**

     * Success message with design

     * @param {string} message - Success message

     * @returns {string} Formatted success

     */

    static success(message) {

        return `✤✥✤✥✤✥ SUCCESS! ✥✤✥✤✥✤

✅ ${message}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Error message with design

     * @param {string} message - Error message

     * @returns {string} Formatted error

     */

    static error(message) {

        return `✤✥✤✥✤✥ ERROR! ✥✤✥✤✥✤

❌ ${message}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Warning message

     * @param {string} message - Warning message

     * @returns {string} Formatted warning

     */

    static warning(message) {

        return `✤✥✤✥✤✥ WARNING! ✥✤✥✤✥✤

⚠️ ${message}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Info message

     * @param {string} message - Info message

     * @returns {string} Formatted info

     */

    static info(message) {

        return `✤✥✤✥✤✥ INFO ✥✤✥✤✥✤

ℹ️ ${message}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    // ==================== CATEGORY HEADERS ====================

    /**

     * Category header with icon

     * @param {string} icon - Emoji icon

     * @param {string} title - Category title

     * @returns {string} Formatted category

     */

    static category(icon, title) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   ${icon} *${title}*   ┃

╰━━━━━━━━━━━━━━━━━━━╯`;

    }

    /**

     * Simple category without icon

     * @param {string} title - Category title

     * @returns {string} Simple category

     */

    static categorySimple(title) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   *${title}*   ┃

╰━━━━━━━━━━━━━━━━━━━╯`;

    }

    // ==================== COMMAND LISTS ====================

    /**

     * Create a command list

     * @param {string} category - Category name

     * @param {Array} commands - Array of command objects {name, description}

     * @returns {string} Formatted command list

     */

    static commandList(category, commands) {

        let output = `${this.categorySimple(category)}\n\n`;



        commands.forEach(cmd => {

            if (cmd.description) {

                output += `➣ ${cmd.name} - ${cmd.description}\n`;

            } else {

                output += `➣ ${cmd.name}\n`;

            }

        });



        output += `\n${this.footerMini()}\n> created by wanga\n${this.footerMini()}`;

        return output;

    }

    /**

     * Simple command list (no descriptions)

     * @param {string} category - Category name

     * @param {Array} commands - Array of command names

     * @returns {string} Formatted simple command list

     */

    static commandListSimple(category, commands) {

        let output = `${this.categorySimple(category)}\n\n`;



        commands.forEach(cmd => {

            output += `➣ ${cmd}\n`;

        });



        output += `\n${this.footerMini()}\n> created by wanga\n${this.footerMini()}`;

        return output;

    }

    // ==================== DIVIDERS ====================

    /**

     * Get a divider line

     * @returns {string} Divider line

     */

    static divider() {

        return `╰━━━━━━━━━━━━━━━━━━━╯`;

    }

    /**

     * Get a decorative divider

     * @returns {string} Decorative divider

     */

    static dividerDeco() {

        return `✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    // ==================== BULLET POINTS ====================

    /**

     * Get bullet points collection

     * @returns {Object} Bullet point styles

     */

    static bullets() {

        return {

            dot: '•',

            circle: '●',

            empty: '○',

            square: '▪',

            emptySquare: '▫',

            checkbox: '☐',

            checked: '☑',

            crossBox: '☒',

            diamond: '♦',

            spade: '♠',

            club: '♣',

            heart: '♥',

            music: '♡'

        };

    }

    /**

     * Format with bullet point

     * @param {string} text - Text to bullet

     * @param {string} style - Bullet style (dot, circle, square, etc.)

     * @returns {string} Bulleted text

     */

    static bullet(text, style = 'dot') {

        const bullets = this.bullets();

        const bullet = bullets[style] || bullets.dot;

        return `${bullet} ${text}`;

    }

    // ==================== FULL MENU TEMPLATES ====================

    /**

     * Create a complete menu

     * @param {string} title - Menu title

     * @param {Array} sections - Array of section objects {title, commands}

     * @returns {string} Complete menu

     */

    static menu(title, sections) {

        let output = `${this.header(title)}\n\n`;



        sections.forEach(section => {

            output += `${this.categorySimple(section.title)}\n\n`;

            section.commands.forEach(cmd => {

                if (cmd.desc) {

                    output += `➣ ${cmd.name} - ${cmd.desc}\n`;

                } else {

                    output += `➣ ${cmd.name}\n`;

                }

            });

            output += `\n`;

        });



        output += this.footer();

        return output;

    }

    /**

     * Quick menu for AI commands

     * @param {string} prefix - Command prefix

     * @returns {string} AI commands menu

     */

    static aiMenu(prefix) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   🤖 *AI COMMANDS*   ┃

╰━━━━━━━━━━━━━━━━━━━╯

➣ ${prefix}megan

➣ ${prefix}chatgpt

➣ ${prefix}gemini

➣ ${prefix}llama

➣ ${prefix}copilot

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Quick menu for download commands

     * @param {string} prefix - Command prefix

     * @returns {string} Download commands menu

     */

    static downloadMenu(prefix) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   ⬇️ *DOWNLOADER*   ┃

╰━━━━━━━━━━━━━━━━━━━╯

➣ ${prefix}play

➣ ${prefix}music

➣ ${prefix}mp3

➣ ${prefix}ytmp3

➣ ${prefix}ytmp4

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Quick menu for group commands

     * @param {string} prefix - Command prefix

     * @returns {string} Group commands menu

     */

    static groupMenu(prefix) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   👥 *GROUP CMDS*   ┃

╰━━━━━━━━━━━━━━━━━━━╯

➣ ${prefix}add

➣ ${prefix}remove

➣ ${prefix}promote

➣ ${prefix}demote

➣ ${prefix}tagall

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    // ==================== CUSTOM MESSAGES ====================

    /**

     * Create a custom message with design

     * @param {string} title - Message title

     * @param {string} content - Message content

     * @param {string} type - Message type (info, success, error, warning)

     * @returns {string} Formatted message

     */

    static message(title, content, type = 'info') {

        const icons = {

            info: 'ℹ️',

            success: '✅',

            error: '❌',

            warning: '⚠️'

        };



        const icon = icons[type] || '📌';



        return `╭━━━━━━━━━━━━━━━━━━━╮

┃   ${icon} *${title}*   ┃

╰━━━━━━━━━━━━━━━━━━━╯

${content}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

    /**

     * Quick info box

     * @param {string} text - Info text

     * @returns {string} Info box

     */

    static infoBox(text) {

        return `╭━━━━━━━━━━━━━━━━━━━╮

┃      ℹ️ INFO       ┃

╰━━━━━━━━━━━━━━━━━━━╯

${text}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥

> created by wanga

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

    }

}

module.exports = Designs;