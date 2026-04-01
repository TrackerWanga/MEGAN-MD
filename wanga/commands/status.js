async function sendButtonMenu(e,n,a,s){var t=require("gifted-btns").sendButtons;try{return await t(e,n,{title:a.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a.text,footer:a.footer||"> created by wanga",image:a.image?{url:a.image}:null,buttons:a.buttons||[]},{quoted:s})}catch(t){console.error("Button error:",t),await e.sendMessage(n,{text:a.text},{quoted:s})}}let config=require("../../megan/config"),timeUtils=require("../../megan/lib/timeUtils"),commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png";commands.push({name:"statuscheck",description:"Check current status feature settings",aliases:["sc","statuscfg"],async execute({msg:t,from:e,sender:n,bot:a,sock:s,react:o,isOwner:i,ownerManager:u}){let r=i;u&&!r&&(r=u.isOwner(n));var i=await a.db.getSetting("status_auto_view","on"),u=await a.db.getSetting("status_auto_react","off"),l=await a.db.getSetting("status_auto_download","off"),_=await a.db.getSetting("status_react_emojis","💛,❤️,💜,💙,👍,🔥");await sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📱 *STATUS FEATURE SETTINGS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`_👑 Owner:_ ${a.config.OWNER_NUMBER}
`+`_👤 Your Number:_ ${n.match(/(\d+)/)?.[1]||"unknown"}
`+`_🔑 Is Owner:_ ${r?"✅ YES":"❌ NO"}

`+`_👁️ Auto-View Status:_ ${"on"===i?"✅ ON":"❌ OFF"}
`+`_❤️ Auto-React Status:_ ${"on"===u?"✅ ON":"❌ OFF"}
`+`_📥 Auto-Download Status:_ ${"on"===l?"✅ ON":"❌ OFF"}

`+`_😊 Status React Emojis:_
${_}

`+`*To change settings (Owner only):*
`+`• Old style: .set statusview on/off
`+`• New style: .autoviewstatus on/off
`+`• .set statusreact on/off OR .autoreactstatus on/off
`+`• .set statusdownload on/off OR .autodownloadstatus on/off
`+`• .set statusemojis 💛,❤️,💜

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),o&&await o("✅")}}),commands.push({name:"set",description:"Change status settings (Owner only) - Old style",async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,isOwner:u,ownerManager:r}){var l=u;return(r&&!u?r.isOwner(n):l)?a.length<2?sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📝 *Usage:*
━━━━━━━━━━━━━━━━━━━
.set statusview on/off
.set statusreact on/off
.set statusdownload on/off
.set statusemojis 💛,❤️,💜

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t):(u=a[0].toLowerCase(),r=a.slice(1).join(" "),"statusview"===u?(await s.db.setSetting("status_auto_view",l="on"===r?"on":"off"),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Status auto-view set to:* ${"on"==l?"ON":"OFF"}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):"statusreact"===u?(await s.db.setSetting("status_auto_react",a="on"===r?"on":"off"),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Status auto-react set to:* ${"on"==a?"ON":"OFF"}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):"statusdownload"===u?(await s.db.setSetting("status_auto_download",l="on"===r?"on":"off"),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Status auto-download set to:* ${"on"==l?"ON":"OFF"}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):"statusemojis"===u?(await s.db.setSetting("status_react_emojis",r),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Status react emojis set to:* ${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Unknown setting:* ${u}
_Available:_ statusview, statusreact, statusdownload, statusemojis

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(a=s.config.OWNER_NUMBER,sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner only command!*
━━━━━━━━━━━━━━━━━━━
_Your number:_ ${n.match(/(\d+)/)?.[1]||"unknown"}
_Owner number:_ ${a}

_Use .statuscheck to see your status._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"autoviewstatus",description:"Toggle auto-view status (on/off) - Owner Only",aliases:["avs"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,reply:u,isOwner:r,ownerManager:l}){var _=r;return(l&&!r?l.isOwner(n):_)?0===a.length?(r="on"===await s.db.getSetting("status_auto_view","on")?"ON":"OFF",await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`👁️ *AUTO VIEW STATUS*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${r}*
_Options:_ on, off

_Usage:_ ${config.PREFIX}autoviewstatus on/off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(l=a[0].toLowerCase(),["on","off"].includes(l)?(await i("🔄"),await s.db.setSetting("status_auto_view",l),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *AUTO VIEW UPDATED*
━━━━━━━━━━━━━━━━━━━
_Auto-view status turned *${l}*_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),u(`❌ *Invalid Option*

Use: on or off

> created by wanga`))):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"autodownloadstatus",description:"Toggle auto-download status (on/off) - Owner Only",aliases:["ads"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,reply:u,isOwner:r,ownerManager:l}){var _=r;return(l&&!r?l.isOwner(n):_)?0===a.length?(r="on"===await s.db.getSetting("status_auto_download","off")?"ON":"OFF",await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📥 *AUTO DOWNLOAD STATUS*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${r}*
_Options:_ on, off

_Usage:_ ${config.PREFIX}autodownloadstatus on/off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(l=a[0].toLowerCase(),["on","off"].includes(l)?(await i("🔄"),await s.db.setSetting("status_auto_download",l),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *AUTO DOWNLOAD UPDATED*
━━━━━━━━━━━━━━━━━━━
_Auto-download status turned *${l}*_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),u(`❌ *Invalid Option*

Use: on or off

> created by wanga`))):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"autoreactstatus",description:"Toggle auto-react status (on/off) - Owner Only",aliases:["ars"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,reply:u,isOwner:r,ownerManager:l}){var _=r;return(l&&!r?l.isOwner(n):_)?0===a.length?(r="on"===await s.db.getSetting("status_auto_react","off")?"ON":"OFF",await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❤️ *AUTO REACT STATUS*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${r}*
_Options:_ on, off

_Usage:_ ${config.PREFIX}autoreactstatus on/off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(l=a[0].toLowerCase(),["on","off"].includes(l)?(await i("🔄"),await s.db.setSetting("status_auto_react",l),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *AUTO REACT UPDATED*
━━━━━━━━━━━━━━━━━━━
_Auto-react status turned *${l}*_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),u(`❌ *Invalid Option*

Use: on or off

> created by wanga`))):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"setstatusemoji",description:"Set emojis for status reactions - Owner Only",aliases:["sse"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,isOwner:u,ownerManager:r}){var l=u;return(r&&!u?r.isOwner(n):l)?0===a.length?(u=await s.db.getSetting("status_react_emojis","💛,❤️,💜,💙,👍,🔥"),await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎯 *STATUS REACTION EMOJIS*
━━━━━━━━━━━━━━━━━━━
_Current:_ ${u}
_Usage:_ ${config.PREFIX}setstatusemoji ❤️,👍,🔥,💯
_Example:_ ${config.PREFIX}setstatusemoji ❤️,👍,🔥,✨

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(r=a.join(" "),await i("🔄"),await s.db.setSetting("status_react_emojis",r),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *EMOJIS UPDATED*
━━━━━━━━━━━━━━━━━━━
_Status reaction emojis set to:_
${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"antideletestatus",description:"Toggle anti-delete for status (on/off) - Owner Only",aliases:["ads2"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,reply:u,isOwner:r,ownerManager:l}){var _=r;return(l&&!r?l.isOwner(n):_)?0===a.length?(r="on"===await s.db.getSetting("status_anti_delete","off")?"ON":"OFF",await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🚨 *ANTI-DELETE STATUS*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${r}*
_When ON, deleted statuses will be sent to your DM_

_Options:_ on, off
_Usage:_ ${config.PREFIX}antideletestatus on/off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(l=a[0].toLowerCase(),["on","off"].includes(l)?(await i("🔄"),await s.db.setSetting("status_anti_delete",l),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *ANTI-DELETE UPDATED*
━━━━━━━━━━━━━━━━━━━
_Anti-delete status turned *${l}*_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),u(`❌ *Invalid Option*

Use: on or off

> created by wanga`))):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"autoviewonce",description:"Toggle auto-save view once media (on/off) - Owner Only",aliases:["avo"],async execute({msg:t,from:e,sender:n,args:a,bot:s,sock:o,react:i,reply:u,isOwner:r,ownerManager:l}){var _=r;return(l&&!r?l.isOwner(n):_)?0===a.length?(r="on"===await s.db.getSetting("autoviewonce","on")?"ON":"OFF",await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *AUTO VIEW ONCE*
━━━━━━━━━━━━━━━━━━━
_Current:_ *${r}*
_When ON, view once media will be saved to your DM_

_Options:_ on, off
_Usage:_ ${config.PREFIX}autoviewonce on/off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(l=a[0].toLowerCase(),["on","off"].includes(l)?(await i("🔄"),await s.db.setSetting("autoviewonce",l),await i("✅"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *AUTO VIEW ONCE UPDATED*
━━━━━━━━━━━━━━━━━━━
_Auto view once turned *${l}*_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("❌"),u(`❌ *Invalid Option*

Use: on or off

> created by wanga`))):(await i("❌"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"statushelp",text:"📱 Status Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))}}),commands.push({name:"statushelp",description:"Show all status-related commands",aliases:["helpstatus"],async execute({msg:t,from:e,sock:n,react:a}){var s=config.PREFIX;await sendButtonMenu(n,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📱 *STATUS COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*👑 OWNER ONLY SETTINGS*
`+`_${s}statuscheck_ - Show current settings
`+`_${s}set statusview on/off_ - Old style
`+`_${s}autoviewstatus on/off_ - New style
`+`_${s}set statusreact on/off_ - Old style
`+`_${s}autoreactstatus on/off_ - New style
`+`_${s}set statusdownload on/off_ - Old style
`+`_${s}autodownloadstatus on/off_ - New style
`+`_${s}set statusemojis ❤️,👍,🔥_ - Set reaction emojis
`+`_${s}setstatusemoji ❤️,👍,🔥_ - New style
`+`_${s}antideletestatus on/off_ - Anti-delete for status
`+`_${s}autoviewonce on/off_ - Auto-save view once

`+`*📝 NOTE:*
`+`_Both old and new style commands work!_
`+`_They update the same database settings_

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await a("✅")}}),module.exports={commands:commands};