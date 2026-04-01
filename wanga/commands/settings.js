async function sendButtonMenu(e,n,a,i){var t=require("gifted-btns").sendButtons;try{return await t(e,n,{title:a.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a.text,footer:a.footer||"> created by wanga",image:a.image?{url:a.image}:null,buttons:a.buttons||[]},{quoted:i})}catch(t){console.error("Button error:",t),await e.sendMessage(n,{text:a.text},{quoted:i})}}let config=require("../../megan/config"),timeUtils=require("../../megan/lib/timeUtils"),downloadMediaMessage=require("gifted-baileys").downloadMediaMessage,commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png",autoBioInterval=(commands.push({name:"setprefix",description:"Change bot command prefix (Owner Only)",aliases:["prefix"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,reply:o,isOwner:r}){return r?0===n.length?(r=await a.db.getSetting("prefix",config.PREFIX),await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔧 *Set Prefix*
━━━━━━━━━━━━━━━━━━━
_Current:_ \`${r}\`
_Usage:_ ${config.PREFIX}setprefix <symbol>
_Example:_ ${config.PREFIX}setprefix !

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):1!==(r=n[0]).length?(await s("❌"),o(`❌ *Prefix must be a single character!*

> created by wanga`)):(await s("🔄"),await a.db.setSetting("prefix",r),config.PREFIX=r,await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Prefix Updated*
━━━━━━━━━━━━━━━━━━━
_New prefix:_ \`${r}\`

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setbotname",description:"Change bot display name (Owner Only)",aliases:["botname"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,isOwner:o}){return o?0===n.length?(o=await a.db.getSetting("bot_name",config.BOT_NAME),await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📛 *Set Bot Name*
━━━━━━━━━━━━━━━━━━━
_Current:_ ${o}
_Usage:_ ${config.PREFIX}setbotname <new name>
_Example:_ ${config.PREFIX}setbotname MEGAN-PRO

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(o=n.join(" "),await s("🔄"),await a.db.setSetting("bot_name",o),config.BOT_NAME=o,await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Bot Name Updated*
━━━━━━━━━━━━━━━━━━━
_New name:_ *${o}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setmode",description:"Set bot mode (public/private) - Owner Only",aliases:["mode"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,reply:o,isOwner:r}){return r?0===n.length?(r=await a.db.getSetting("mode","public"),await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚙️ *Set Mode*
━━━━━━━━━━━━━━━━━━━
_Current:_ ${"public"===r?"🌍 PUBLIC":"🔒 PRIVATE"}
_Options:_ public, private
_Usage:_ ${config.PREFIX}setmode public/private

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):"public"!==(r=n[0].toLowerCase())&&"private"!==r?(await s("❌"),o(`❌ *Invalid mode!* Use: public or private

> created by wanga`)):(await s("🔄"),await a.db.setSetting("mode",r),config.MODE=r,await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Mode Updated*
━━━━━━━━━━━━━━━━━━━
_New mode:_ *${"public"===r?"🌍 PUBLIC":"🔒 PRIVATE"}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setdefaultdisappear",description:"Set default disappearing messages (24h/7d/90d/off) - Owner Only",aliases:["defaultdisappear","setdisappear"],async execute({msg:n,from:a,args:t,bot:i,sock:s,react:o,reply:e,isOwner:r}){if(!r)return await o("❌"),sendButtonMenu(s,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n);if(0===t.length){let t=await i.db.getSetting("default_disappear",0),e="off";return 86400===t?e="24 hours":604800===t?e="7 days":7776e3===t&&(e="90 days"),await o("ℹ️"),sendButtonMenu(s,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⏳ *Default Disappearing Messages*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${e}*
_Options:_ 24h, 7d, 90d, off
_Usage:_ ${config.PREFIX}setdefaultdisappear <24h/7d/90d/off>
_Example:_ ${config.PREFIX}setdefaultdisappear 7d

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n)}let u=t[0].toLowerCase(),g=0,l="off";if("24h"===u)g=86400,l="24 hours";else if("7d"===u)g=604800,l="7 days";else if("90d"===u)g=7776e3,l="90 days";else if("off"!==u)return await o("❌"),e(`❌ *Invalid option!* Use: 24h, 7d, 90d, or off

> created by wanga`);await o("🔄"),await i.db.setSetting("default_disappear",g),await o("✅"),await sendButtonMenu(s,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Default Disappearing Messages Updated*
━━━━━━━━━━━━━━━━━━━
_New setting:_ *${l}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n)}}),commands.push({name:"resetsettings",description:"Reset core settings to default (Owner Only)",aliases:["resetcore"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,isOwner:o}){return o?"--force"!==n[0]?.toLowerCase()?(await s("⚠️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *Warning:* This will reset CORE settings to default!
━━━━━━━━━━━━━━━━━━━
_To confirm:_ ${config.PREFIX}resetsettings --force

_Resets:_ prefix, bot name, mode, disappear settings

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("🔄"),await a.db.setSetting("prefix","."),await a.db.setSetting("bot_name",config.BOT_NAME),await a.db.setSetting("mode","public"),await a.db.setSetting("default_disappear",0),config.PREFIX=".",config.MODE="public",await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Core Settings Reset*
━━━━━━━━━━━━━━━━━━━
_Defaults restored:_
• Prefix: .
• Bot Name: ${config.BOT_NAME}
• Mode: public
• Disappear: off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setownername",description:"Set bot owner name (Owner Only)",aliases:["setowner","ownername"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,isOwner:o}){return o?0===n.length?(o=await a.db.getSetting("owner_name",config.OWNER_NAME),await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`👤 *Set Owner Name*
━━━━━━━━━━━━━━━━━━━
_Current:_ ${o}
_Usage:_ ${config.PREFIX}setownername <new name>
_Example:_ ${config.PREFIX}setownername Wanga

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(o=n.join(" "),await s("🔄"),await a.db.setSetting("owner_name",o),config.OWNER_NAME=o,await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Owner Name Updated*
━━━━━━━━━━━━━━━━━━━
_New name:_ *${o}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setownerphone",description:"Change owner phone number (Owner Only)",aliases:["ownerphone"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,reply:o,isOwner:r}){return r?0===n.length?(r=await a.db.getSetting("owner_number",config.OWNER_NUMBER),await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📞 *Set Owner Phone*
━━━━━━━━━━━━━━━━━━━
_Current:_ ${r}
_Usage:_ ${config.PREFIX}setownerphone <number>
_Example:_ ${config.PREFIX}setownerphone 254712345678

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(r=n[0].replace(/\D/g,"")).length<10?(await s("❌"),o(`❌ *Invalid phone number!* Include country code (e.g., 254...)

> created by wanga`)):(await s("🔄"),await a.db.setSetting("owner_number",r),config.OWNER_NUMBER=r,await s("✅"),void await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Owner Phone Updated*
━━━━━━━━━━━━━━━━━━━
_New number:_ ${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setbio",description:"Set bot about/bio (Owner Only)",aliases:["setabout","setstatus"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,reply:o,isOwner:r}){if(!r)return await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);if(0===n.length)return await s("ℹ️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📝 *Set Bio*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}setbio <your bio>
_Example:_ ${config.PREFIX}setbio Megan Bot - Your friendly assistant

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);r=n.join(" ");await s("📝");try{await i.updateProfileStatus(r),await a.db.setSetting("bio",r),await s("✅"),await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Bio Updated*
━━━━━━━━━━━━━━━━━━━
_New bio:_
${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}catch(t){await s("❌"),await o(`❌ *Failed to update bio:* ${t.message}

> created by wanga`)}}}),null),AUTO_BIO_MESSAGES={earlyMorning:["🌅 Rise and shine!","☕ Good morning!","✨ Early bird gets the worm!"],morning:["☀️ Good morning!","📚 Time to learn!","🎯 Stay focused!"],afternoon:["🌤️ Good afternoon!","⚡ Keep pushing!","💡 Stay productive!"],evening:["🌆 Good evening!","🌟 Great job today!","🌙 Time to unwind!"],night:["🌙 Good night!","⭐ Sweet dreams!","💤 Rest well!"],midnight:["🕛 Midnight thoughts!","🌌 Dream big!","✨ You're amazing!"]};commands.push({name:"autobio",description:"Auto-update bio based on time (Owner Only)",aliases:["autobio"],async execute({msg:t,from:e,args:n,bot:a,sock:i,react:s,isOwner:o}){if(!o)return await s("❌"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);o=n[0]?.toLowerCase();if("stop"===o||"off"===o)return autoBioInterval?(clearInterval(autoBioInterval),autoBioInterval=null,await a.db.setSetting("autobio","off"),await s("⏹️"),sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⏹️ *Auto-bio stopped*
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *Auto-bio is not running*
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);if("start"===o||"on"===o||!o){n=await a.db.getSetting("autobio","off");if(autoBioInterval||"on"===n)return sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *Auto-bio is already running*
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await s("🔄");o=async()=>{try{let t=(new Date).getHours(),e=AUTO_BIO_MESSAGES.midnight;4<=t&&t<6?e=AUTO_BIO_MESSAGES.earlyMorning:6<=t&&t<12?e=AUTO_BIO_MESSAGES.morning:12<=t&&t<17?e=AUTO_BIO_MESSAGES.afternoon:17<=t&&t<20?e=AUTO_BIO_MESSAGES.evening:(20<=t||t<4)&&(e=AUTO_BIO_MESSAGES.night);var n=e[Math.floor(Math.random()*e.length)];await i.updateProfileStatus(n)}catch(t){console.error("Auto-bio update error:",t)}};await o(),autoBioInterval=setInterval(o,36e5),await a.db.setSetting("autobio","on"),await s("✅"),await sendButtonMenu(i,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *Auto-Bio Started*
━━━━━━━━━━━━━━━━━━━
_⏰ Updates every hour_

_To stop:_ ${config.PREFIX}autobio stop

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"setbotpic",description:"Set bot profile picture (Owner Only)",aliases:["setpp","setprofilepic"],async execute({msg:a,from:i,args:s,sock:o,react:r,reply:e,isOwner:t}){if(!t)return await r("❌"),sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);await r("🖼️");try{let t=null,e,n=a.message?.extendedTextMessage?.contextInfo?.quotedMessage;if(n?.imageMessage?t=await downloadMediaMessage({key:a.key,message:n},"buffer",{},{logger:console}):0<s.length&&s[0].startsWith("http")?(e=await require("axios").get(s[0],{responseType:"arraybuffer",timeout:3e4}),t=Buffer.from(e.data)):a.message?.imageMessage&&(t=await downloadMediaMessage(a,"buffer",{},{logger:console})),!t)return await r("❌"),sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🖼️ *Set Profile Picture*
━━━━━━━━━━━━━━━━━━━
_Usage:_
• Reply to an image with ${config.PREFIX}setbotpic
• ${config.PREFIX}setbotpic <image url>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);await o.updateProfilePicture(o.user.id,t),await r("✅"),await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Profile Picture Updated*
━━━━━━━━━━━━━━━━━━━
_🖼️ Bot profile picture changed successfully_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a)}catch(t){await r("❌"),await e(`❌ *Failed to update profile picture:* ${t.message}

> created by wanga`)}}}),commands.push({name:"removepp",description:"Remove bot profile picture (Owner Only)",aliases:["removepic","delpp"],async execute({msg:t,from:e,sock:n,react:a,reply:i,isOwner:s}){if(!s)return await a("❌"),sendButtonMenu(n,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await a("🗑️");try{await n.removeProfilePicture(n.user.id),await a("✅"),await sendButtonMenu(n,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Profile Picture Removed*
━━━━━━━━━━━━━━━━━━━
_🗑️ Bot profile picture has been removed_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}catch(t){await a("❌"),await i(`❌ *Failed to remove profile picture:* ${t.message}

> created by wanga`)}}}),commands.push({name:"mypic",description:"Get your own profile picture",aliases:["mypp","getmypp"],async execute({msg:e,from:n,sender:a,sock:i,react:s}){await s("🖼️");try{var t=await i.profilePictureUrl(a,"image");await i.sendMessage(n,{image:{url:t},caption:`🖼️ *Your Profile Picture*

_👤 @${a.split("@")[0]}_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,mentions:[a]},{quoted:e}),await s("✅")}catch(t){await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *No profile picture found* for @${a.split("@")[0]}
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}}}),commands.push({name:"myabout",description:"Get your own about/bio",aliases:["mybio","getmyabout"],async execute({msg:e,from:n,sender:t,sock:a,react:i}){await i("📝");try{var{status:s,setAt:o}=await a.fetchStatus(t),r=new Date(o).toLocaleString("en-KE",{dateStyle:"full",timeStyle:"short"});await sendButtonMenu(a,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📝 *Your About Info*
━━━━━━━━━━━━━━━━━━━
_👤 User:_ @${t.split("@")[0]}
_💬 About:_ ${s}
_🕒 Set at:_ ${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}catch(t){await i("❌"),await sendButtonMenu(a,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Could not fetch about info.* You may have privacy settings enabled.
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e)}}}),commands.push({name:"block",description:"Block a user (Owner Only)",aliases:["blockuser"],async execute({msg:t,from:e,args:n,sock:a,react:i,reply:s,isOwner:o}){if(!o)return await i("❌"),sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null;if(t.message?.extendedTextMessage?.contextInfo?.participant?r=t.message.extendedTextMessage.contextInfo.participant:t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?r=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:0<n.length&&(o=n[0].replace(/\D/g,""))&&10<=o.length&&(r=o+"@s.whatsapp.net"),!r)return await i("❌"),sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔨 *Block User*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}block <@user/phone>
_Or reply to their message with ${config.PREFIX}block

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await i("🔨");try{await a.updateBlockStatus(r,"block"),await i("✅"),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔨 *User Blocked*
━━━━━━━━━━━━━━━━━━━
_👤 User:_ @${r.split("@")[0]}
_🚫 Status:_ Blocked

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}catch(t){await i("❌"),await s(`❌ *Failed to block user:* ${t.message}

> created by wanga`)}}}),commands.push({name:"unblock",description:"Unblock a user (Owner Only)",aliases:["unblockuser"],async execute({msg:t,from:e,args:n,sock:a,react:i,reply:s,isOwner:o}){if(!o)return await i("❌"),sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null;if(t.message?.extendedTextMessage?.contextInfo?.participant?r=t.message.extendedTextMessage.contextInfo.participant:t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?r=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:0<n.length&&(o=n[0].replace(/\D/g,""))&&10<=o.length&&(r=o+"@s.whatsapp.net"),!r)return await i("❌"),sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔓 *Unblock User*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}unblock <@user/phone>
_Or reply to their message with ${config.PREFIX}unblock

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await i("🔓");try{await a.updateBlockStatus(r,"unblock"),await i("✅"),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔓 *User Unblocked*
━━━━━━━━━━━━━━━━━━━
_👤 User:_ @${r.split("@")[0]}
_✅ Status:_ Unblocked

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}catch(t){await i("❌"),await s(`❌ *Failed to unblock user:* ${t.message}

> created by wanga`)}}}),commands.push({name:"listblocked",description:"List all blocked users",aliases:["blocklist","blocked"],async execute({msg:t,from:e,sock:a,react:i,reply:n}){await i("📋");try{var s=await a.fetchBlocklist();if(!s||0===s.length)return sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📋 *No blocked users found.*
━━━━━━━━━━━━━━━━━━━

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let n=`📋 *Blocked Users (${s.length})*
━━━━━━━━━━━━━━━━━━━

`;s.forEach((t,e)=>{n+=`${e+1}. @${t.split("@")[0]}\n`}),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await i("✅")}catch(t){await i("❌"),await n(`❌ *Failed to fetch blocklist:* ${t.message}

> created by wanga`)}}}),commands.push({name:"settings",description:"View all core bot settings",aliases:["coresettings"],async execute({msg:t,from:e,bot:n,sock:a,react:i}){await i("⚙️");let s=await n.db.getSetting("prefix",config.PREFIX),o=await n.db.getSetting("bot_name",config.BOT_NAME),r=await n.db.getSetting("mode",config.MODE),u=await n.db.getSetting("default_disappear",0),g="off";86400===u?g="24 hours":604800===u?g="7 days":7776e3===u&&(g="90 days"),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚙️ *Core Bot Settings*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`_🕐 Time:_ ${await timeUtils.getCurrentTimeString(n.db)}
`+`_🔧 Prefix:_ \`${s}\`
`+`_📛 Bot Name:_ ${o}
`+`_⚡ Mode:_ ${"public"===r?"🌍 PUBLIC":"🔒 PRIVATE"}
`+`_⏳ Default Disappear:_ ${g}

`+`*For more:*
`+`• ${s}features - Feature toggles
`+`• ${s}statuscheck - Status settings
`+`• ${s}privacysettings - Privacy settings
`+`• ${s}settingshelp - All settings commands

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"settingshelp",text:"⚙️ Settings Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await i("✅")}}),commands.push({name:"privacysettings",description:"View privacy settings",aliases:["privacy","privacystatus"],async execute({msg:t,from:e,bot:n,sock:a,react:i}){await i("🔍"),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *Privacy Settings*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`_👁️ Last Seen:_ ${await n.db.getSetting("lastseen","all")}
`+`_🖼️ Profile Picture:_ ${await n.db.getSetting("profilepic","all")}
`+`_📱 Status:_ ${await n.db.getSetting("statusprivacy","all")}
`+`_✅ Read Receipts:_ ${await n.db.getSetting("readreceipts","all")}
`+`_🟢 Online Status:_ ${await n.db.getSetting("onlineprivacy","all")}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"settings",text:"⚙️ Settings"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await i("✅")}}),commands.push({name:"settingshelp",description:"Show available core settings commands",aliases:["helpsettings"],async execute({msg:t,from:e,sock:n,react:a}){var i=config.PREFIX;await sendButtonMenu(n,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚙️ *Settings Commands*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*CORE (Owner)*
`+`_${i}setprefix <symbol>_
`+`_${i}setbotname <name>_
`+`_${i}setmode <public/private>_
`+`_${i}setdefaultdisappear <24h/7d/90d/off>_
`+`_${i}resetsettings --force_

`+`*PROFILE (Owner)*
`+`_${i}setownername <name>_
`+`_${i}setownerphone <number>_
`+`_${i}setbio <text>_
`+`_${i}autobio start/stop_
`+`_${i}setbotpic [image/url]_
`+`_${i}removepp_

`+`*BLOCKING (Owner)*
`+`_${i}block <@user>_
`+`_${i}unblock <@user>_
`+`_${i}listblocked_

`+`*PUBLIC*
`+`_${i}settings_ - View core
`+`_${i}privacysettings_ - View privacy
`+`_${i}mypic_ - Your profile pic
`+`_${i}myabout_ - Your bio
`+`_${i}settingshelp_ - This menu

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await a("✅")}}),module.exports={commands:commands};