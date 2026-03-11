// megan/scripts/migrateToSQLite.js

const fs = require('fs-extra');

const path = require('path');

const { sequelize, User, Group, Setting, DeletedMessage, Warning, CommandStat } = require('../models');

async function migrate() {

    console.log('🔄 Starting migration from JSON to SQLite...');

    

    const oldDbPath = path.join(process.cwd(), 'database.json');

    const backupPath = path.join(process.cwd(), 'database.json.backup');

    

    // Check if old database exists

    if (!await fs.pathExists(oldDbPath)) {

        console.log('✅ No old database found. Creating fresh SQLite database.');

        await sequelize.sync({ force: true });

        

        // Create default settings

        await Setting.create({ key: 'version', value: '"2.5.0"' });

        console.log('✅ Fresh database created');

        return;

    }

    

    try {

        // Read old database

        const oldDb = await fs.readJson(oldDbPath);

        console.log(`📖 Loaded old database with:`);

        console.log(`   - ${Object.keys(oldDb.settings || {}).length} settings`);

        console.log(`   - ${Object.keys(oldDb.users || {}).length} users`);

        console.log(`   - ${Object.keys(oldDb.groups || {}).length} groups`);

        

        // Sync new database

        await sequelize.sync({ force: true });

        

        // Migrate settings

        if (oldDb.settings) {

            let migratedCount = 0;

            for (const [key, setting] of Object.entries(oldDb.settings)) {

                try {

                    const value = setting.value || setting;

                    await Setting.create({

                        key,

                        value: typeof value === 'string' ? value : JSON.stringify(value)

                    });

                    migratedCount++;

                } catch (e) {

                    console.log(`   ⚠️ Failed to migrate setting ${key}: ${e.message}`);

                }

            }

            console.log(`✅ Migrated ${migratedCount} settings`);

        }

        

        // Migrate users

        if (oldDb.users) {

            let migratedCount = 0;

            for (const [jid, user] of Object.entries(oldDb.users)) {

                try {

                    await User.create({

                        jid,

                        warns: user.warns || 0,

                        banned: user.banned || false,

                        premium: user.premium || false,

                        commandCount: user.commandCount || 0,

                        lastSeen: user.lastSeen ? new Date(user.lastSeen) : null

                    });

                    migratedCount++;

                } catch (e) {

                    console.log(`   ⚠️ Failed to migrate user ${jid}: ${e.message}`);

                }

            }

            console.log(`✅ Migrated ${migratedCount} users`);

        }

        

        // Migrate groups

        if (oldDb.groups) {

            let migratedCount = 0;

            for (const [jid, group] of Object.entries(oldDb.groups)) {

                try {

                    await Group.create({

                        jid,

                        name: group.name || '',

                        welcomeEnabled: group.welcome === 'on',

                        goodbyeEnabled: group.goodbye === 'on',

                        welcomeMsg: group.welcomeMsg || 'Hey @user welcome!',

                        goodbyeMsg: group.goodbyeMsg || 'Goodbye @user! 👋',

                        antilink: group.antilink || 'off',

                        settings: group.settings || {}

                    });

                    migratedCount++;

                } catch (e) {

                    console.log(`   ⚠️ Failed to migrate group ${jid}: ${e.message}`);

                }

            }

            console.log(`✅ Migrated ${migratedCount} groups`);

        }

        

        // Add version marker

        await Setting.create({ key: 'version', value: '"2.5.0"' });

        await Setting.create({ key: 'migrated_at', value: JSON.stringify(new Date().toISOString()) });

        

        // Backup old database

        await fs.copy(oldDbPath, backupPath);

        console.log(`💾 Backup saved to ${backupPath}`);

        

        // Rename old database (optional)

        // await fs.rename(oldDbPath, oldDbPath + '.old');

        

        console.log('✅ Migration complete!');

        

    } catch (error) {

        console.error('❌ Migration failed:', error);

        process.exit(1);

    }

}

// Run migration

migrate().then(() => {

    process.exit(0);

}).catch(error => {

    console.error('❌ Migration error:', error);

    process.exit(1);

});