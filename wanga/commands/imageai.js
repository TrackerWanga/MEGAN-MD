async function safeApiCall(a,e=null){try{return await Promise.race([a(),new Promise((a,e)=>setTimeout(()=>e(new Error("Request timeout")),TIMEOUT))])}catch(a){if(console.error("API Error:",a.message),e)return e;throw a}}async function downloadImage(a,e){var e=path.join(TEMP_DIR,e),t=await safeApiCall(()=>axios({method:"GET",url:a,responseType:"arraybuffer",headers:{"User-Agent":"Mozilla/5.0"}}));return await fs.writeFile(e,t.data),e}async function getQuotedImage(a,e){try{var t,i,o,r=a.message?.extendedTextMessage?.contextInfo?.quotedMessage;return r&&r.imageMessage?(t=await require("gifted-baileys").downloadMediaMessage({key:{id:a.message.extendedTextMessage.contextInfo.stanzaId},message:r},"buffer",{},{logger:console}),i=`image_${Date.now()}.jpg`,o=path.join(TEMP_DIR,i),await fs.writeFile(o,t),o):null}catch(a){return console.error("Error extracting quoted image:",a),null}}async function sendImage(a,e,t,i,o,r=null,n="🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐑𝐄𝐀𝐃𝐘"){try{var s=await fs.readFile(t);return r?await r.send(e,{title:n,text:i+CREATOR,footer:"✦ ᴍᴇɢᴀɴ-ᴍᴅ ᴀɪ ꜱʏꜱᴛᴇᴍ ✦",buttons:[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Join Official Channel",url:CHANNEL_LINK})},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Bot Prefix",id:"copy_prefix",copy_code:config.PREFIX})}]},o):await a.sendMessage(e,{image:s,caption:i+CREATOR},{quoted:o}),await fs.unlink(t).catch(()=>{}),!0}catch(a){throw await fs.pathExists(t)&&await fs.unlink(t).catch(()=>{}),a}}async function sendError(a,e,t,i=null){i=i||`╭━━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 〕━━━┈
┃ ❌ Oops! Something went wrong.
┃ 🔄 Please try again later.
╰━━━━━━━━━━━━━━━┈`+CREATOR;await a.sendMessage(e,{text:i},{quoted:t})}let axios=require("axios"),FormData=require("form-data"),fs=require("fs-extra"),path=require("path"),config=require("../../megan/config"),uploader=require("../../megan/lib/upload"),commands=[],TEMP_DIR=path.join(__dirname,"../../temp"),CHANNEL_LINK=(fs.ensureDirSync(TEMP_DIR),"https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b"),TIMEOUT=15e3,CREATOR="\n\n> 👨‍💻 *𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐰𝐚𝐧𝐠𝐚*";commands.push({name:"image",description:"Search for high-quality images",aliases:["img","picsum"],async execute({msg:e,from:t,args:a,bot:i,sock:o,react:r,reply:n,buttons:s}){if(!a.length)return await r("ℹ️"),n(`╭━━━〔 🖼️ 𝐈𝐌𝐀𝐆𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━━┈
┃
┃ *Usage:* ${config.PREFIX}image <search term>
┃ *Example:* ${config.PREFIX}image beautiful sunset
┃
╰━━━━━━━━━━━━━━━┈`+CREATOR);let l=a.join(" "),g=[];await r("🔍");try{var m=await safeApiCall(()=>axios.get("https://picsum.photos/800/600?random="+Date.now(),{responseType:"arraybuffer",timeout:TIMEOUT})),u=`search_${Date.now()}.jpg`,c=path.join(TEMP_DIR,u);await fs.writeFile(c,m.data),g.push(c),await sendImage(o,t,c,`╭━━━〔 📸 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓 〕━━━┈
┃ 🎯 *Query:* "${l}"
┃ 🌐 *Source:* Picsum
╰━━━━━━━━━━━━━━━┈`,e,s,"🔍 𝐈𝐌𝐀𝐆𝐄 𝐅𝐎𝐔𝐍𝐃");try{var p,d,f=await safeApiCall(()=>axios.get("https://api.siputzx.my.id/api/tools/unsplash?query="+encodeURIComponent(l),{timeout:TIMEOUT}));f.data?.data?.urls?.regular&&(p=`unsplash_${Date.now()}.jpg`,d=await downloadImage(f.data.data.urls.regular,p),g.push(d),await new Promise(a=>setTimeout(a,1500)),await sendImage(o,t,d,`╭━━━〔 📸 𝐔𝐍𝐒𝐏𝐋𝐀𝐒𝐇 𝐑𝐄𝐒𝐔𝐋𝐓 〕━━━┈
┃ 🎯 *Query:* "${l}"
┃ 👤 *Photographer:* ${f.data.data.user?.name||"Unknown"}
╰━━━━━━━━━━━━━━━┈`,null,s,"🌟 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐈𝐌𝐀𝐆𝐄"))}catch(a){console.log("Unsplash fallback failed:",a.message)}await r("✅")}catch(a){i.logger.error("Image search error:",a),await r("❌");var w,n=`╭━━━〔 ⚠️ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃 〕━━━┈
┃ ❌ No images found for "${l}".
┃ 🔄 Try different keywords.
╰━━━━━━━━━━━━━━━┈`+CREATOR;await sendError(o,t,e,a.message.includes("timeout")?`╭━━━〔 ⚠️ 𝐓𝐈𝐌𝐄𝐎𝐔𝐓 〕━━━┈
┃ ❌ Request timed out.
┃ 🔄 Please try again.
╰━━━━━━━━━━━━━━━┈`+CREATOR:n);for(w of g)await fs.pathExists(w)&&await fs.unlink(w).catch(()=>{})}}}),commands.push({name:"imagine",description:"Generate AI images",aliases:["gen","dream","imagineai"],async execute({msg:e,from:t,args:a,bot:i,sock:o,react:r,reply:n,buttons:s}){if(!a.length)return await r("ℹ️"),n(`╭━━━〔 🎨 𝐈𝐌𝐀𝐆𝐈𝐍𝐄 𝐀𝐈 〕━━━┈
┃
┃ *Usage:* ${config.PREFIX}imagine <prompt>
┃ *Example:* ${config.PREFIX}imagine cyberpunk city at night, neon lights
┃
╰━━━━━━━━━━━━━━━┈`+CREATOR);let l=a.join(" "),g=null;await r("🎨");try{await o.sendMessage(t,{text:`╭━━━〔 ⚙️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐍𝐆 〕━━━┈
┃ 🎨 *Dreaming up your image...*
┃ 💭 *Prompt:* "${l}"
┃ ⏱️ *Please wait a moment!*
╰━━━━━━━━━━━━━━━┈`+CREATOR},{quoted:e});var m=`https://image.pollinations.ai/prompt/${encodeURIComponent(l)}?width=1024&height=1024&nologo=true`,u=`imagine_${Date.now()}.jpg`;await sendImage(o,t,g=await downloadImage(m,u),`╭━━━〔 ✨ 𝐀𝐈 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 〕━━━┈
┃ 🎨 *Prompt:* ${l}
┃ ⚡ *Engine:* Pollinations AI
╰━━━━━━━━━━━━━━━┈`,e,s,"✨ 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 𝐑𝐄𝐀𝐃𝐘"),await r("✅")}catch(a){i.logger.error("Imagine error:",a),await r("🔄");try{let a=new FormData;a.append("prompt",l);var c=await safeApiCall(()=>axios({method:"POST",url:"https://api.siputzx.my.id/api/ai/duckaiimage",data:a,headers:{...a.getHeaders()},responseType:"arraybuffer"})),p=`imagine_fallback_${Date.now()}.png`;g=path.join(TEMP_DIR,p),await fs.writeFile(g,c.data),await sendImage(o,t,g,`╭━━━〔 ✨ 𝐀𝐈 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 (Fallback) 〕━━━┈
┃ 🎨 *Prompt:* ${l}
┃ ⚡ *Engine:* DuckAI
╰━━━━━━━━━━━━━━━┈`,e,s,"✨ 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 𝐑𝐄𝐀𝐃𝐘"),await r("✅")}catch(a){await r("❌"),await sendError(o,t,e,`╭━━━〔 ⚠️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃 〕━━━┈
┃ ❌ Couldn't generate image.
┃ 🔄 Try a simpler prompt.
╰━━━━━━━━━━━━━━━┈`+CREATOR)}g&&await fs.pathExists(g)&&await fs.unlink(g).catch(()=>{})}}}),commands.push({name:"create",description:"Create logo/text images",aliases:["logo","textlogo"],async execute({msg:e,from:t,args:a,bot:i,sock:o,react:r,reply:n,buttons:s}){if(!a.length)return await r("ℹ️"),n(`╭━━━〔 🔥 𝐋𝐎𝐆𝐎 𝐌𝐀𝐊𝐄𝐑 〕━━━┈
┃
┃ *Usage:* ${config.PREFIX}create <text>
┃ *Example:* ${config.PREFIX}create Megan AI
┃
╰━━━━━━━━━━━━━━━┈`+CREATOR);let l=a.join(" "),g=null;await r("🔥");try{await o.sendMessage(t,{text:`╭━━━〔 ⚙️ 𝐂𝐑𝐄𝐀𝐓𝐈𝐍𝐆 𝐋𝐎𝐆𝐎 〕━━━┈
┃ ✨ *Forging your design...*
┃ 📝 *Text:* "${l}"
╰━━━━━━━━━━━━━━━┈`+CREATOR},{quoted:e});var m=`https://image.pollinations.ai/prompt/3d%20logo%20design%20${encodeURIComponent(l)}?width=800&height=400&nologo=true`,u=`logo_${Date.now()}.jpg`;await sendImage(o,t,g=await downloadImage(m,u),`╭━━━〔 🔥 𝐋𝐎𝐆𝐎 𝐂𝐑𝐄𝐀𝐓𝐄𝐃 〕━━━┈
┃ 📝 *Text Rendered:* ${l}
╰━━━━━━━━━━━━━━━┈`,e,s,"🎨 𝐘𝐎𝐔𝐑 𝐋𝐎𝐆𝐎"),await r("✅")}catch(a){i.logger.error("Create error:",a),await r("❌"),await sendError(o,t,e,`╭━━━〔 ⚠️ 𝐂𝐑𝐄𝐀𝐓𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃 〕━━━┈
┃ ❌ Couldn't create logo for "${l}".
┃ 🔄 Try different text.
╰━━━━━━━━━━━━━━━┈`+CREATOR),g&&await fs.pathExists(g)&&await fs.unlink(g).catch(()=>{})}}}),commands.push({name:"beautiful",description:'Add "beautiful" caption to an image',aliases:["bful"],async execute({msg:o,from:r,bot:e,sock:n,react:s,reply:a,buttons:l}){var g=await getQuotedImage(o,n);if(!g)return await s("❌"),a(`╭━━━〔 ✨ 𝐁𝐄𝐀𝐔𝐓𝐈𝐅𝐔𝐋 𝐅𝐈𝐋𝐓𝐄𝐑 〕━━━┈
┃
┃ 📸 *Reply to an image* with:
┃ ${config.PREFIX}beautiful
┃
╰━━━━━━━━━━━━━━━┈`+CREATOR);let m=null;await s("✨");try{let a=await fs.readFile(g),e=(await uploader.uploadAuto(a,`beautiful_${Date.now()}.jpg`)).url,t=await safeApiCall(()=>axios.get("https://api.siputzx.my.id/api/canvas/beautiful",{params:{image:e},responseType:"arraybuffer",timeout:TIMEOUT})),i=`beautiful_${Date.now()}.jpg`;m=path.join(TEMP_DIR,i),await fs.writeFile(m,t.data),await sendImage(n,r,m,`╭━━━〔 🌺 𝐄𝐅𝐅𝐄𝐂𝐓 𝐀𝐏𝐏𝐋𝐈𝐄𝐃 〕━━━┈
┃ ✨ Beautiful filter added successfully!
╰━━━━━━━━━━━━━━━┈`,o,l,"✨ 𝐀𝐖𝐄𝐒𝐎𝐌𝐄 𝐑𝐄𝐒𝐔𝐋𝐓"),await s("✅")}catch(a){e.logger.error("Beautiful effect error:",a),await s("❌"),await sendError(n,r,o)}finally{await fs.pathExists(g)&&await fs.unlink(g).catch(()=>{}),m&&await fs.pathExists(m)&&await fs.unlink(m).catch(()=>{})}}}),commands.push({name:"removebg",description:"Remove image background",aliases:["nobg","rmbg"],async execute({msg:o,from:r,bot:e,sock:n,react:s,reply:a,buttons:l}){var g=await getQuotedImage(o,n);if(!g)return await s("❌"),a(`╭━━━〔 ✂️ 𝐑𝐄𝐌𝐎𝐕𝐄 𝐁𝐆 〕━━━┈
┃
┃ 📸 *Reply to an image* with:
┃ ${config.PREFIX}removebg
┃
╰━━━━━━━━━━━━━━━┈`+CREATOR);let m=null;await s("✂️");try{let a=await fs.readFile(g),e=(await uploader.uploadAuto(a,`removebg_${Date.now()}.jpg`)).url,t=await safeApiCall(()=>axios.get("https://api.siputzx.my.id/api/ai/removebg",{params:{image:e},responseType:"arraybuffer",timeout:TIMEOUT})),i=`nobg_${Date.now()}.png`;m=path.join(TEMP_DIR,i),await fs.writeFile(m,t.data),await sendImage(n,r,m,`╭━━━〔 ✂️ 𝐁𝐆 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 〕━━━┈
┃ 🌟 Background erased successfully!
╰━━━━━━━━━━━━━━━┈`,o,l,"✂️ 𝐓𝐑𝐀𝐍𝐒𝐏𝐀𝐑𝐄𝐍𝐓 𝐈𝐌𝐀𝐆𝐄"),await s("✅")}catch(a){e.logger.error("RemoveBG error:",a),await s("❌"),await sendError(n,r,o)}finally{await fs.pathExists(g)&&await fs.unlink(g).catch(()=>{}),m&&await fs.pathExists(m)&&await fs.unlink(m).catch(()=>{})}}}),commands.push({name:"imagemen",description:"Show all image commands",aliases:["imgmenu","imagemenu"],async execute({msg:a,from:e,sock:t,react:i,buttons:o}){var r="╭━━━〔 🎨 𝐈𝐌𝐀𝐆𝐄 𝐒𝐓𝐔𝐃𝐈𝐎 〕━━━┈\n┃ Welcome to the AI Image toolkit!\n┃\n┣━━〔 ⚡ 𝐐𝐔𝐈𝐂𝐊 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 〕━━┈\n"+`┃ 🔹 ${config.PREFIX}image <search>
`+`┃ 🔹 ${config.PREFIX}imagine <prompt>
`+`┃ 🔹 ${config.PREFIX}create <text>
`+`┃ 🔹 ${config.PREFIX}beautiful (reply)
`+`┃ 🔹 ${config.PREFIX}removebg (reply)
`+`┃
`+`┣━━〔 📝 𝐄𝐗𝐀𝐌𝐏𝐋𝐄𝐒 〕━━┈
`+`┃ 🔸 ${config.PREFIX}imagine a robot in space
`+`┃ 🔸 ${config.PREFIX}create Neon Vibes
`+"╰━━━━━━━━━━━━━━━┈",n={title:"🎨 𝐌𝐄𝐆𝐀𝐍 𝐈𝐌𝐀𝐆𝐄 𝐀𝐈",text:r,footer:"✦ ᴇxᴘʟᴏʀᴇ ʏᴏᴜʀ ᴄʀᴇᴀᴛɪᴠɪᴛʏ ✦",buttons:[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Join Our Community",url:CHANNEL_LINK})},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Imagine Example",id:"copy_imagine",copy_code:config.PREFIX+"imagine a futuristic cyberpunk city at night"})}]};o?await o.send(e,n,a):await t.sendMessage(e,{text:r+CREATOR},{quoted:a}),await i("✨")}}),module.exports={commands:commands};