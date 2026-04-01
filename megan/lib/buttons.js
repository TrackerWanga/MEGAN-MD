let{sendButtons,sendInteractiveMessage}=require("gifted-btns");class Buttons{constructor(t,e){this.sock=t,this.bot=e,this.channelLink="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",this.logoUrl="https://files.catbox.moe/0v8bkv.png"}async send(t,e,n=null){try{var s={title:e.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:e.text||"Choose an option:",footer:e.footer||"© 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",buttons:e.buttons||[]};return await sendButtons(this.sock,t,s,{quoted:n})}catch(t){return console.error("Button error:",t),null}}async sendInteractive(t,e,n=null){try{return await sendInteractiveMessage(this.sock,t,{text:e.text,footer:e.footer,interactiveButtons:e.buttons||[]},{quoted:n})}catch(t){return console.error("Interactive button error:",t),null}}async sendWithImage(e,n,s=null){try{var t=await this.getImageBuffer(this.logoUrl),a={title:n.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n.text||"Choose an option:",footer:n.footer||"© 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",buttons:n.buttons||[]};return await sendButtons(this.sock,e,a,{quoted:s,image:t})}catch(t){return console.error("Image button error:",t),this.send(e,n,s)}}async getImageBuffer(t){try{var e=await require("axios").get(t,{responseType:"arraybuffer",timeout:1e4});return Buffer.from(e.data)}catch(t){return null}}async sendStartup(t,e){var n=e.commands.size,s=await e.db?.getSetting("mode","public")||"public",a=process.env.SESSION||"",o=[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Join Channel",url:this.channelLink})}],a=(a&&o.unshift({name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Session",copy_code:a})}),`✅ *${e.config.BOT_NAME} CONNECTED*

`+`📱 *Bot:* ${e.config.BOT_NAME}
`+`👑 *Owner:* ${e.config.OWNER_NAME}
`+`📞 *Number:* ${e.config.OWNER_NUMBER}
`+`🔧 *Prefix:* ${e.config.PREFIX}
`+`📚 *Commands:* ${n}
`+`⚙️ *Mode:* ${s}

`+"> created by wanga");return this.sendWithImage(t,{title:"✅ MEGAN-MD ONLINE",text:a,footer:"Bot is ready!",buttons:o})}async sendWelcome(t,e,n=null){var e=e.split("@")[0],s=this.bot.config.PREFIX;return this.sendInteractive(t,{text:`👋 Hello @${e}!

I'm here to help. Use the menu below or type ${s}menu.`,footer:"Choose an option:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"📋 Menu",id:"show_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendMenu(t,e,n,s=null){var e=e.split("@")[0],a=this.bot.config.PREFIX,o=[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"🤖 AI Chat",id:"menu_ai"})},{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"⬇️ Download",id:"menu_download"})},{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"👥 Group",id:"menu_group"})},{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"🛠️ Tools",id:"menu_tools"})}];return n&&o.push({name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"👑 Owner",id:"menu_owner"})}),o.push({name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}),this.sendInteractive(t,{text:`Welcome @${e}!

• Prefix: ${a}
• Commands: ${this.bot.commands.size}
• Status: `+(n?"👑 Owner":"👤 User"),footer:"Select a category:",buttons:o},s)}async sendAIMenu(t,e,n=null){return this.sendInteractive(t,{text:`🤖 *AI COMMANDS*

• ${e}megan - Megan AI
• ${e}gemini - Gemini
• ${e}mistral - Mistral
• ${e}deepseek - DeepSeek
• ${e}duckai - DuckAI
• ${e}codellama - Coding
• ${e}teacher - Learning`,footer:"Choose an option:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"◀️ Back",id:"back_to_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendDownloadMenu(t,e,n=null){return this.sendInteractive(t,{text:`⬇️ *DOWNLOAD COMMANDS*

• ${e}play - Audio
• ${e}ytmp3 - YouTube MP3
• ${e}ytmp4 - YouTube Video
• ${e}ig - Instagram
• ${e}fb - Facebook
• ${e}tt - TikTok`,footer:"Choose an option:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"◀️ Back",id:"back_to_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendGroupMenu(t,e,n=null){return this.sendInteractive(t,{text:`👥 *GROUP COMMANDS*

• ${e}add - Add members
• ${e}remove - Remove members
• ${e}promote - Make admin
• ${e}demote - Remove admin
• ${e}tagall - Tag everyone
• ${e}invite - Get link
• ${e}lock - Lock messages`,footer:"Choose an option:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"◀️ Back",id:"back_to_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendToolsMenu(t,e,n=null){return this.sendInteractive(t,{text:`🛠️ *TOOLS*

• ${e}sticker - Make sticker
• ${e}toimage - Sticker to image
• ${e}tts - Text to speech
• ${e}translate - Translate
• ${e}screenshot - Website SS
• ${e}binary - Text to binary
• ${e}hash - Generate hashes`,footer:"Choose an option:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"◀️ Back",id:"back_to_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendOwnerMenu(t,e,n=null){return this.sendInteractive(t,{text:`👑 *OWNER COMMANDS*

• ${e}mode - Change mode
• ${e}setprefix - Change prefix
• ${e}setbotname - Change name
• ${e}setbotpic - Set profile pic
• ${e}block - Block user
• ${e}unblock - Unblock
• ${e}listblocked - Blocked list`,footer:"Owner only:",buttons:[{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"◀️ Back",id:"back_to_menu"})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:this.channelLink})}]},n)}async sendChannelPromo(t,e,n=null){e=e.split("@")[0];return this.sendInteractive(t,{text:`Hey @${e}! 👋

Join our official channel for updates and new features!`,footer:"Click below:",buttons:[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Join Now",url:this.channelLink})},{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"✅ Done",id:"channel_joined"})}]},n)}}module.exports=Buttons;