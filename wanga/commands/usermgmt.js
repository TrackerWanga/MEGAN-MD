async function sendButtonMenu(e,n,a,s){var t=require("gifted-btns").sendButtons;try{return await t(e,n,{title:a.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a.text,footer:a.footer||"> created by wanga",image:a.image?{url:a.image}:null,buttons:a.buttons||[]},{quoted:s})}catch(t){console.error("Button error:",t),await e.sendMessage(n,{text:a.text},{quoted:s})}}let config=require("../../megan/config"),commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png",extractPhone=t=>{if(!t)return null;let e=t.replace("@s.whatsapp.net","");return(e=e.replace(/\D/g,""))||null};commands.push({name:"blacklist",description:"Blacklist a user (add/remove) - Owner Only",aliases:["bl"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);var r,u=n[0]?.toLowerCase();let o=null;return t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?o=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:n[1]&&(n=extractPhone(n[1]))&&10<=n.length&&(o=n+"@s.whatsapp.net"),u&&["add","remove"].includes(u)&&o?(n=o.split("@")[0],r=await a.db.getSetting("blacklist",[]),"add"===u?r.includes(o)?(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *ALREADY BLACKLISTED*
━━━━━━━━━━━━━━━━━━━
_@${n} is already in the blacklist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(r.push(o),await a.db.setSetting("blacklist",r),await i("✅"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *BLACKLIST ADDED*
━━━━━━━━━━━━━━━━━━━
_@${n} has been added to the blacklist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):-1<(u=r.indexOf(o))?(r.splice(u,1),await a.db.setSetting("blacklist",r),await i("✅"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *BLACKLIST REMOVED*
━━━━━━━━━━━━━━━━━━━
_@${n} has been removed from the blacklist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *NOT IN BLACKLIST*
━━━━━━━━━━━━━━━━━━━
_@${n} is not in the blacklist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))):sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🚫 *BLACKLIST*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}blacklist add <@user/phone>
${config.PREFIX}blacklist remove <@user/phone>

_Blacklisted users cannot use the bot._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}),commands.push({name:"whitelist",description:"Whitelist a user (add/remove) - Owner Only",aliases:["wl"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);var r,u=n[0]?.toLowerCase();let o=null;return t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?o=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:n[1]&&(n=extractPhone(n[1]))&&10<=n.length&&(o=n+"@s.whatsapp.net"),u&&["add","remove"].includes(u)&&o?(n=o.split("@")[0],r=await a.db.getSetting("whitelist",[]),"add"===u?r.includes(o)?(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *ALREADY WHITELISTED*
━━━━━━━━━━━━━━━━━━━
_@${n} is already in the whitelist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(r.push(o),await a.db.setSetting("whitelist",r),await i("✅"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *WHITELIST ADDED*
━━━━━━━━━━━━━━━━━━━
_@${n} has been added to the whitelist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):-1<(u=r.indexOf(o))?(r.splice(u,1),await a.db.setSetting("whitelist",r),await i("✅"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *WHITELIST REMOVED*
━━━━━━━━━━━━━━━━━━━
_@${n} has been removed from the whitelist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *NOT IN WHITELIST*
━━━━━━━━━━━━━━━━━━━
_@${n} is not in the whitelist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))):sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *WHITELIST*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}whitelist add <@user/phone>
${config.PREFIX}whitelist remove <@user/phone>

_Whitelisted users bypass blacklist._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}),commands.push({name:"listblacklist",description:"Show all blacklisted users",aliases:["blacklistlist","bllist"],async execute({msg:t,from:e,bot:n,sock:a,react:s}){await s("📋");n=await n.db.getSetting("blacklist",[]);if(0===n.length)return sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📋 *BLACKLIST*
━━━━━━━━━━━━━━━━━━━
_The blacklist is currently empty._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let i=`🚫 *BLACKLISTED USERS*
━━━━━━━━━━━━━━━━━━━
_Total:_ ${n.length}

`;n.forEach((t,e)=>{i+=`${e+1}. @${t.split("@")[0]}\n`}),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:i+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}}),commands.push({name:"listwhitelist",description:"Show all whitelisted users",aliases:["whitelistlist","wllist"],async execute({msg:t,from:e,bot:n,sock:a,react:s}){await s("📋");n=await n.db.getSetting("whitelist",[]);if(0===n.length)return sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📋 *WHITELIST*
━━━━━━━━━━━━━━━━━━━
_The whitelist is currently empty._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let i=`✅ *WHITELISTED USERS*
━━━━━━━━━━━━━━━━━━━
_Total:_ ${n.length}

`;n.forEach((t,e)=>{i+=`${e+1}. @${t.split("@")[0]}\n`}),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:i+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}}),commands.push({name:"muteuser",description:"Mute a user for specified minutes - Owner Only",aliases:["mute"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null,o=60;if(!(r=t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?t.message.extendedTextMessage.contextInfo.mentionedJid[0]:null)||n.length<1)return sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔇 *MUTE USER*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}muteuser <@user> [minutes]

_Example:_
${config.PREFIX}muteuser @user 30

_Mutes user for specified minutes (default: 60)._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);1<n.length&&(o=parseInt(n[1]),isNaN(o)||o<1)&&(o=60);var u=r.split("@")[0],n=Date.now()+60*o*1e3,m=await a.db.getSetting("muted",{});return m[r]=n,await a.db.setSetting("muted",m),await i("🔇"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔇 *USER MUTED*
━━━━━━━━━━━━━━━━━━━
_@${u} has been muted for ${o} minute(s)._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}),commands.push({name:"unmuteuser",description:"Unmute a user - Owner Only",aliases:["unmute"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null;return t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?r=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:n[0]&&(u=extractPhone(n[0]))&&10<=u.length&&(r=u+"@s.whatsapp.net"),r?(n=r.split("@")[0],(u=await a.db.getSetting("muted",{}))[r]?(delete u[r],await a.db.setSetting("muted",u),await i("🔊"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔊 *USER UNMUTED*
━━━━━━━━━━━━━━━━━━━
_@${n} has been unmuted._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *NOT MUTED*
━━━━━━━━━━━━━━━━━━━
_@${n} is not currently muted._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))):sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔊 *UNMUTE USER*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}unmuteuser <@user/phone>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}),commands.push({name:"listmuted",description:"Show all muted users",aliases:["mutedlist"],async execute({msg:t,from:e,bot:n,sock:a,react:s}){await s("📋");var i,u,r,n=await n.db.getSetting("muted",{}),o=Date.now(),m=[];for([i,u]of Object.entries(n))o<u&&(r=Math.round((u-o)/6e4),m.push({jid:i,remaining:r}));if(0===m.length)return sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📋 *MUTED USERS*
━━━━━━━━━━━━━━━━━━━
_No users are currently muted._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let l=`🔇 *MUTED USERS*
━━━━━━━━━━━━━━━━━━━
_Total:_ ${m.length}

`;m.forEach((t,e)=>{l+=`${e+1}. @${t.jid.split("@")[0]} - ${t.remaining} min remaining\n`}),await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:l+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}}),commands.push({name:"warnuser",description:"Warn a user (auto-kick after 3 warnings) - Owner Only",aliases:["warn"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null,o="No reason provided";if(t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length&&(r=t.message.extendedTextMessage.contextInfo.mentionedJid[0],1<n.length)&&(o=n.slice(1).join(" ")),!r)return sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *WARN USER*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}warnuser <@user> [reason]

_Example:_
${config.PREFIX}warnuser @user Spamming

_Auto-kicks after 3 warnings._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);u=r.split("@")[0],n=await a.db.getSetting("warns",{});if(n[r]?(n[r].count+=1,n[r].reasons.push(o)):n[r]={count:1,reasons:[o]},await a.db.setSetting("warns",n),await i("⚠️"),await sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *USER WARNED*
━━━━━━━━━━━━━━━━━━━
_@${u} has been warned (${n[r].count}/3)_
_Reason:_ ${o}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),3<=n[r].count&&e.endsWith("@g.us"))try{await s.groupParticipantsUpdate(e,[r],"remove"),await sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`👋 *USER KICKED*
━━━━━━━━━━━━━━━━━━━
_@${u} has been kicked after reaching 3 warnings._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),delete n[r],await a.db.setSetting("warns",n)}catch(t){console.error("Auto-kick error:",t)}}}),commands.push({name:"resetwarns",description:"Reset warnings for a user - Owner Only",aliases:["rw"],async execute({msg:t,from:e,args:n,bot:a,sock:s,react:i,isOwner:u}){if(!u)return await i("❌"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Owner Only Command*
━━━━━━━━━━━━━━━━━━━
_This command can only be used by the bot owner._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let r=null;return t.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?r=t.message.extendedTextMessage.contextInfo.mentionedJid[0]:n[0]&&(u=extractPhone(n[0]))&&10<=u.length&&(r=u+"@s.whatsapp.net"),r?(n=r.split("@")[0],(u=await a.db.getSetting("warns",{}))[r]?(delete u[r],await a.db.setSetting("warns",u),await i("✅"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *WARNINGS RESET*
━━━━━━━━━━━━━━━━━━━
_Warnings for @${n} have been reset._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(await i("⚠️"),sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⚠️ *NO WARNINGS*
━━━━━━━━━━━━━━━━━━━
_@${n} has no warnings._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t))):sendButtonMenu(s,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *RESET WARNINGS*
━━━━━━━━━━━━━━━━━━━
_Usage:_
${config.PREFIX}resetwarns <@user/phone>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}),commands.push({name:"userinfo",description:"Get detailed user information",aliases:["ui"],async execute({msg:c,from:x,sender:t,args:e,bot:O,sock:f,react:N}){let h=t;c.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?h=c.message.extendedTextMessage.contextInfo.mentionedJid[0]:e[0]&&(t=extractPhone(e[0]))&&10<=t.length&&(h=t+"@s.whatsapp.net"),await N("ℹ️");try{let t=h.split("@")[0],e="Not available",n="Unknown";try{var E=await f.fetchStatus(h);e=E.status||"Not set",n=new Date(E.setAt).toLocaleString()}catch(t){}try{await f.profilePictureUrl(h,"image")}catch(t){}let a=await O.db.getSetting("warns",{}),s=a[h]?.count||0,i=a[h]?.reasons||[],u=await O.db.getSetting("muted",{}),r=!!u[h]&&new Date(u[h])>new Date,o=r?Math.round((u[h]-Date.now())/6e4):0,m=await O.db.getSetting("blacklist",[]),l=await O.db.getSetting("whitelist",[]),g=m.includes(h),d=l.includes(h),_=`👤 *USER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`_📱 Phone:_ ${t}
`+`_🆔 JID:_ ${h}
`+`_📝 About:_ ${e}
`+`_🕒 About set:_ ${n}

`+`*STATUS*
`+`━━━━━━━━━━━━━━━━━━━
`+`_⚠️ Warnings:_ ${s}/3
`;0<s&&(_+=`_📋 Reasons:_ ${i.join(", ")}
`),await sendButtonMenu(f,x,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:_+=`_🔇 Muted:_ ${r?`Yes (${o} min left)`:"No"}
`+`_🚫 Blacklisted:_ ${g?"Yes":"No"}
`+`_✅ Whitelisted:_ ${d?"Yes":"No"}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},c),await N("✅")}catch(t){console.error("User info error:",t),await N("❌"),await sendButtonMenu(f,x,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *ERROR*
━━━━━━━━━━━━━━━━━━━
_Failed to get user info: ${t.message}_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"usermgmt",text:"👥 User Mgmt"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},c)}}}),commands.push({name:"usermgmt",description:"Show all user management commands",aliases:["userhelp","um"],async execute({msg:t,from:e,sock:n,react:a}){var s=config.PREFIX;await sendButtonMenu(n,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`👥 *USER MANAGEMENT COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*👑 OWNER ONLY*
`+`_${s}blacklist add <@user>_ - Blacklist user
`+`_${s}blacklist remove <@user>_ - Unblacklist
`+`_${s}whitelist add <@user>_ - Whitelist user
`+`_${s}whitelist remove <@user>_ - Unwhitelist
`+`_${s}muteuser <@user> [min]_ - Mute user
`+`_${s}unmuteuser <@user>_ - Unmute user
`+`_${s}warnuser <@user> [reason]_ - Warn user
`+`_${s}resetwarns <@user>_ - Reset warnings

`+`*👤 PUBLIC*
`+`_${s}listblacklist_ - Show blacklisted
`+`_${s}listwhitelist_ - Show whitelisted
`+`_${s}listmuted_ - Show muted users
`+`_${s}userinfo <@user>_ - Get user details

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await a("✅")}}),module.exports={commands:commands};