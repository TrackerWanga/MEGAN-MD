async function sendButtonMenu(e,a,n,o){var t=require("gifted-btns").sendButtons;try{return await t(e,a,{title:n.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n.text,footer:n.footer||"> created by wanga",image:n.image?{url:n.image}:null,buttons:n.buttons||[]},{quoted:o})}catch(t){console.error("Button error:",t),await e.sendMessage(a,{text:n.text},{quoted:o})}}async function createEphoto(e,t,a,n,o,i,s,r,l){try{var c={url:t,text1:a},g=(console.log(`🔄 Generating ${r} with text: "${a}"`),await axios.get("https://api.siputzx.my.id/api/m/ephoto360",{params:c,responseType:"arraybuffer",timeout:3e4,headers:{"User-Agent":"Mozilla/5.0",Accept:"image/webp,image/apng,image/*,*/*;q=0.8"}})),u=g.headers["content-type"];if(u&&(u.includes("application/json")||u.includes("text/html")))throw new Error("Service temporarily unavailable");var m=Buffer.from(g.data);return await sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *${r.toUpperCase()}*
✨ Created successfully!

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"ephotomenu",text:"🎨 More Effects"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n),await o.sendMessage(e,{image:m,caption:`🎨 *${r.toUpperCase()}*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:n}),await i("✅"),!0}catch(t){return console.error(`Error in ${r}:`,t.message),await i("❌"),await sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Effect Failed*

_Service temporarily unavailable._
_ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n),!1}}let axios=require("axios"),config=require("../../megan/config"),commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png";commands.push({name:"1917style",description:"Create 1917 film-style text effect",aliases:["1917"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎭 *𝟏𝟗𝟏𝟕 𝐒𝐭𝐲𝐥𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}1917style <text>
_Example:_ ${config.PREFIX}1917style WANGA

_🎨 Creates 1917 film-style text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🎭"),await createEphoto(e,"https://en.ephoto360.com/1917-style-text-effect-523.html",n,t,o,i,a,"1917style",s)}}),commands.push({name:"advancedglow",description:"Create advanced glow text effect",aliases:["glow"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✨ *𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐆𝐥𝐨𝐰*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}advancedglow <text>
_Example:_ ${config.PREFIX}advancedglow MEGAN

_✨ Creates advanced glow text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("✨"),await createEphoto(e,"https://en.ephoto360.com/advanced-glow-effects-74.html",n,t,o,i,a,"advancedglow",s)}}),commands.push({name:"blackpinklogo",description:"Create Blackpink style logo",aliases:["bplogo"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🖤 *𝐁𝐥𝐚𝐜𝐤𝐩𝐢𝐧𝐤 𝐋𝐨𝐠𝐨*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}blackpinklogo <text>
_Example:_ ${config.PREFIX}blackpinklogo MEGAN

_🖤 Creates Blackpink style logo._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🖤"),await createEphoto(e,"https://en.ephoto360.com/create-blackpink-logo-online-free-607.html",n,t,o,i,a,"blackpinklogo",s)}}),commands.push({name:"blackpinkstyle",description:"Create Blackpink style text effect",aliases:["bpstyle"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎤 *𝐁𝐥𝐚𝐜𝐤𝐩𝐢𝐧𝐤 𝐒𝐭𝐲𝐥𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}blackpinkstyle <text>
_Example:_ ${config.PREFIX}blackpinkstyle MEGAN

_🎤 Creates Blackpink style text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🎤"),await createEphoto(e,"https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",n,t,o,i,a,"blackpinkstyle",s)}}),commands.push({name:"cartoonstyle",description:"Create cartoon style graffiti text",aliases:["cartoon"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🖍️ *𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐒𝐭𝐲𝐥𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}cartoonstyle <text>
_Example:_ ${config.PREFIX}cartoonstyle MEGAN

_🖍️ Creates cartoon style graffiti text._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🖍️"),await createEphoto(e,"https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",n,t,o,i,a,"cartoonstyle",s)}}),commands.push({name:"deletingtext",description:"Create eraser deleting text effect",aliases:["eraser"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📄 *𝐃𝐞𝐥𝐞𝐭𝐢𝐧𝐠 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}deletingtext <text>
_Example:_ ${config.PREFIX}deletingtext MEGAN

_📄 Creates eraser deleting text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("📄"),await createEphoto(e,"https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html",n,t,o,i,a,"deletingtext",s)}}),commands.push({name:"dragonball",description:"Create Dragon Ball style text effect",aliases:["dbz"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🐉 *𝐃𝐫𝐚𝐠𝐨𝐧 𝐁𝐚𝐥𝐥*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}dragonball <text>
_Example:_ ${config.PREFIX}dragonball MEGAN

_🐉 Creates Dragon Ball style text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🐉"),await createEphoto(e,"https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html",n,t,o,i,a,"dragonball",s)}}),commands.push({name:"effectclouds",description:"Create text in clouds effect",aliases:["clouds"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`☁️ *𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐥𝐨𝐮𝐝𝐬*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}effectclouds <text>
_Example:_ ${config.PREFIX}effectclouds MEGAN

_☁️ Creates text in clouds effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("☁️"),await createEphoto(e,"https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",n,t,o,i,a,"effectclouds",s)}}),commands.push({name:"flag3dtext",description:"Create 3D flag text effect",aliases:["3dflag"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🏴 *𝟑𝐃 𝐅𝐥𝐚𝐠 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}flag3dtext <text>
_Example:_ ${config.PREFIX}flag3dtext MEGAN

_🏴 Creates 3D flag text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🏴"),await createEphoto(e,"https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html",n,t,o,i,a,"flag3dtext",s)}}),commands.push({name:"flagtext",description:"Create flag text effect",aliases:["flag"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🇳🇬 *𝐅𝐥𝐚𝐠 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}flagtext <text>
_Example:_ ${config.PREFIX}flagtext MEGAN

_🇳🇬 Creates flag text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🇳🇬"),await createEphoto(e,"https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html",n,t,o,i,a,"flagtext",s)}}),commands.push({name:"freecreate",description:"Create free 3D hologram text effect",aliases:["hologram"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🆓 *𝐅𝐫𝐞𝐞 𝐂𝐫𝐞𝐚𝐭𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}freecreate <text>
_Example:_ ${config.PREFIX}freecreate MEGAN

_🆓 Creates 3D hologram text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🆓"),await createEphoto(e,"https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html",n,t,o,i,a,"freecreate",s)}}),commands.push({name:"galaxystyle",description:"Create galaxy style text effect",aliases:["galaxy"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌌 *𝐆𝐚𝐥𝐚𝐱𝐲 𝐒𝐭𝐲𝐥𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}galaxystyle <text>
_Example:_ ${config.PREFIX}galaxystyle MEGAN

_🌌 Creates galaxy style text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌌"),await createEphoto(e,"https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html",n,t,o,i,a,"galaxystyle",s)}}),commands.push({name:"galaxywallpaper",description:"Create galaxy wallpaper text effect",aliases:["galaxywall"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌠 *𝐆𝐚𝐥𝐚𝐱𝐲 𝐖𝐚𝐥𝐥𝐩𝐚𝐩𝐞𝐫*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}galaxywallpaper <text>
_Example:_ ${config.PREFIX}galaxywallpaper MEGAN

_🌠 Creates galaxy wallpaper text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌠"),await createEphoto(e,"https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html",n,t,o,i,a,"galaxywallpaper",s)}}),commands.push({name:"glitchtext",description:"Create digital glitch text effect",aliases:["glitch"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📛 *𝐆𝐥𝐢𝐭𝐜𝐡 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}glitchtext <text>
_Example:_ ${config.PREFIX}glitchtext MEGAN

_📛 Creates digital glitch text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("📛"),await createEphoto(e,"https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",n,t,o,i,a,"glitchtext",s)}}),commands.push({name:"glowingtext",description:"Create glowing text effect",aliases:["glowtext"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌟 *𝐆𝐥𝐨𝐰𝐢𝐧𝐠 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}glowingtext <text>
_Example:_ ${config.PREFIX}glowingtext MEGAN

_🌟 Creates glowing text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌟"),await createEphoto(e,"https://en.ephoto360.com/create-glowing-text-effects-online-706.html",n,t,o,i,a,"glowingtext",s)}}),commands.push({name:"gradienttext",description:"Create 3D gradient text effect",aliases:["gradient"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌈 *𝐆𝐫𝐚𝐝𝐢𝐞𝐧𝐭 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}gradienttext <text>
_Example:_ ${config.PREFIX}gradienttext MEGAN

_🌈 Creates 3D gradient text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌈"),await createEphoto(e,"https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html",n,t,o,i,a,"gradienttext",s)}}),commands.push({name:"graffiti",description:"Create cute girl painting graffiti text",aliases:["graffiti"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *𝐆𝐫𝐚𝐟𝐟𝐢𝐭𝐢*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}graffiti <text>
_Example:_ ${config.PREFIX}graffiti MEGAN

_🎨 Creates cute girl painting graffiti text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🎨"),await createEphoto(e,"https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html",n,t,o,i,a,"graffiti",s)}}),commands.push({name:"incandescent",description:"Create incandescent bulbs text effect",aliases:["bulbs"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`💡 *𝐈𝐧𝐜𝐚𝐧𝐝𝐞𝐬𝐜𝐞𝐧𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}incandescent <text>
_Example:_ ${config.PREFIX}incandescent MEGAN

_💡 Creates incandescent bulbs text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("💡"),await createEphoto(e,"https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html",n,t,o,i,a,"incandescent",s)}}),commands.push({name:"lighteffects",description:"Create light effects text",aliases:["light"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`💡 *𝐋𝐢𝐠𝐡𝐭 𝐄𝐟𝐟𝐞𝐜𝐭𝐬*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}lighteffects <text>
_Example:_ ${config.PREFIX}lighteffects MEGAN

_💡 Creates light effects text._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("💡"),await createEphoto(e,"https://en.ephoto360.com/create-light-effects-green-neon-online-429.html",n,t,o,i,a,"lighteffects",s)}}),commands.push({name:"logomaker",description:"Create bear logo maker effect",aliases:["bearlogo"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🧸 *𝐋𝐨𝐠𝐨 𝐌𝐚𝐤𝐞𝐫*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}logomaker <text>
_Example:_ ${config.PREFIX}logomaker MEGAN

_🧸 Creates bear logo maker effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🧸"),await createEphoto(e,"https://en.ephoto360.com/free-bear-logo-maker-online-673.html",n,t,o,i,a,"logomaker",s)}}),commands.push({name:"luxurygold",description:"Create luxury gold text effect",aliases:["gold"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🪙 *𝐋𝐮𝐱𝐮𝐫𝐲 𝐆𝐨𝐥𝐝*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}luxurygold <text>
_Example:_ ${config.PREFIX}luxurygold MEGAN

_🪙 Creates luxury gold text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🪙"),await createEphoto(e,"https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html",n,t,o,i,a,"luxurygold",s)}}),commands.push({name:"makingneon",description:"Create neon light text with galaxy style",aliases:["neon"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌌 *𝐌𝐚𝐤𝐢𝐧𝐠 𝐍𝐞𝐨𝐧*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}makingneon <text>
_Example:_ ${config.PREFIX}makingneon MEGAN

_🌌 Creates neon light text with galaxy style._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌌"),await createEphoto(e,"https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html",n,t,o,i,a,"makingneon",s)}}),commands.push({name:"matrix",description:"Create matrix text effect",aliases:["matrix"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📊 *𝐌𝐚𝐭𝐫𝐢𝐱*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}matrix <text>
_Example:_ ${config.PREFIX}matrix MEGAN

_📊 Creates matrix text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("📊"),await createEphoto(e,"https://en.ephoto360.com/matrix-text-effect-154.html",n,t,o,i,a,"matrix",s)}}),commands.push({name:"multicoloredneon",description:"Create multicolored neon light effect",aliases:["colorneon"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎆 *𝐌𝐮𝐥𝐭𝐢𝐜𝐨𝐥𝐨𝐫𝐞𝐝 𝐍𝐞𝐨𝐧*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}multicoloredneon <text>
_Example:_ ${config.PREFIX}multicoloredneon MEGAN

_🎆 Creates multicolored neon light effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🎆"),await createEphoto(e,"https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",n,t,o,i,a,"multicoloredneon",s)}}),commands.push({name:"neonglitch",description:"Create impressive neon glitch text effect",aliases:["neonglitch"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌀 *𝐍𝐞𝐨𝐧 𝐆𝐥𝐢𝐭𝐜𝐡*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}neonglitch <text>
_Example:_ ${config.PREFIX}neonglitch MEGAN

_🌀 Creates impressive neon glitch text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌀"),await createEphoto(e,"https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",n,t,o,i,a,"neonglitch",s)}}),commands.push({name:"papercutstyle",description:"Create multicolor 3D paper cut style text",aliases:["papercut"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✂️ *𝐏𝐚𝐩𝐞𝐫 𝐂𝐮𝐭 𝐒𝐭𝐲𝐥𝐞*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}papercutstyle <text>
_Example:_ ${config.PREFIX}papercutstyle MEGAN

_✂️ Creates multicolor 3D paper cut style text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("✂️"),await createEphoto(e,"https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html",n,t,o,i,a,"papercutstyle",s)}}),commands.push({name:"pixelglitch",description:"Create pixel glitch text effect",aliases:["pixel"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📛 *𝐏𝐢𝐱𝐞𝐥 𝐆𝐥𝐢𝐭𝐜𝐡*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}pixelglitch <text>
_Example:_ ${config.PREFIX}pixelglitch MEGAN

_📛 Creates pixel glitch text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("📛"),await createEphoto(e,"https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",n,t,o,i,a,"pixelglitch",s)}}),commands.push({name:"royaltext",description:"Create royal text effect",aliases:["royal"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`👑 *𝐑𝐨𝐲𝐚𝐥 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}royaltext <text>
_Example:_ ${config.PREFIX}royaltext MEGAN

_👑 Creates royal text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("👑"),await createEphoto(e,"https://en.ephoto360.com/royal-text-effect-online-free-471.html",n,t,o,i,a,"royaltext",s)}}),commands.push({name:"sand",description:"Create sand writing text effect",aliases:["sand"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🏖️ *𝐒𝐚𝐧𝐝*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}sand <text>
_Example:_ ${config.PREFIX}sand MEGAN

_🏖️ Creates sand writing text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🏖️"),await createEphoto(e,"https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",n,t,o,i,a,"sand",s)}}),commands.push({name:"summerbeach",description:"Create summer beach sand text effect",aliases:["beach"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌊 *𝐒𝐮𝐦𝐦𝐞𝐫 𝐁𝐞𝐚𝐜𝐡*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}summerbeach <text>
_Example:_ ${config.PREFIX}summerbeach MEGAN

_🌊 Creates summer beach sand text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🌊"),await createEphoto(e,"https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",n,t,o,i,a,"summerbeach",s)}}),commands.push({name:"topography",description:"Create topography text effect",aliases:["topo"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🗺️ *𝐓𝐨𝐩𝐨𝐠𝐫𝐚𝐩𝐡𝐲*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}topography <text>
_Example:_ ${config.PREFIX}topography MEGAN

_🗺️ Creates topography text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🗺️"),await createEphoto(e,"https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html",n,t,o,i,a,"topography",s)}}),commands.push({name:"watercolortext",description:"Create watercolor text effect",aliases:["watercolor"],async execute({msg:t,from:e,sender:a,args:n,sock:o,react:i,buttons:s}){if(!n.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *𝐖𝐚𝐭𝐞𝐫𝐜𝐨𝐥𝐨𝐫 𝐓𝐞𝐱𝐭*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}watercolortext <text>
_Example:_ ${config.PREFIX}watercolortext MEGAN

_🎨 Creates watercolor text effect._`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);n=n.join(" ");await i("🎨"),await createEphoto(e,"https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",n,t,o,i,a,"watercolortext",s)}}),commands.push({name:"ephotomenu",description:"Show all Ephoto360 effects",aliases:["ephoto","ephotolist"],async execute({msg:t,from:e,sock:a,react:n}){var o=config.PREFIX;await sendButtonMenu(a,e,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *𝐄𝐏𝐇𝐎𝐓𝐎𝟑𝟔𝟎 𝐄𝐅𝐅𝐄𝐂𝐓𝐒 (𝟑𝟐)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`🎭 ${o}1917style - 1917 film style
`+`✨ ${o}advancedglow - Advanced glow
`+`🖤 ${o}blackpinklogo - Blackpink logo
`+`🎤 ${o}blackpinkstyle - Blackpink style
`+`🖍️ ${o}cartoonstyle - Cartoon graffiti
`+`📄 ${o}deletingtext - Eraser deleting text
`+`🐉 ${o}dragonball - Dragon Ball style
`+`☁️ ${o}effectclouds - Text in clouds
`+`🏴 ${o}flag3dtext - 3D flag text
`+`🇳🇬 ${o}flagtext - Flag text
`+`🆓 ${o}freecreate - 3D hologram
`+`🌌 ${o}galaxystyle - Galaxy style
`+`🌠 ${o}galaxywallpaper - Galaxy wallpaper
`+`📛 ${o}glitchtext - Digital glitch
`+`🌟 ${o}glowingtext - Glowing text
`+`🌈 ${o}gradienttext - 3D gradient
`+`🎨 ${o}graffiti - Graffiti art
`+`💡 ${o}incandescent - Incandescent bulbs
`+`💡 ${o}lighteffects - Light effects
`+`🧸 ${o}logomaker - Bear logo maker
`+`🪙 ${o}luxurygold - Luxury gold
`+`🌌 ${o}makingneon - Neon with galaxy
`+`📊 ${o}matrix - Matrix style
`+`🎆 ${o}multicoloredneon - Color neon
`+`🌀 ${o}neonglitch - Neon glitch
`+`✂️ ${o}papercutstyle - Paper cut
`+`📛 ${o}pixelglitch - Pixel glitch
`+`👑 ${o}royaltext - Royal text
`+`🏖️ ${o}sand - Sand writing
`+`🌊 ${o}summerbeach - Summer beach
`+`🗺️ ${o}topography - Topography
`+`🎨 ${o}watercolortext - Watercolor

`+`*Usage:* ${o}[effect] <text>
`+`*Example:* ${o}1917style WANGA

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await n("✅")}}),module.exports={commands:commands};