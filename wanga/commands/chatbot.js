let config=require("../../megan/config"),commands=[];commands.push({name:"chatbot",description:"Set chatbot mode (dm/group/both/off)",aliases:["bot","aibot"],async execute({msg:e,from:t,args:a,bot:o,sock:s,react:r,reply:i}){if(0===a.length)return n=`🤖 *CHATBOT SETTINGS*

`+`Current: *${await o.db.getSetting("chatbot","off")}*

`+`*Options:*
`+`• ${config.PREFIX}chatbot dm - Reply in DMs only
`+`• ${config.PREFIX}chatbot group - Reply in groups only
`+`• ${config.PREFIX}chatbot both - Reply everywhere
`+`• ${config.PREFIX}chatbot off - Disable

`+`✨ *AI Features:*
`+`• 🧠 *Memory* - Remembers last 15 messages
`+`• 🔄 *Auto-cleanup* - Forgets after 24 hours
`+`• 🎯 *Response Styles* - Short/Normal/Detailed
`+`• 🌐 *Multi-API* - Llama → Gemini → DuckAI

`+"> created by wanga",s.sendMessage(t,{text:n},{quoted:e});var n=a[0].toLowerCase();if(!["dm","group","both","off"].includes(n))return await r("❌"),i(`❌ Invalid option! Use: dm, group, both, or off

> created by wanga`);await o.db.setSetting("chatbot",n),await r("✅");a=`🤖 *CHATBOT UPDATED*

${"dm"===n?`✅ *Chatbot set to DM mode*

I will only reply in private messages.`:"group"===n?`✅ *Chatbot set to Group mode*

I will only reply in groups.`:"both"===n?`✅ *Chatbot set to Both mode*

I will reply everywhere.`:`❌ *Chatbot disabled*

I will no longer reply automatically.`}

> created by wanga`;await s.sendMessage(t,{text:a},{quoted:e})}}),commands.push({name:"chatstatus",description:"Check chatbot status with memory stats",aliases:["botstatus"],async execute({msg:e,from:t,bot:a,sock:o,react:s}){let r=await a.db.getSetting("chatbot","off"),i=await a.db.getSetting("ai_mode","normal"),n=await a.aiMemory.getStats(t),c=await a.aiMemory.getGlobalStats(),m="❌",d;d="dm"===r?(m="💬","Active in DMs only"):"group"===r?(m="👥","Active in groups only"):"both"===r?(m="🌐","Active everywhere"):(m="❌","Disabled");a=`🤖 *CHATBOT STATUS*

`+`📊 *Mode:* ${r}
`+m+` *Status:* ${d}
`+`🎯 *AI Mode:* ${i}

`+`🧠 *YOUR MEMORY*
`+`━━━━━━━━━━━━━━━━━━━
`+`• Messages: ${n.messageCount}
`+`• Storage: ${(n.storageBytes/1024).toFixed(2)} KB

`+`💾 *GLOBAL MEMORY*
`+`━━━━━━━━━━━━━━━━━━━
`+`• Active Chats: ${c.activeChats}
`+`• Total Messages: ${c.totalMessages}
`+`• Total Storage: ${c.totalMB} MB
`+`• Retention: 24 hours

`+`✨ *Memory Rules:*
`+`• Remembers last 15 messages
`+`• Auto-cleans after 24 hours

`+"> created by wanga";await o.sendMessage(t,{text:a},{quoted:e}),await s("✅")}}),commands.push({name:"aimode",description:"Set AI response mode (short/normal/detailed)",aliases:["aimode"],async execute({msg:e,from:t,args:a,bot:o,sock:s,react:r,reply:i}){if(0===a.length)n=`🎯 *AI MODE*

`+`Current: *${await o.db.getSetting("ai_mode","normal")}*

`+`*Options:*
`+`• ${config.PREFIX}aimode short - Brief, concise responses
`+`• ${config.PREFIX}aimode normal - Balanced responses
`+`• ${config.PREFIX}aimode detailed - Long, detailed responses

`+"> created by wanga",await s.sendMessage(t,{text:n},{quoted:e}),await r("ℹ️");else{var n=a[0].toLowerCase();if(!["short","normal","detailed"].includes(n))return await r("❌"),i(`❌ Invalid mode! Use: short, normal, or detailed

> created by wanga`);await o.db.setSetting("ai_mode",n),await r("✅"),await s.sendMessage(t,{text:`✅ *AI MODE SET*

AI mode changed to: *${n}*

`+`*${"short"===n?"Brief, to-the-point responses":"detailed"===n?"Comprehensive, detailed responses":"Balanced, natural responses"}*

`+"> created by wanga"},{quoted:e})}}}),commands.push({name:"clearchat",description:"Clear your conversation memory",aliases:["clearmemory","forget","resetchat"],async execute({msg:e,from:t,bot:a,sock:o,react:s,reply:r}){var i=await a.aiMemory.getStats(t);if(0===i.messageCount)return r(`🧹 *No memory to clear*

You don't have any conversation history with me!

> created by wanga`);await s("🧹"),await a.aiMemory.clearMemorySync(t);r=`🧹 *MEMORY CLEARED*

`+`I've forgotten *${i.messageCount}* messages from this conversation.

`+`Let's start fresh! 👋

`+"> created by wanga";await o.sendMessage(t,{text:r},{quoted:e}),await s("✅")}}),commands.push({name:"testai",description:"Test the AI with memory",aliases:["testbot"],async execute({msg:e,from:t,sender:a,args:o,bot:s,sock:r,react:i,reply:n}){o=o.join(" ")||"Hello, how are you?";await i("🤔");try{var c=`🤖 *AI TEST*

`+`📝 *Query:* ${o}

`+`💬 *Response:*
${await s.getAIResponse(t,a,o)}

`+"> created by wanga";await r.sendMessage(t,{text:c},{quoted:e}),await i("✅")}catch(e){console.error("Test AI error:",e),await i("❌"),await n(`❌ AI Test Failed: ${e.message}

> created by wanga`)}}}),commands.push({name:"chathelp",description:"Show all chatbot commands",aliases:["bothelp"],async execute({msg:e,from:t,sock:a,react:o}){var s="🤖 *CHATBOT COMMANDS*\n\n*SETTINGS*\n━━━━━━━━━━━━━━━━━━━\n"+`• ${config.PREFIX}chatbot dm/group/both/off - Set mode
`+`• ${config.PREFIX}chatstatus - Check status + memory stats
`+`• ${config.PREFIX}aimode short/normal/detailed - Response style
`+`• ${config.PREFIX}clearchat - Clear your conversation memory
`+`• ${config.PREFIX}testai [question] - Test AI response

`+`*MEMORY SYSTEM*
`+`━━━━━━━━━━━━━━━━━━━
`+`• 🧠 Remembers last 15 messages per chat
`+`• 🔄 Auto-cleans after 24 hours inactivity
`+`• 👤 Separate memory per user/group
`+`• 🗑️ Use ${config.PREFIX}clearchat to clear yours
`+`• 💾 Separate database file: ai_memory.db

`+`*AI FEATURES*
`+`━━━━━━━━━━━━━━━━━━━
`+`• Multi-API fallback (Llama → Gemini → DuckAI)
`+`• System: "You are MEGAN-MD, created by TrackerWanga"
`+`• Auto-retry on failure

`+"> created by wanga";await a.sendMessage(t,{text:s},{quoted:e}),await o("✅")}}),module.exports={commands:commands};