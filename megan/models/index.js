// megan/models/index.js

const { Sequelize, DataTypes } = require('sequelize');

const path = require('path');

const sequelize = new Sequelize({

    dialect: 'sqlite',

    storage: path.join(process.cwd(), 'database.sqlite'),

    logging: false,

    define: {

        timestamps: true,

        underscored: true

    }

});

// ==================== USER MODEL ====================

const User = sequelize.define('User', {

    jid: { 

        type: DataTypes.STRING, 

        unique: true,

        allowNull: false

    },

    warns: { 

        type: DataTypes.INTEGER, 

        defaultValue: 0 

    },

    banned: { 

        type: DataTypes.BOOLEAN, 

        defaultValue: false 

    },

    premium: { 

        type: DataTypes.BOOLEAN, 

        defaultValue: false 

    },

    commandCount: { 

        type: DataTypes.INTEGER, 

        defaultValue: 0 

    },

    lastSeen: { 

        type: DataTypes.DATE 

    }

});

// ==================== GROUP MODEL ====================

const Group = sequelize.define('Group', {

    jid: { 

        type: DataTypes.STRING, 

        unique: true,

        allowNull: false

    },

    name: { 

        type: DataTypes.STRING 

    },

    welcomeEnabled: { 

        type: DataTypes.BOOLEAN, 

        defaultValue: false 

    },

    goodbyeEnabled: { 

        type: DataTypes.BOOLEAN, 

        defaultValue: false 

    },

    welcomeMsg: { 

        type: DataTypes.TEXT, 

        defaultValue: 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.' 

    },

    goodbyeMsg: { 

        type: DataTypes.TEXT, 

        defaultValue: 'Goodbye @user! 👋' 

    },

    antilink: { 

        type: DataTypes.STRING, 

        defaultValue: 'off' 

    }, // 'off', 'delete', 'warn', 'kick'

    antilinkWarnings: { 

        type: DataTypes.INTEGER, 

        defaultValue: 3 

    },

    settings: { 

        type: DataTypes.JSON, 

        defaultValue: {} 

    }

});

// ==================== SETTING MODEL ====================

const Setting = sequelize.define('Setting', {

    key: { 

        type: DataTypes.STRING, 

        unique: true,

        allowNull: false

    },

    value: { 

        type: DataTypes.TEXT 

    } // Store as JSON string

});

// ==================== MESSAGE MODEL (New) ====================

// Stores all messages permanently

const Message = sequelize.define('Message', {

    messageId: { 

        type: DataTypes.STRING,

        unique: true,

        allowNull: false

    },

    chatJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    senderJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    messageType: { 

        type: DataTypes.STRING,

        allowNull: false

    }, // 'text', 'image', 'video', 'audio', 'sticker', 'document'

    isViewOnce: { 

        type: DataTypes.BOOLEAN,

        defaultValue: false

    },

    isStatus: { 

        type: DataTypes.BOOLEAN,

        defaultValue: false

    },

    messageData: { 

        type: DataTypes.TEXT('long'),

        allowNull: false

    }, // Full message JSON

    mediaPath: { 

        type: DataTypes.STRING 

    }, // Path to downloaded media (temp)

    mediaUrl: { 

        type: DataTypes.STRING 

    }, // URL if uploaded

    caption: { 

        type: DataTypes.TEXT 

    },

    storedAt: { 

        type: DataTypes.DATE,

        defaultValue: DataTypes.NOW

    }

});

// ==================== VIEW ONCE CAPTURE MODEL (New) ====================

// Tracks all captured view-once media

const ViewOnceCapture = sequelize.define('ViewOnceCapture', {

    messageId: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    senderJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    chatJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    mediaType: { 

        type: DataTypes.STRING,

        allowNull: false

    }, // 'image', 'video', 'audio'

    mediaUrl: { 

        type: DataTypes.TEXT,

        allowNull: false

    },

    caption: { 

        type: DataTypes.TEXT 

    },

    capturedAt: { 

        type: DataTypes.DATE,

        defaultValue: DataTypes.NOW

    },

    forwardedToOwner: { 

        type: DataTypes.BOOLEAN,

        defaultValue: false

    },

    ownerMessageId: { 

        type: DataTypes.STRING 

    } // ID of message sent to owner

});

// ==================== DELETED MESSAGE MODEL (Enhanced) ====================

const DeletedMessage = sequelize.define('DeletedMessage', {

    messageId: { 

        type: DataTypes.STRING 

    },

    chatJid: { 

        type: DataTypes.STRING 

    },

    senderJid: { 

        type: DataTypes.STRING 

    },

    deleterJid: { 

        type: DataTypes.STRING 

    },

    messageType: { 

        type: DataTypes.STRING 

    }, // 'text', 'image', 'video', 'audio', 'sticker'

    content: { 

        type: DataTypes.TEXT 

    }, // Text content or media URL

    mediaUrl: { 

        type: DataTypes.STRING 

    }, // If uploaded

    isViewOnce: {

        type: DataTypes.BOOLEAN,

        defaultValue: false

    },

    isStatus: {

        type: DataTypes.BOOLEAN,

        defaultValue: false

    },

    recoveredFrom: {

        type: DataTypes.STRING,

        defaultValue: 'memory'

    }, // 'memory', 'database', 'viewonce'

    deletedAt: { 

        type: DataTypes.DATE, 

        defaultValue: DataTypes.NOW 

    }

});

// ==================== UNIDENTIFIED MEDIA MODEL (New) ====================

// Stores media that couldn't be identified but was captured

const UnidentifiedMedia = sequelize.define('UnidentifiedMedia', {

    tempId: { 

        type: DataTypes.STRING,

        unique: true,

        allowNull: false

    },

    senderJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    chatJid: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    mediaPath: { 

        type: DataTypes.STRING,

        allowNull: false

    },

    mediaUrl: { 

        type: DataTypes.STRING 

    },

    mimeType: { 

        type: DataTypes.STRING 

    },

    fileSize: { 

        type: DataTypes.INTEGER 

    },

    capturedAt: { 

        type: DataTypes.DATE,

        defaultValue: DataTypes.NOW

    },

    forwardedToOwner: { 

        type: DataTypes.BOOLEAN,

        defaultValue: false

    }

});

// ==================== WARNING MODEL ====================

const Warning = sequelize.define('Warning', {

    userJid: { 

        type: DataTypes.STRING 

    },

    groupJid: { 

        type: DataTypes.STRING 

    },

    reason: { 

        type: DataTypes.TEXT 

    },

    issuedBy: { 

        type: DataTypes.STRING 

    },

    issuedAt: { 

        type: DataTypes.DATE, 

        defaultValue: DataTypes.NOW 

    }

});

// ==================== COMMAND STATS MODEL ====================

const CommandStat = sequelize.define('CommandStat', {

    command: { 

        type: DataTypes.STRING 

    },

    userJid: { 

        type: DataTypes.STRING 

    },

    groupJid: { 

        type: DataTypes.STRING 

    },

    executedAt: { 

        type: DataTypes.DATE, 

        defaultValue: DataTypes.NOW 

    }

});

// ==================== MEDIA STATS MODEL (New) ====================

const MediaStat = sequelize.define('MediaStat', {

    type: { 

        type: DataTypes.STRING 

    }, // 'viewonce', 'deleted', 'status', 'normal'

    count: { 

        type: DataTypes.INTEGER, 

        defaultValue: 0 

    },

    lastCapture: { 

        type: DataTypes.DATE 

    }

});

// ==================== EXPORTS ====================

module.exports = {

    sequelize,

    User,

    Group,

    Setting,

    Message,

    ViewOnceCapture,

    DeletedMessage,

    UnidentifiedMedia,

    Warning,

    CommandStat,

    MediaStat

};