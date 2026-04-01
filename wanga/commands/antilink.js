// Anti-Link Command - Simple version

const commands = [];

commands.push({
    name: 'antilink',
    description: 'Toggle anti-link for groups (on/off)',
    aliases: ['linkblock'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isGroup, isAdmin, isOwner }) {
        if (!isGroup) {
            return reply('❌ This command only works in groups!');
        }
        
        if (!isAdmin && !isOwner) {
            return reply('❌ You must be an admin to use this command!');
        }

        if (args.length === 0) {
            const enabled = await bot.db.isGroupAntiLinkEnabled(from);
            const status = enabled ? '✅ ON' : '❌ OFF';
            return reply(`🔗 *ANTI-LINK*\n\nCurrent: ${status}\n\n*Usage:*\n.antilink on - Block links\n.antilink off - Allow links`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            return reply(`❌ Invalid option. Use: on or off`);
        }

        if (option === 'on') {
            await bot.db.enableGroupAntiLink(from);
            await react('✅');
            await reply('🔗 Anti-link ENABLED for this group! Links will be deleted.');
        } else {
            await bot.db.disableGroupAntiLink(from);
            await react('✅');
            await reply('🔗 Anti-link DISABLED for this group! Links are allowed.');
        }
    }
});

module.exports = { commands };
