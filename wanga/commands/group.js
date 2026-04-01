async function sendButtonMenu(a,r,t,n){var e=require("gifted-btns").sendButtons;try{return await e(a,r,{title:t.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:t.text,footer:t.footer||"> created by wanga",image:t.image?{url:t.image}:null,buttons:t.buttons||[]},{quoted:n})}catch(e){console.error("Button error:",e),await a.sendMessage(r,{text:t.text},{quoted:n})}}async function sendWithLogo(e,a,r,t=null){await sendButtonMenu(e,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:r,image:BOT_LOGO,buttons:[{id:config.PREFIX+"grouphelp",text:"👥 Group Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}let GroupHelper=require("../../megan/helpers/groupHelper"),config=require("../../megan/config"),downloadMediaMessage=require("gifted-baileys").downloadMediaMessage,commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png";commands.push({name:"creategroup",description:"Create a new WhatsApp group",aliases:["creategc","newgroup"],async execute({msg:e,from:a,args:r,sock:t,react:n,reply:o}){if(r.length<1)return await n("❌"),sendWithLogo(t,a,`📝 *CREATE GROUP*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}creategroup <name> [phone numbers]

_Example:_ ${config.PREFIX}creategroup My Team 254700000000

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e);await n("🔄");try{var i=r[0],s=[config.OWNER_NUMBER+"@s.whatsapp.net"];for(let e=1;e<r.length;e++){var c=GroupHelper.extractPhone(r[e]);c&&10<=c.length&&s.push(c+"@s.whatsapp.net")}await t.groupCreate(i,s),await sendWithLogo(t,a,`✅ *GROUP CREATED*
━━━━━━━━━━━━━━━━━━━
_📛 Name:_ ${i}
_👥 Members:_ ${s.length}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await n("✅")}catch(e){console.error("Create group error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"groupinfo",description:"Get detailed group information",aliases:["ginfo","infogc"],async execute({msg:e,from:a,args:r,sock:t,react:n,reply:o}){let i=a;if(0<r.length){r=r[0];if(r.includes("chat.whatsapp.com")){var s=GroupHelper.extractGroupCode(r);try{var c=await t.groupGetInviteInfo(s);i=c.id}catch(e){return await n("❌"),o(`❌ *Invalid group invite link!*

> created by wanga`)}}else i=r.endsWith("@g.us")?r:r+"@g.us"}if(!GroupHelper.isGroupJid(i))return await n("❌"),o(`❌ *Invalid group ID or link!*

> created by wanga`);await n("ℹ️");try{var d=await t.groupMetadata(i);await sendWithLogo(t,a,GroupHelper.formatGroupInfo(d),e),await n("✅")}catch(e){console.error("Group info error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"groups",description:"List all groups bot is in",aliases:["grouplist","mygroups"],async execute({msg:e,from:a,sock:r,react:t,reply:n}){await t("📋");try{var i=await r.groupFetchAllParticipating(),s=Object.values(i);if(0===s.length)return n(`❌ *Bot is not in any groups.*

> created by wanga`);let o=`*📋 MY GROUPS (${s.length})*

`;s.slice(0,20).forEach((e,a)=>{var r=e.participants.length,t=e.participants.filter(e=>e.admin).length,n=e.announce?"🔒":"🔓";o=(o=o+(a+1+`. ${n} *${e.subject}*
`)+`   👥 ${r} members | 👑 ${t} admins
`)+`   🆔 ${e.id.split("@")[0]}

`}),20<s.length&&(o+=`... and ${s.length-20} more groups
`),await sendWithLogo(r,a,o+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await t("✅")}catch(e){console.error("List groups error:",e),await t("❌"),n(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"participants",description:"List all group participants",aliases:["members","memberlist"],async execute({msg:e,from:a,sock:r,react:t,reply:n}){if(!GroupHelper.isGroupJid(a))return await t("❌"),n(`❌ *This command can only be used in groups!*

> created by wanga`);await t("📋");try{var o=await r.groupMetadata(a),i=await GroupHelper.formatParticipantList(o.participants,r);await sendWithLogo(r,a,`*📋 PARTICIPANTS (${o.participants.length})*

${i}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await t("✅")}catch(e){console.error("Participants error:",e),await t("❌"),n(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"leave",description:"Leave a group",aliases:["exit","leavegc"],async execute({msg:e,from:a,args:r,sock:t,react:n,reply:o}){let i=a;if(!GroupHelper.isGroupJid(a)&&0<r.length){r=r[0];if(r.includes("chat.whatsapp.com")){r=GroupHelper.extractGroupCode(r);try{var s=await t.groupGetInviteInfo(r);i=s.id}catch(e){return await n("❌"),o(`❌ *Invalid group invite link!*

> created by wanga`)}}}if(!GroupHelper.isGroupJid(i))return await n("❌"),o(`❌ *Please use this command in a group or provide a valid link!*

> created by wanga`);await n("👋");try{await t.sendMessage(i,{text:`👋 *${config.BOT_NAME} is leaving this group.*

Thank you for having me!`}),await t.groupLeave(i),GroupHelper.isGroupJid(a)||await sendWithLogo(t,a,`✅ *Successfully left the group.*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await n("✅")}catch(e){console.error("Leave group error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"add",description:"Add members to group",aliases:["addmember","invite"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length&&!e.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length)return await o("❌"),i(`📝 *ADD MEMBERS*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}add @user or ${config.PREFIX}add 254700000000

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔄");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can add members!*

> created by wanga`);var c,d=[],g=e.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];d.push(...g);for(c of t){var p=GroupHelper.getJidFromInput(e,c);p&&!d.includes(p)&&d.push(p)}if(0===d.length)return i(`❌ *No valid participants specified!*

> created by wanga`);var u=await n.groupParticipantsUpdate(a,d,"add");await sendWithLogo(n,a,GroupHelper.formatActionResult("add",u),e),await o("✅")}catch(e){console.error("Add error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"remove",description:"Remove members from group",aliases:["kick","rm"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);await o("🔄");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can remove members!*

> created by wanga`);var c,d=[],g=e.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];d.push(...g),e.message?.extendedTextMessage?.contextInfo?.participant&&d.push(e.message.extendedTextMessage.contextInfo.participant);for(c of t){var p=GroupHelper.getJidFromInput(e,c);p&&!d.includes(p)&&d.push(p)}if(0===d.length)return i(`❌ *No participants specified to remove!*

> created by wanga`);var u=await n.groupParticipantsUpdate(a,d,"remove");await sendWithLogo(n,a,GroupHelper.formatActionResult("remove",u),e),await o("✅")}catch(e){console.error("Remove error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"promote",description:"Promote members to admin",aliases:["makeadmin"],async execute({msg:e,from:a,sender:r,sock:t,react:n,reply:o}){if(!GroupHelper.isGroupJid(a))return await n("❌"),o(`❌ *This command can only be used in groups!*

> created by wanga`);await n("🔄");try{var i,s,c,d=await t.groupMetadata(a);return GroupHelper.canPerformAdminAction(d,r,config.OWNER_NUMBER)?(i=[],s=e.message?.extendedTextMessage?.contextInfo?.mentionedJid||[],i.push(...s),e.message?.extendedTextMessage?.contextInfo?.participant&&i.push(e.message.extendedTextMessage.contextInfo.participant),0===i.length?o(`❌ *No members specified to promote!*

> created by wanga`):(c=await t.groupParticipantsUpdate(a,i,"promote"),await sendWithLogo(t,a,GroupHelper.formatActionResult("promote",c),e),void await n("✅"))):(await n("⚠️"),o(`❌ *Only admins can promote members!*

> created by wanga`))}catch(e){console.error("Promote error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"demote",description:"Demote admins to members",aliases:["removeadmin"],async execute({msg:e,from:a,sender:r,sock:t,react:n,reply:o}){if(!GroupHelper.isGroupJid(a))return await n("❌"),o(`❌ *This command can only be used in groups!*

> created by wanga`);await n("🔄");try{var i,s,c,d=await t.groupMetadata(a);return GroupHelper.canPerformAdminAction(d,r,config.OWNER_NUMBER)?(i=[],s=e.message?.extendedTextMessage?.contextInfo?.mentionedJid||[],i.push(...s),e.message?.extendedTextMessage?.contextInfo?.participant&&i.push(e.message.extendedTextMessage.contextInfo.participant),0===i.length?o(`❌ *No admins specified to demote!*

> created by wanga`):(c=await t.groupParticipantsUpdate(a,i,"demote"),await sendWithLogo(t,a,GroupHelper.formatActionResult("demote",c),e),void await n("✅"))):(await n("⚠️"),o(`❌ *Only admins can demote members!*

> created by wanga`))}catch(e){console.error("Demote error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"tagall",description:"Tag all group members",aliases:["everyone","all"],async execute({msg:o,from:i,sender:s,args:c,sock:d,react:g,reply:a}){if(!GroupHelper.isGroupJid(i))return await g("❌"),a(`❌ *This command can only be used in groups!*

> created by wanga`);await g("🔄");try{let e=(await d.groupMetadata(i)).participants,a=s.split("@")[0],r=GroupHelper.getAllMentions(e),t=(await Promise.all(e.map(async(e,a)=>a+1+". "+await GroupHelper.formatJid(e.id,d)))).slice(0,20).join("\n"),n=`𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆

📝 *Message:* ${0<c.length?c.join(" "):"📢 Attention everyone!"}

👥 *Members (${e.length}):*
`+t;20<e.length&&(n+=`
... and ${e.length-20} more`),n+=`

👤 *By:* @${a}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,await sendWithLogo(d,i,n,o),await d.sendMessage(i,{text:" ",mentions:r},{quoted:o}),await g("✅")}catch(e){console.error("Tagall error:",e),await g("❌"),a(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"hidetag",description:"Send message that secretly tags everyone",aliases:["htag","hidden"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length)return await o("❌"),i(`📝 *HIDE TAG*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}hidetag <message>

_Example:_ ${config.PREFIX}hidetag Meeting at 5pm

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🕵️");try{var s=(await n.groupMetadata(a)).participants,c=r.split("@")[0],d=GroupHelper.getAllMentions(s);await sendWithLogo(n,a,`𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆

${t.join(" ")}

👤 *By:* @${c}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await n.sendMessage(a,{text:" ",mentions:d},{quoted:e}),await o("✅")}catch(e){console.error("Hidetag error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"tagadmins",description:"Tag all group admins",aliases:["admins"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);await o("👑");try{var s=await n.groupMetadata(a),c=s.participants.filter(e=>"admin"===e.admin||"superadmin"===e.admin),d=GroupHelper.getAdminMentions(s.participants),g=r.split("@")[0];if(0===d.length)return await o("⚠️"),i(`⚠️ *No admins found in this group!*

> created by wanga`);var p=(await Promise.all(c.map(async(e,a)=>{var r=await GroupHelper.formatJid(e.id,n);return a+1+`. ${"superadmin"===e.admin?"👑":"👮"} `+r}))).join("\n"),u=`𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆

📝 *Message:* ${0<t.length?t.join(" "):"📢 Attention admins!"}

👑 *Admins (${d.length}):*
${p}

👤 *By:* @${g}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;await sendWithLogo(n,a,u,e),await n.sendMessage(a,{text:" ",mentions:d},{quoted:e}),await o("✅")}catch(e){console.error("Tagadmins error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"setname",description:"Change group name",aliases:["setgcname","setgroupname"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length)return await o("❌"),i(`📝 *SET NAME*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}setname <new name>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔄");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can change group name!*

> created by wanga`);var c=t.join(" "),d=(await n.groupUpdateSubject(a,c),`✅ *NAME UPDATED*
━━━━━━━━━━━━━━━━━━━
_📛 New Name:_ ${c}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await sendWithLogo(n,a,d,e),await o("✅")}catch(e){console.error("Set name error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"setdesc",description:"Change group description",aliases:["setdescription","setgcdesc"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length)return await o("❌"),i(`📝 *SET DESCRIPTION*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}setdesc <description>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔄");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can change group description!*

> created by wanga`);var c=t.join(" "),d=(await n.groupUpdateDescription(a,c),`✅ *DESCRIPTION UPDATED*
━━━━━━━━━━━━━━━━━━━
_📝 New Description:_
${c}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await sendWithLogo(n,a,d,e),await o("✅")}catch(e){console.error("Set description error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"invite",description:"Get group invite link",aliases:["link","gclink"],async execute({msg:e,from:a,sender:r,sock:t,react:n,reply:o}){if(!GroupHelper.isGroupJid(a))return await n("❌"),o(`❌ *This command can only be used in groups!*

> created by wanga`);await n("🔗");try{var i,s,c=await t.groupMetadata(a);return GroupHelper.canPerformAdminAction(c,r,config.OWNER_NUMBER)?(i=t.user?.id?.split(":")[0]+"@s.whatsapp.net",GroupHelper.isAdmin(c.participants,i)?(s="https://chat.whatsapp.com/"+await t.groupInviteCode(a),await sendWithLogo(t,a,`🔗 *INVITE LINK*
━━━━━━━━━━━━━━━━━━━
_📛 Group:_ ${c.subject}
_🔗 Link:_ ${s}

⚠️ Expires in 7 days

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),void await n("✅")):o(`⚠️ *Bot is not an admin!*

Make the bot an admin first.

> created by wanga`)):(await n("⚠️"),o(`❌ *Only admins can get invite link!*

> created by wanga`))}catch(e){console.error("Invite error:",e),await n("❌"),"not-authorized"===e.message||401===e.data?o(`❌ *Bot is not authorized!*

Make sure the bot is an admin in this group.

> created by wanga`):o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"revoke",description:"Revoke and generate new invite link",aliases:["revokelink","newlink"],async execute({msg:e,from:a,sender:r,sock:t,react:n,reply:o}){if(!GroupHelper.isGroupJid(a))return await n("❌"),o(`❌ *This command can only be used in groups!*

> created by wanga`);await n("🔄");try{var i=await t.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(i,r,config.OWNER_NUMBER))return await n("⚠️"),o(`❌ *Only admins can revoke invite link!*

> created by wanga`);var s=t.user?.id?.split(":")[0]+"@s.whatsapp.net";if(!GroupHelper.isAdmin(i.participants,s))return o(`⚠️ *Bot is not an admin!*

Make the bot an admin first.

> created by wanga`);await t.groupRevokeInvite(a);var c="https://chat.whatsapp.com/"+await t.groupInviteCode(a);await sendWithLogo(t,a,`✅ *LINK REVOKED*
━━━━━━━━━━━━━━━━━━━
_📛 Group:_ ${i.subject}
_🔗 New Link:_ ${c}

⚠️ Old link no longer works

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await n("✅")}catch(e){console.error("Revoke error:",e),await n("❌"),"not-authorized"===e.message||401===e.data?o(`❌ *Bot is not authorized!*

Make sure the bot is an admin in this group.

> created by wanga`):o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"join",description:"Join a group using invite link",aliases:["joingroup"],async execute({msg:e,from:a,args:r,sock:t,react:n,reply:o}){var i;if(0===r.length&&e.message?.extendedTextMessage?.contextInfo?.quotedMessage&&(i=((i=e.message.extendedTextMessage.contextInfo.quotedMessage).conversation||i.extendedTextMessage?.text||"").match(/(https?:\/\/)?chat\.whatsapp\.com\/[A-Za-z0-9]+/))&&(r[0]=i[0]),0===r.length)return await n("❌"),o(`📝 *JOIN GROUP*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}join <invite link>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await n("🔄");try{var s=r[0];if(!s.includes("chat.whatsapp.com"))return o(`❌ *Invalid WhatsApp group link!*

> created by wanga`);var c=GroupHelper.extractGroupCode(s),d=await t.groupAcceptInvite(c);await sendWithLogo(t,a,`✅ *JOINED GROUP*
━━━━━━━━━━━━━━━━━━━
_🆔 ID:_ ${d.split("@")[0]}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await n("✅")}catch(e){console.error("Join error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

Make sure the link is valid.

> created by wanga`)}}}),commands.push({name:"lock",description:"Lock/unlock group messages (on/off)",aliases:["lockmessages"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length||!["on","off"].includes(t[0].toLowerCase()))return await o("❌"),i(`📝 *LOCK MESSAGES*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}lock on (admins only) or ${config.PREFIX}lock off (everyone)

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔒");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can change group settings!*

> created by wanga`);var c="on"===t[0].toLowerCase()?"announcement":"not_announcement",d=(await n.groupSettingUpdate(a,c),"announcement"==c?"🔒 *Locked* (admins only)":"🔓 *Unlocked* (everyone)");await sendWithLogo(n,a,`✅ *Messages ${d}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await o("✅")}catch(e){console.error("Lock error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"lockinfo",description:"Lock/unlock group info editing (on/off)",aliases:["lockedit"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length||!["on","off"].includes(t[0].toLowerCase()))return await o("❌"),i(`📝 *LOCK INFO*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}lockinfo on (admins only) or ${config.PREFIX}lockinfo off (everyone)

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔒");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can change group settings!*

> created by wanga`);var c="on"===t[0].toLowerCase()?"locked":"unlocked",d=(await n.groupSettingUpdate(a,c),"locked"==c?"🔒 *Locked* (admins only)":"🔓 *Unlocked* (everyone)");await sendWithLogo(n,a,`✅ *Info Editing ${d}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await o("✅")}catch(e){console.error("Lock info error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"disappear",description:"Set disappearing messages (24h/7d/90d/off)",aliases:["ephemeral"],async execute({msg:t,from:n,sender:o,args:i,sock:s,react:c,reply:d}){if(!GroupHelper.isGroupJid(n))return await c("❌"),d(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===i.length)return await c("❌"),d(`📝 *DISAPPEARING MESSAGES*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}disappear <24h/7d/90d/off>

_Examples:_
• ${config.PREFIX}disappear 24h
• ${config.PREFIX}disappear off

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await c("⏱️");try{var g=await s.groupMetadata(n);if(!GroupHelper.canPerformAdminAction(g,o,config.OWNER_NUMBER))return await c("⚠️"),d(`❌ *Only admins can change this setting!*

> created by wanga`);let e=i[0].toLowerCase(),a=0,r="off";"24h"===e?(a=86400,r="24 hours"):"7d"===e?(a=604800,r="7 days"):"90d"===e&&(a=7776e3,r="90 days"),await s.groupToggleEphemeral(n,a),await sendWithLogo(s,n,`✅ *Disappearing messages set to ${r}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,t),await c("✅")}catch(e){console.error("Disappear error:",e),await c("❌"),d(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"addmode",description:"Set who can add members (all/admins)",aliases:["memberaddmode"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length||!["all","admins"].includes(t[0].toLowerCase()))return await o("❌"),i(`📝 *ADD MEMBER MODE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}addmode all (everyone) or ${config.PREFIX}addmode admins (only admins)

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("🔄");try{var s=await n.groupMetadata(a);if(!GroupHelper.canPerformAdminAction(s,r,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can change this setting!*

> created by wanga`);var c="all"===t[0].toLowerCase()?"all_member_add":"admin_add",d=(await n.groupMemberAddMode(a,c),`✅ *Member add mode set to ${t[0].toLowerCase()}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await sendWithLogo(n,a,d,e),await o("✅")}catch(e){console.error("Addmode error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"poll",description:"Create a poll (single choice)",aliases:["createpoll"],async execute({from:e,args:a,sock:r,react:t,reply:n}){if(!GroupHelper.isGroupJid(e))return await t("❌"),n(`❌ *This command can only be used in groups!*

> created by wanga`);if(a.length<3)return await t("❌"),n(`📊 *CREATE POLL*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}poll "Question" "Option1" "Option2" ...

_Example:_ ${config.PREFIX}poll "Best color?" "Red" "Blue" "Green"

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await t("📊");try{var o=GroupHelper.parsePollArgs(a);if(o.length<2)return n(`❌ *Please provide at least 2 options!*

> created by wanga`);var i=o[0],s=o.slice(1);await r.sendMessage(e,{poll:{name:i,values:s,selectableCount:1}}),await t("✅")}catch(e){console.error("Poll error:",e),await t("❌"),n(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"multipoll",description:"Create a poll with multiple selections",aliases:["mpoll"],async execute({from:n,args:o,sock:i,react:s,reply:c}){if(!GroupHelper.isGroupJid(n))return await s("❌"),c(`❌ *This command can only be used in groups!*

> created by wanga`);if(o.length<4)return await s("❌"),c(`📊 *MULTI-POLL*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}multipoll "Question" "Option1" "Option2" ... [max selections]

_Example:_ ${config.PREFIX}multipoll "Choose toppings" "Cheese" "Pepperoni" "Mushrooms" 2

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await s("📊");try{var d=GroupHelper.parsePollArgs(o);if(d.length<3)return c(`❌ *Please provide at least 2 options!*

> created by wanga`);let e=1,a=d[d.length-1],r=(isNaN(a)||a.startsWith('"')||(e=parseInt(a),d.pop()),d[0]),t=d.slice(1);await i.sendMessage(n,{poll:{name:r,values:t,selectableCount:e}}),await s("✅")}catch(e){console.error("Multi-poll error:",e),await s("❌"),c(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"gstatus",description:"Send a status/story in the group",aliases:["groupstatus"],async execute({msg:e,from:a,args:r,sock:t,react:n,reply:o}){if(!GroupHelper.isGroupJid(a))return await n("❌"),o(`❌ *This command can only be used in groups!*

> created by wanga`);var i,s,c,d,g=e.message?.extendedTextMessage?.contextInfo?.quotedMessage,p=e.message?.imageMessage||g?.imageMessage,u=e.message?.videoMessage||g?.videoMessage,m=e.message?.audioMessage||g?.audioMessage;if(0===r.length&&!p&&!u&&!m)return await n("❌"),o(`📝 *GROUP STATUS*
━━━━━━━━━━━━━━━━━━━
_Usage:_
• ${config.PREFIX}gstatus <text>
• Reply to image/video/audio

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await n("🔄");try{0<r.length?(i=r.join(" "),await t.sendMessage(a,{groupStatusMessage:{text:i}})):(p||u||m)&&(s=e.message?.imageMessage||e.message?.videoMessage||e.message?.audioMessage?e:{...e,message:g},c=await downloadMediaMessage(s,"buffer",{},{logger:console}),d={},p&&(d.image=c),u&&(d.video=c),m&&(d.audio=c,d.ptt=!0),await t.sendMessage(a,{groupStatusMessage:d})),await n("✅")}catch(e){console.error("Group status error:",e),await n("❌"),o(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"requests",description:"List pending join requests",aliases:["joinrequests","pending"],async execute({msg:e,from:r,sender:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(r))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);await o("📋");try{var s=await n.groupMetadata(r);if(!GroupHelper.canPerformAdminAction(s,t,config.OWNER_NUMBER))return await o("⚠️"),i(`❌ *Only admins can view join requests!*

> created by wanga`);var c=await n.groupRequestParticipantsList(r);if(!c||0===c.length)return i(`📋 *No pending join requests.*

> created by wanga`);let a=`*📋 PENDING REQUESTS (${c.length})*

`;for(let e=0;e<c.length;e++){var d=await GroupHelper.formatJid(c[e].jid,n);a+=e+1+`. ${d}
`}await sendWithLogo(n,r,a=a+`
Use ${config.PREFIX}approve <number> or ${config.PREFIX}reject <number>`+`

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),await o("✅")}catch(e){console.error("Requests error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"approve",description:"Approve join request",aliases:["accept"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length)return await o("❌"),i(`📝 *APPROVE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}approve <number from requests list>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("✅");try{var s,c,d,g,p=await n.groupMetadata(a);return GroupHelper.canPerformAdminAction(p,r,config.OWNER_NUMBER)?(s=await n.groupRequestParticipantsList(a),c=parseInt(t[0])-1,isNaN(c)||c<0||c>=s.length?i(`❌ *Invalid request number!*

> created by wanga`):(d=s[c].jid,g=await GroupHelper.formatJid(d,n),await n.groupRequestParticipantsUpdate(a,[d],"approve"),await sendWithLogo(n,a,`✅ *Approved ${g}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),void await o("✅"))):(await o("⚠️"),i(`❌ *Only admins can approve requests!*

> created by wanga`))}catch(e){console.error("Approve error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"reject",description:"Reject join request",aliases:["deny"],async execute({msg:e,from:a,sender:r,args:t,sock:n,react:o,reply:i}){if(!GroupHelper.isGroupJid(a))return await o("❌"),i(`❌ *This command can only be used in groups!*

> created by wanga`);if(0===t.length)return await o("❌"),i(`📝 *REJECT*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}reject <number from requests list>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);await o("❌");try{var s,c,d,g,p=await n.groupMetadata(a);return GroupHelper.canPerformAdminAction(p,r,config.OWNER_NUMBER)?(s=await n.groupRequestParticipantsList(a),c=parseInt(t[0])-1,isNaN(c)||c<0||c>=s.length?i(`❌ *Invalid request number!*

> created by wanga`):(d=s[c].jid,g=await GroupHelper.formatJid(d,n),await n.groupRequestParticipantsUpdate(a,[d],"reject"),await sendWithLogo(n,a,`❌ *Rejected ${g}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,e),void await o("✅"))):(await o("⚠️"),i(`❌ *Only admins can reject requests!*

> created by wanga`))}catch(e){console.error("Reject error:",e),await o("❌"),i(`❌ *Error:* ${e.message}

> created by wanga`)}}}),commands.push({name:"grouphelp",description:"Show all group commands",aliases:["ghelp"],async execute({msg:e,from:a,sock:r,react:t}){var n=config.PREFIX;await sendWithLogo(r,a,`👥 *GROUP COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*📋 INFO*
`+`_${n}creategroup <name> [phones]_ - Create group
`+`_${n}groupinfo [link]_ - Group details
`+`_${n}groups_ - List groups
`+`_${n}participants_ - List members

`+`*👤 MEMBERS*
`+`_${n}add <@user/phone>_ - Add members
`+`_${n}remove <@user>_ - Remove members
`+`_${n}promote <@user>_ - Make admin
`+`_${n}demote <@user>_ - Remove admin
`+`_${n}leave_ - Leave group

`+`*🏷️ TAGGING*
`+`_${n}tagall [message]_ - Tag all
`+`_${n}hidetag <message>_ - Secret tag
`+`_${n}tagadmins [message]_ - Tag admins

`+`*⚙️ SETTINGS*
`+`_${n}setname <name>_ - Change name
`+`_${n}setdesc <desc>_ - Change description
`+`_${n}lock on/off_ - Lock messages
`+`_${n}lockinfo on/off_ - Lock info editing
`+`_${n}disappear <24h/7d/90d/off>_ - Disappearing messages
`+`_${n}addmode all/admins_ - Who can add

`+`*🔗 INVITES*
`+`_${n}invite_ - Get invite link
`+`_${n}revoke_ - New invite link
`+`_${n}join <link>_ - Join group

`+`*📊 INTERACTIVE*
`+`_${n}poll "Q" "A" "B"..._ - Create poll
`+`_${n}multipoll "Q" "A" "B"... [count]_ - Multi poll
`+`_${n}gstatus [text/media]_ - Group status

`+`*👥 JOIN REQUESTS*
`+`_${n}requests_ - Pending requests
`+`_${n}approve <number>_ - Approve request
`+`_${n}reject <number>_ - Reject request

`+"> created by wanga",e),await t("✅")}}),module.exports={commands:commands};