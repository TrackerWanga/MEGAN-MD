async function sendButtonMenu(t,a,i,s){var e=require("gifted-btns").sendButtons;try{return await e(t,a,{title:i.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:i.text,footer:i.footer||"> created by wanga",image:i.image?{url:i.image}:null,buttons:i.buttons||[]},{quoted:s})}catch(e){console.error("Button error:",e),await t.sendMessage(a,{text:i.text},{quoted:s})}}async function downloadMedia(e){return downloadMediaMessage(e,"buffer",{},{logger:console})}async function uploadToCatbox(e,t){var a=new(require("form-data"));return a.append("reqtype","fileupload"),a.append("fileToUpload",e,{filename:t}),(await axios.post("https://catbox.moe/user/api.php",a,{headers:a.getHeaders()})).data.trim()}function formatFileSize(e){return 1073741824<=e?(e/1073741824).toFixed(2)+" GB":1048576<=e?(e/1048576).toFixed(2)+" MB":1024<=e?(e/1024).toFixed(2)+" KB":e+" bytes"}let axios=require("axios"),fs=require("fs-extra"),path=require("path"),config=require("../../megan/config"),MediaProcessor=require("../../megan/lib/mediaProcessor"),downloadMediaMessage=require("gifted-baileys").downloadMediaMessage,commands=[],mediaProcessor=new MediaProcessor,TEMP_DIR=path.join(__dirname,"../../temp"),CHANNEL_LINK=(fs.ensureDirSync(TEMP_DIR),"https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b"),BOT_LOGO="https://files.catbox.moe/0v8bkv.png",MEME_IMAGES=["https://files.catbox.moe/xnqfhk.jpg","https://files.catbox.moe/99jcbd.jpg","https://files.catbox.moe/a8yflv.jpg","https://files.catbox.moe/xn7fef.jpg","https://files.catbox.moe/fzo3sg.jpg","https://files.catbox.moe/ypi5fw.jpg","https://files.catbox.moe/f9eqxi.jpg","https://files.catbox.moe/eswum9.jpg","https://files.catbox.moe/1w2z1i.jpg","https://files.catbox.moe/5qkf90.jpg","https://files.catbox.moe/hp4nki.jpg","https://files.catbox.moe/hq6hhu.jpg","https://files.catbox.moe/ggwzc9.jpg","https://files.catbox.moe/evpzeb.jpg","https://files.catbox.moe/xdtch8.jpg","https://files.catbox.moe/u8itde.jpg","https://files.catbox.moe/qzmfuo.jpg","https://files.catbox.moe/lgqabr.jpg","https://files.catbox.moe/rxoajf.jpg","https://files.catbox.moe/k1qck3.jpg","https://files.catbox.moe/al7u80.jpg"];commands.push({name:"sticker",description:"Create sticker from image/video",aliases:["s","stick"],async execute({msg:e,from:t,sock:a,react:i}){var s=e.message?.extendedTextMessage?.contextInfo?.quotedMessage,n=e.message?.imageMessage||s?.imageMessage,o=e.message?.videoMessage||s?.videoMessage;if(!n&&!o)return await i("❌"),sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *STICKER MAKER*
━━━━━━━━━━━━━━━━━━━
_Usage:_ Reply to image/video with ${config.PREFIX}sticker

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);await i("🎨");n=await downloadMedia(e.message?.imageMessage||e.message?.videoMessage?e:{...e,message:s}),o=await mediaProcessor.createSticker(n);await a.sendMessage(t,{sticker:o},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Sticker Created*
━━━━━━━━━━━━━━━━━━━
_🎨 Sticker created successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"toimage",description:"Convert sticker to image",aliases:["img","toimg"],async execute({msg:e,from:t,sock:a,react:i}){var s=e.message?.extendedTextMessage?.contextInfo?.quotedMessage;if(!e.message?.stickerMessage&&!s?.stickerMessage)return await i("❌"),sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🖼️ *STICKER TO IMAGE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ Reply to sticker with ${config.PREFIX}toimage

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);await i("🔄");s=await downloadMedia(e.message?.stickerMessage?e:{...e,message:s}),s=await mediaProcessor.stickerToImage(s);await a.sendMessage(t,{image:s,caption:`✅ *Converted to image*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Image Created*
━━━━━━━━━━━━━━━━━━━
_🖼️ Sticker converted to image successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"say",description:"Convert text to audio",aliases:["tts"],async execute({msg:e,from:t,args:a,sock:i,react:s}){if(!a.length)return await s("🗣️"),sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🗣️ *TEXT TO SPEECH*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}say <text>
_Example:_ ${config.PREFIX}say Hello world

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);a=a.join(" ").substring(0,200),await s("🗣️"),a=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(a)}&tl=en&client=tw-ob`,a=await axios({method:"GET",url:a,responseType:"arraybuffer",timeout:3e4}),a=Buffer.from(a.data),a=await mediaProcessor.toAudio(a);await i.sendMessage(t,{audio:a,mimetype:"audio/mpeg",ptt:!1},{quoted:e}),await sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Audio Created*
━━━━━━━━━━━━━━━━━━━
_🗣️ Text converted to audio successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}}),commands.push({name:"voice",description:"Convert text to voice note",aliases:["vn","voicenote"],async execute({msg:e,from:t,args:a,sock:i,react:s}){if(!a.length)return await s("🎤"),sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎤 *VOICE NOTE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}voice <text>
_Example:_ ${config.PREFIX}voice Hello world

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);a=a.join(" ").substring(0,200),await s("🎤"),a=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(a)}&tl=en&client=tw-ob`,a=await axios({method:"GET",url:a,responseType:"arraybuffer",timeout:3e4}),a=Buffer.from(a.data),a=await mediaProcessor.toPTT(a);await i.sendMessage(t,{audio:a,mimetype:"audio/ogg; codecs=opus",ptt:!0},{quoted:e}),await sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Voice Note Created*
━━━━━━━━━━━━━━━━━━━
_🎤 Voice note created successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}}),commands.push({name:"toaudio",description:"Extract audio from video",aliases:["mp3","extract"],async execute({msg:e,from:t,sock:a,react:i}){var s=e.message?.extendedTextMessage?.contextInfo?.quotedMessage;if(!e.message?.videoMessage&&!s?.videoMessage)return await i("❌"),sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎵 *AUDIO EXTRACTOR*
━━━━━━━━━━━━━━━━━━━
_Usage:_ Reply to video with ${config.PREFIX}toaudio

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);await i("🎵");s=await downloadMedia(e.message?.videoMessage?e:{...e,message:s}),s=await mediaProcessor.extractAudio(s);await a.sendMessage(t,{audio:s,mimetype:"audio/mpeg",ptt:!1},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Audio Extracted*
━━━━━━━━━━━━━━━━━━━
_🎵 Audio extracted from video successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"circle",description:"Make circular image",aliases:["round"],async execute({msg:e,from:t,sock:a,react:i}){var s=e.message?.extendedTextMessage?.contextInfo?.quotedMessage;if(!e.message?.imageMessage&&!s?.imageMessage)return await i("⭕"),sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⭕ *CIRCLE IMAGE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ Reply to image with ${config.PREFIX}circle

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);await i("🔄");s=await downloadMedia(e.message?.imageMessage?e:{...e,message:s}),s=await mediaProcessor.createCircle(s);await a.sendMessage(t,{image:s,caption:`✅ *Circular image created*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Circle Image Created*
━━━━━━━━━━━━━━━━━━━
_⭕ Image converted to circle successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"textpro",description:"Create text effects",aliases:["texteffect"],async execute({msg:e,from:t,args:a,sock:i,react:s,reply:n}){if(a.length<2)return await s("🎨"),sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎨 *TEXTPRO EFFECTS*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}textpro <effect> <text>

_Effects:_ 3d, neon, gold, fire, matrix

_Example:_ ${config.PREFIX}textpro 3d MEGAN

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);var o=a[0].toLowerCase(),a=a.slice(1).join(" "),r={"3d":"https://textpro.me/create-3d-text-effects-1046.html",neon:"https://textpro.me/neon-text-effect-1019.html",gold:"https://textpro.me/gold-text-effect-1060.html",fire:"https://textpro.me/fire-text-effect-1073.html",matrix:"https://textpro.me/matrix-style-text-effect-1107.html"}[o];if(!r)return await s("❌"),n(`❌ *Invalid effect!* Available: 3d, neon, gold, fire, matrix

> created by wanga`);await s("🎨");n=await axios.get("https://api.siputzx.my.id/api/m/textpro",{params:{url:r,text1:a},responseType:"arraybuffer",timeout:3e4});await i.sendMessage(t,{image:Buffer.from(n.data),caption:`🎨 *TextPro Effect*

_Effect:_ ${o}
_Text:_ ${a}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:e}),await sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Text Effect Created*
━━━━━━━━━━━━━━━━━━━
_🎨 Text effect created successfully!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}}),commands.push({name:"catbox",description:"Upload media to Catbox.moe",aliases:["cat"],async execute({msg:e,from:t,args:a,sock:i,react:s}){var n=e.message?.extendedTextMessage?.contextInfo?.quotedMessage;if(!(e.message?.imageMessage||e.message?.videoMessage||e.message?.audioMessage||n?.imageMessage||n?.videoMessage||n?.audioMessage)&&0===a.length)return await s("📤"),sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📤 *CATBOX UPLOAD*
━━━━━━━━━━━━━━━━━━━
_Usage:_ Reply to media with ${config.PREFIX}catbox
_Or:_ ${config.PREFIX}catbox <image url>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);await s("📤");var o=await uploadToCatbox(a=0<a.length&&a[0].startsWith("http")?(a=await axios.get(a[0],{responseType:"arraybuffer",timeout:3e4}),Buffer.from(a.data)):await downloadMedia(e.message?.imageMessage||e.message?.videoMessage||e.message?.audioMessage?e:{...e,message:n}),n=`upload_${Date.now()}.jpg`);await sendButtonMenu(i,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`✅ *Uploaded*
━━━━━━━━━━━━━━━━━━━
_📁 File:_ ${n}
_📦 Size:_ ${formatFileSize(a.length)}
_🔗 URL:_ ${o}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy URL",copy_code:o})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🔗 Open Link",url:o})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}}),commands.push({name:"waifu",description:"Get random waifu image",aliases:["waifuimg"],async execute({msg:e,from:t,sock:a,react:i}){await i("🌸");var s=await axios.get("https://api.siputzx.my.id/api/r/waifu",{responseType:"arraybuffer",timeout:1e4});await a.sendMessage(t,{image:Buffer.from(s.data),caption:`🌸 *Random Waifu*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌸 *Random Waifu*
━━━━━━━━━━━━━━━━━━━
_Enjoy your waifu image!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"waifu",text:"🔄 Another"},{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"neko",description:"Get random neko girl image",aliases:["nekogirl"],async execute({msg:e,from:t,sock:a,react:i}){await i("🐱");var s=await axios.get("https://api.siputzx.my.id/api/r/neko",{responseType:"arraybuffer",timeout:1e4});await a.sendMessage(t,{image:Buffer.from(s.data),caption:`🐱 *Random Neko*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:e}),await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🐱 *Random Neko*
━━━━━━━━━━━━━━━━━━━
_Enjoy your neko image!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"neko",text:"🔄 Another"},{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"meme",description:"Get random meme from collection",aliases:["randommeme","memes"],async execute({msg:t,from:a,sock:i,react:s}){await s("😂");var e=MEME_IMAGES[Math.floor(Math.random()*MEME_IMAGES.length)];try{var n=await axios.get(e,{responseType:"arraybuffer",timeout:15e3}),o=Buffer.from(n.data);await i.sendMessage(a,{image:o,caption:`😂 *Random Meme*

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:t}),await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`😂 *Random Meme*
━━━━━━━━━━━━━━━━━━━
_Enjoy your meme!_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"meme",text:"🔄 Another"},{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}catch(e){console.error("Meme error:",e),await s("❌"),await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Failed to get meme*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"cleantemp",description:"Clean temporary files",aliases:["cleantemp"],async execute({msg:e,from:t,sock:a,react:i}){await i("🧹");var s=await mediaProcessor.cleanup();await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🧹 *Cleanup Complete*
━━━━━━━━━━━━━━━━━━━
_🗑️ Deleted:_ ${s.deleted} temp files
_💾 Freed:_ ${formatFileSize(s.freed||0)}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"media",text:"🎵 Media"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"media",description:"Show all media commands",aliases:["mediahelp"],async execute({msg:e,from:t,sock:a,react:i}){var s=config.PREFIX;await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🛠️ *MEDIA COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*🎨 STICKERS*
`+`_${s}sticker_ - Make sticker
`+`_${s}toimage_ - Sticker to image

`+`*🎵 AUDIO*
`+`_${s}say_ - Text to speech
`+`_${s}voice_ - Voice note
`+`_${s}toaudio_ - Extract audio

`+`*🖼️ IMAGE*
`+`_${s}circle_ - Circular image
`+`_${s}textpro_ - Text effects
`+`_${s}waifu_ - Random waifu
`+`_${s}neko_ - Random neko
`+`_${s}meme_ - Random meme

`+`*📤 UPLOAD*
`+`_${s}catbox_ - Upload to Catbox
`+`_${s}cleantemp_ - Clean temp files

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),module.exports={commands:commands};