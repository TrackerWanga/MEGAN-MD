async function sendButtonMenu(a,e,n,o){var t=require("gifted-btns").sendButtons;try{return await t(a,e,{title:n.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n.text,footer:n.footer||"> created by wanga",image:n.image?{url:n.image}:null,buttons:n.buttons||[]},{quoted:o})}catch(t){console.error("Button error:",t),await a.sendMessage(e,{text:n.text},{quoted:o})}}async function downloadFile(t,a){let n=path.join(TEMP_DIR,a),o=await axios({method:"GET",url:t,responseType:"stream",headers:{"User-Agent":"Mozilla/5.0"},timeout:3e5,maxContentLength:1/0,maxBodyLength:1/0});return new Promise((t,a)=>{var e=fs.createWriteStream(n);o.data.pipe(e),e.on("finish",()=>t(n)),e.on("error",a)})}function cleanFilename(t){return t.replace(/[^\w\s.-]/gi,"").substring(0,50)}function formatDuration(t){return t?Math.floor(t/60)+":"+(t%60).toString().padStart(2,"0"):"N/A"}function formatNumber(t){return t?1e6<=t?(t/1e6).toFixed(1)+"M":1e3<=t?(t/1e3).toFixed(1)+"K":t.toString():"N/A"}function getThumbnailUrl(t){return`https://img.youtube.com/vi/${t}/hqdefault.jpg`}function extractVideoId(t){t=t.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);return t?t[1]:null}function extractSpotifyId(t){t=t.match(/track\/([a-zA-Z0-9]+)/);return t?t[1]:null}let axios=require("axios"),yts=require("yt-search"),fs=require("fs-extra"),path=require("path"),config=require("../../megan/config"),commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png",TEMP_DIR=path.join(__dirname,"../../temp");fs.ensureDirSync(TEMP_DIR),setInterval(async()=>{try{var a,e=await fs.readdir(TEMP_DIR);let t=0;for(a of e)try{await fs.unlink(path.join(TEMP_DIR,a)),t++}catch(t){}0<t&&console.log(`🧹 Cleaned ${t} temp files`)}catch(t){}},18e5),commands.push({name:"play",description:"Search and download audio",aliases:["song"],async execute({msg:u,from:d,args:t,bot:a,sock:c,react:m}){if(!t.length)return await m("ℹ️"),sendButtonMenu(c,d,{title:"🎵 𝐏𝐋𝐀𝐘",text:`_Usage:_ ${config.PREFIX}play <song name>
_Example:_ ${config.PREFIX}play siski by meja

_🎧 Search and download any song_`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},u);let _=t.join(" "),f=null;await m("🔍"),await sendButtonMenu(c,d,{title:"🔍 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆",text:`_Query:_ "${_}"

_🎵 Looking for your song..._`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},u);try{var g=(await yts(_)).videos.slice(0,5);if(0===g.length)throw new Error("No results found");let t=g[0],a=t.videoId,e=t.title,n=t.timestamp||formatDuration(t.duration),o=t.author?.name||"Unknown",i=formatNumber(t.views),r=getThumbnailUrl(a),s=(await c.sendMessage(d,{image:{url:r},caption:`🎵 *𝐒𝐎𝐍𝐆 𝐅𝐎𝐔𝐍𝐃*
━━━━━━━━━━━━━━━━━━━
_🎤 Title:_ *${e}*
_⏱️ Duration:_ ${n}
_👤 Channel:_ ${o}
_👁️ Views:_ ${i}

_⬇️ Downloading your track..._`},{quoted:u}),"https://www.youtube.com/watch?v="+a),l=null;try{var w=await axios.get("https://apis.xwolf.space/download/dlmp3",{params:{url:s},timeout:2e4});w.data?.success&&w.data?.downloadUrl&&(l=w.data.downloadUrl)}catch(t){}if(!l)try{var p=await axios.get("https://apis.xwolf.space/download/audio",{params:{url:s},timeout:2e4});p.data?.success&&p.data?.downloadUrl&&(l=p.data.downloadUrl)}catch(t){}if(!l)throw new Error("Download failed");var y=`play_${Date.now()}.mp3`,h=(f=await downloadFile(l,y),await fs.readFile(f)),b=(h.length/1048576).toFixed(2);await c.sendMessage(d,{audio:h,mimetype:"audio/mpeg",ptt:!1,fileName:cleanFilename(e)+".mp3",caption:`🎵 *${e}*

_ᴄʀᴇᴀᴛᴏʀ:_ Wanga
_sɪᴢᴇ:_ ${b} MB

_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`},{quoted:u}),await sendButtonMenu(c,d,{title:"✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄",text:"_Enjoy your music!_",footer:"> created by wanga",buttons:[{id:config.PREFIX+"play",text:"🎵 Another Song"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},u),await m("✅")}catch(t){a.logger.error("Play error:",t),await m("❌"),await sendButtonMenu(c,d,{title:"❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃",text:`_Try again later._

> created by wanga`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},u)}finally{f&&await fs.pathExists(f)&&await fs.unlink(f).catch(()=>{})}}}),commands.push({name:"ytmp3",description:"Convert YouTube URL to MP3 audio",aliases:["ytaudio"],async execute({msg:a,from:e,args:t,bot:n,sock:o,react:i}){if(!t.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"🎵 𝐘𝐓𝐌𝐏𝟑",text:`_Usage:_ ${config.PREFIX}ytmp3 <YouTube URL>
_Example:_ ${config.PREFIX}ytmp3 https://youtu.be/...

_🎧 Convert YouTube to MP3_`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);let r=t[0],s=null;await i("🔗"),await sendButtonMenu(o,e,{title:"🔗 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆",text:`_URL:_ ${r}

_🎵 Converting to MP3..._`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);try{if(!r.includes("youtube.com")&&!r.includes("youtu.be"))throw new Error("Invalid YouTube URL");var l=extractVideoId(r);if(!l)throw new Error("Invalid video ID");var u=(await yts({videoId:l})).videos[0];if(!u)throw new Error("Video not found");var d,c=u.title,m=u.timestamp||formatDuration(u.duration),_=u.author?.name||"Unknown",f=getThumbnailUrl(l),g=(await o.sendMessage(e,{image:{url:f},caption:`🎵 *𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐔𝐍𝐃*
━━━━━━━━━━━━━━━━━━━
_🎤 Title:_ *${c}*
_⏱️ Duration:_ ${m}
_👤 Channel:_ ${_}

_⬇️ Converting to MP3..._`},{quoted:a}),["https://apis.xwolf.space/download/ytmp3?url="+encodeURIComponent(r),"https://apis.xwolf.space/download/audio?url="+encodeURIComponent(r),"https://apis.xwolf.space/download/dlmp3?url="+encodeURIComponent(r)]);let t=null;for(d of g)try{var w=await axios.get(d,{timeout:3e4});if(w.data?.success&&w.data?.downloadUrl){t=w.data.downloadUrl;break}}catch(t){}if(!t)throw new Error("Download failed");var p=`ytmp3_${Date.now()}.mp3`,y=(s=await downloadFile(t,p),await fs.readFile(s)),h=(y.length/1048576).toFixed(2);await o.sendMessage(e,{audio:y,mimetype:"audio/mpeg",ptt:!1,fileName:cleanFilename(c)+".mp3",caption:`🎵 *${c}*

_ᴄʀᴇᴀᴛᴏʀ:_ Wanga
_sɪᴢᴇ:_ ${h} MB

_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`},{quoted:a}),await sendButtonMenu(o,e,{title:"✅ 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄",text:"_Enjoy your audio!_",footer:"> created by wanga",buttons:[{id:config.PREFIX+"ytmp3",text:"🎵 Another URL"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a),await i("✅")}catch(t){n.logger.error("YTMP3 error:",t),await i("❌"),await sendButtonMenu(o,e,{title:"❌ 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐅𝐀𝐈𝐋𝐄𝐃",text:`_Check URL and try again._

> created by wanga`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a)}finally{s&&await fs.pathExists(s)&&await fs.unlink(s).catch(()=>{})}}}),commands.push({name:"ytmp4",description:"Convert YouTube URL to MP4 video",aliases:["ytvideo"],async execute({msg:a,from:e,args:t,bot:n,sock:o,react:i}){if(!t.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"🎬 𝐘𝐓𝐌𝐏𝟒",text:`_Usage:_ ${config.PREFIX}ytmp4 <YouTube URL>
_Example:_ ${config.PREFIX}ytmp4 https://youtu.be/...

_🎬 Download YouTube videos_`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);let r=t[0],s=null;await i("🔗"),await sendButtonMenu(o,e,{title:"🔗 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆",text:`_URL:_ ${r}

_🎬 Fetching video..._`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);try{if(!r.includes("youtube.com")&&!r.includes("youtu.be"))throw new Error("Invalid YouTube URL");var l=extractVideoId(r);if(!l)throw new Error("Invalid video ID");var u=(await yts({videoId:l})).videos[0];if(!u)throw new Error("Video not found");var d,c=u.title,m=u.timestamp||formatDuration(u.duration),_=u.author?.name||"Unknown",f=formatNumber(u.views),g=getThumbnailUrl(l),w=(await o.sendMessage(e,{image:{url:g},caption:`🎬 *𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐔𝐍𝐃*
━━━━━━━━━━━━━━━━━━━
_🎤 Title:_ *${c}*
_⏱️ Duration:_ ${m}
_👤 Channel:_ ${_}
_👁️ Views:_ ${f}

_⬇️ Downloading video..._`},{quoted:a}),["https://apis.xwolf.space/download/mp4?url="+encodeURIComponent(r),"https://apis.xwolf.space/download/video?url="+encodeURIComponent(r)]);let t=null;for(d of w)try{var p=await axios.get(d,{timeout:3e4});if(p.data?.success&&p.data?.downloadUrl){t=p.data.downloadUrl;break}}catch(t){}if(!t)throw new Error("Download failed");var y=`ytmp4_${Date.now()}.mp4`,h=(s=await downloadFile(t,y),await fs.readFile(s)),b=(h.length/1048576).toFixed(2);await o.sendMessage(e,{video:h,caption:`🎬 *${c}*

_ᴄʀᴇᴀᴛᴏʀ:_ Wanga
_sɪᴢᴇ:_ ${b} MB

_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎬`},{quoted:a}),await sendButtonMenu(o,e,{title:"✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄",text:"_Enjoy your video!_",footer:"> created by wanga",buttons:[{id:config.PREFIX+"ytmp4",text:"🎬 Another URL"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a),await i("✅")}catch(t){n.logger.error("YTMP4 error:",t),await i("❌"),await sendButtonMenu(o,e,{title:"❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃",text:`_Check URL and try again._

> created by wanga`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a)}finally{s&&await fs.pathExists(s)&&await fs.unlink(s).catch(()=>{})}}}),commands.push({name:"spotifydl",description:"Download Spotify track",aliases:["spdl","sdd"],async execute({msg:a,from:e,args:t,bot:n,sock:o,react:i}){if(!t.length)return await i("ℹ️"),sendButtonMenu(o,e,{title:"🎵 𝐒𝐏𝐎𝐓𝐈𝐅𝐘",text:`_Usage:_ ${config.PREFIX}spotifydl <song name or URL>
_Example:_ ${config.PREFIX}spotifydl Maintain by ssaru

_🎧 Download from Spotify_`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);let r=t.join(" "),s=null;await i("🔍"),await sendButtonMenu(o,e,{title:"🔍 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆",text:`_Query:_ "${r}"

_🎵 Looking for track..._`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);try{let t;if(r.includes("spotify.com")||r.includes("open.spotify")){var l=extractSpotifyId(r);if(!l)throw new Error("Invalid Spotify URL");t=await axios.get("https://apis.xwolf.space/api/spotify/download",{params:{id:l},timeout:3e4})}else t=await axios.get("https://apis.xwolf.space/api/spotify/download",{params:{q:r},timeout:3e4});if(!t.data?.success)throw new Error("Track not found");var u=t.data,d=(u.albumArt&&await o.sendMessage(e,{image:{url:u.albumArt},caption:`🎵 *𝐓𝐑𝐀𝐂𝐊 𝐅𝐎𝐔𝐍𝐃*
━━━━━━━━━━━━━━━━━━━
_🎤 Title:_ *${u.title}*
_👤 Artist:_ ${u.artist}
_💿 Album:_ ${u.album||"Single"}

_⬇️ Downloading track..._`},{quoted:a}),`spotify_${Date.now()}.mp3`),c=(s=await downloadFile(u.downloadUrl,d),await fs.readFile(s)),m=(c.length/1048576).toFixed(2);await o.sendMessage(e,{audio:c,mimetype:"audio/mpeg",ptt:!1,fileName:cleanFilename(u.title)+".mp3",caption:`🎵 *${u.title}*

_ᴄʀᴇᴀᴛᴏʀ:_ Wanga
_sɪᴢᴇ:_ ${m} MB

_ᴛʜᴀɴᴋs ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴇɢᴀɴ ᴍᴅ_ 🎧`},{quoted:a}),await sendButtonMenu(o,e,{title:"✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄",text:"_Enjoy your track!_",footer:"> created by wanga",buttons:[{id:config.PREFIX+"spotifydl",text:"🎵 Another Track"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a),await i("✅")}catch(t){n.logger.error("Spotify error:",t),await i("❌"),await sendButtonMenu(o,e,{title:"❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃",text:`_Try again later._

> created by wanga`,footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a)}finally{s&&await fs.pathExists(s)&&await fs.unlink(s).catch(()=>{})}}}),commands.push({name:"downloadhelp",description:"Show all downloader commands",aliases:["dlhelp","playhelp","downloader"],async execute({msg:t,from:a,sock:e,react:n}){var o=config.PREFIX;await sendButtonMenu(e,a,{title:"🎵 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑",text:`🎵 *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*🎬 YOUTUBE*
`+`_${o}play <song name>_ - Search & download audio
`+`_${o}ytmp3 <URL>_ - YouTube to MP3
`+`_${o}ytmp4 <URL>_ - YouTube to MP4

`+`*🎵 SPOTIFY*
`+`_${o}spotifydl <song/URL>_ - Download Spotify

`+`*🎧 SOUNDCLOUD*
`+`_${o}soundcloud <URL>_ - Download SoundCloud

`+`*📱 SOCIAL MEDIA*
`+`_${o}tiktokdl <URL>_ - TikTok videos
`+`_${o}instagramdl <URL>_ - Instagram posts/reels
`+`_${o}facebookdl <URL>_ - Facebook videos

`+`*🌐 UNIVERSAL*
`+`_${o}savefrom <URL>_ - Download from any platform
`+`_${o}dlfiles <URL>_ - Direct file download

`+"> created by wanga",footer:"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await n("✅")}}),module.exports={commands:commands};