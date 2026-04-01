function formatNumber(e){return e?1e6<=e?(e/1e6).toFixed(1)+"M":1e3<=e?(e/1e3).toFixed(1)+"K":e.toString():"N/A"}function formatDuration(e){return e?Math.floor(e/60)+":"+(e%60).toString().padStart(2,"0"):"N/A"}function cleanText(e,t=200){return e?(e=e.replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim()).length>t?e.substring(0,t)+"...":e:""}async function sendButtonMenu(t,a,n,i){var e=require("gifted-btns").sendButtons;try{return await e(t,a,{title:n.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n.text,footer:n.footer||"> created by wanga",image:n.image?{url:n.image}:null,buttons:n.buttons||[]},{quoted:i})}catch(e){console.error("Button error:",e),await t.sendMessage(a,{text:n.text},{quoted:i})}}let axios=require("axios"),yts=require("yt-search"),cheerio=require("cheerio"),translate=require("@iamtraction/google-translate"),config=require("../../megan/config"),commands=[],CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png";commands.push({name:"google",description:"Search Google via DuckDuckGo",aliases:["g"],async execute({msg:t,from:r,args:o,bot:a,sock:s,react:u}){if(!o.length)return await u("🔍"),sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔍 *Google Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}google <query>
_Example:_ ${config.PREFIX}google Megan MD

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);o=o.join(" ");await u("🔍");try{let e=await axios.get("https://html.duckduckgo.com/html",{params:{q:o},headers:{"User-Agent":"Mozilla/5.0"},timeout:1e4}),n=cheerio.load(e.data),i=[];if(n(".result").each((e,t)=>{var a;e<10&&(e=n(t).find(".result__title").text().trim(),a=n(t).find(".result__url").text().trim(),t=n(t).find(".result__snippet").text().trim(),e)&&a&&i.push({title:e,url:a.startsWith("http")?a:"https://"+a,snippet:t})}),0===i.length)throw new Error("No results found");let a=`🔍 *GOOGLE SEARCH*
━━━━━━━━━━━━━━━━━━━
_Query:_ "${o}"
_Results:_ ${i.length}

`;i.forEach((e,t)=>{a+=`*${t+1}. ${e.title}*
📎 ${e.url}
${e.snippet?`📝 ${e.snippet}
`:""}
`}),await sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await u("✅")}catch(e){a.logger.error("Google search error:",e),await u("❌"),await sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Search Failed*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"bing",description:"Search Bing",aliases:["bing"],async execute({msg:t,from:r,args:o,bot:a,sock:s,react:u}){if(!o.length)return await u("🔍"),sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔍 *Bing Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}bing <query>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);o=o.join(" ");await u("🔍");try{let e=await axios.get("https://www.bing.com/search",{params:{q:o},headers:{"User-Agent":"Mozilla/5.0"},timeout:1e4}),n=cheerio.load(e.data),i=[];if(n("#b_results .b_algo").each((e,t)=>{var a;e<10&&(e=n(t).find("h2").text().trim(),a=n(t).find("h2 a").attr("href"),t=n(t).find(".b_caption p").text().trim(),e)&&a&&i.push({title:e,url:a,description:t})}),0===i.length)throw new Error("No results found");let a=`🔍 *BING SEARCH*
━━━━━━━━━━━━━━━━━━━
_Query:_ "${o}"
_Results:_ ${i.length}

`;i.forEach((e,t)=>{a+=`*${t+1}. ${e.title}*
📎 ${e.url}
${e.description?`📝 ${e.description}
`:""}
`}),await sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await u("✅")}catch(e){a.logger.error("Bing error:",e),await u("❌"),await sendButtonMenu(s,r,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Search Failed*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"duckduckgo",description:"Search DuckDuckGo",aliases:["ddg"],async execute({msg:t,from:n,args:i,bot:a,sock:r,react:o}){if(!i.length)return await o("🦆"),sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🦆 *DuckDuckGo Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}duckduckgo <query>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);i=i.join(" ");await o("🦆");try{var s=await axios.get("https://api.siputzx.my.id/api/s/duckduckgo",{params:{query:i,kl:"us-en",df:"w"},timeout:1e4});if(!s.data?.status||!s.data.data?.results)throw new Error("No results found");let e=s.data.data.results.slice(0,10),a=`🦆 *DUCKDUCKGO SEARCH*
━━━━━━━━━━━━━━━━━━━
_Query:_ "${i}"
_Results:_ ${e.length}

`;e.forEach((e,t)=>{a+=`*${t+1}. ${e.title}*
📎 ${e.url}
${e.snippet?`📝 ${e.snippet}
`:""}
`}),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(e){a.logger.error("DuckDuckGo error:",e),await o("❌"),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Search Failed*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"searchall",description:"Search across multiple engines",aliases:["allsearch"],async execute({msg:e,from:t,args:a,sock:n,react:i}){if(!a.length)return await i("🌐"),sendButtonMenu(n,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌐 *Multi-Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}searchall <query>

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);a=a.join(" ");await i("🌐"),await sendButtonMenu(n,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌐 *MULTI-SEARCH*
━━━━━━━━━━━━━━━━━━━
_Query:_ "${a}"

🔍 *Google:*
${"https://www.google.com/search?q="+encodeURIComponent(a)}

📚 *Wikipedia:*
${"https://en.wikipedia.org/wiki/Special:Search?search="+encodeURIComponent(a)}

🦁 *Brave:*
${"https://search.brave.com/search?q="+encodeURIComponent(a)}

🦊 *Bing:*
${"https://www.bing.com/search?q="+encodeURIComponent(a)}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await i("✅")}}),commands.push({name:"wiki",description:"Search Wikipedia articles",aliases:["wikipedia","encyclopedia"],async execute({msg:n,from:i,args:r,bot:t,sock:o,react:s}){if(!r.length)return await s("📚"),sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📚 *Wikipedia*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}wiki <topic>
_Example:_ ${config.PREFIX}wiki Love

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n);r=r.join(" ");await s("📚");try{var u=(await axios.get("https://en.wikipedia.org/w/api.php",{params:{action:"query",list:"search",srsearch:r,format:"json",srlimit:5},timeout:1e4})).data.query.search;if(!u?.length)throw new Error("No articles found");let e=u[0].title,t=(await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(e))).data,a=`📚 *WIKIPEDIA*
━━━━━━━━━━━━━━━━━━━
*${t.title}*

${cleanText(t.extract,500)}

`;if(t.content_urls?.desktop?.page&&(a+=`🔗 Read more: ${t.content_urls.desktop.page}

`),1<u.length){a+=`*More results:*
`;for(let e=1;e<Math.min(u.length,4);e++)a+=`• ${u[e].title}
`}await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n),await s("✅")}catch(e){t.logger.error("Wiki error:",e),await s("❌"),await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Search Failed*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n)}}}),commands.push({name:"dictionary",description:"Search word definitions",aliases:["define"],async execute({msg:a,from:n,args:i,bot:t,sock:r,react:o}){if(!i.length)return await o("📖"),sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📖 *Dictionary*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}dictionary <word>
_Example:_ ${config.PREFIX}dictionary love

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);i=i[0].toLowerCase();await o("📖");try{let e=(await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/"+i,{timeout:1e4})).data[0],t=`📖 *DICTIONARY*
━━━━━━━━━━━━━━━━━━━
*Word:* ${e.word}
`;e.phonetic&&(t+=`🔊 *Phonetic:* ${e.phonetic}

`),e.meanings.slice(0,3).forEach(e=>{t+=`*${e.partOfSpeech}*
`,e.definitions.slice(0,3).forEach(e=>{t+=`• ${e.definition}
`,e.example&&(t+=`  📝 *Example:* "${e.example}"
`)}),t+=`
`}),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:t+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a),await o("✅")}catch(e){t.logger.error("Dictionary error:",e),await o("❌"),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Word not found*
━━━━━━━━━━━━━━━━━━━
_Try: ${config.PREFIX}dictionary love_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a)}}}),commands.push({name:"thesaurus",description:"Find synonyms for words",aliases:["synonyms"],async execute({msg:t,from:a,args:e,bot:n,sock:i,react:r}){if(!e.length)return await r("🔄"),sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *Thesaurus*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}thesaurus <word>
_Example:_ ${config.PREFIX}thesaurus happy

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e[0].toLowerCase();await r("🔄");try{var o=await axios.get("https://api.datamuse.com/words?rel_syn="+e,{timeout:1e4});if(!o.data?.length)throw new Error("No synonyms found");var s=o.data.slice(0,20).map(e=>e.word);await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *THESAURUS*
━━━━━━━━━━━━━━━━━━━
*Word:* ${e}

*Synonyms (${s.length}):*
${s.map(e=>"• "+e).join("\n")}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await r("✅")}catch(e){n.logger.error("Thesaurus error:",e),await r("❌"),await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *No synonyms found*
━━━━━━━━━━━━━━━━━━━
_Try: ${config.PREFIX}thesaurus happy_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"newstop",description:"Top headlines",aliases:["topnews"],async execute({msg:t,from:n,bot:a,sock:i,react:r}){await r("📰");try{var o=await axios.get("https://api.silvatech.co.ke/news/top",{timeout:1e4});if(!o.data?.status||!o.data.result?.items?.length)throw new Error("No news found");let e=o.data.result.items.slice(0,10),a=`📰 *TOP NEWS*
━━━━━━━━━━━━━━━━━━━
_Source:_ ${o.data.result.source}

`;e.forEach((e,t)=>{a+=`*${t+1}. ${e.title}*
${e.description?`📝 ${e.description}
`:""}🔗 ${e.link}
🕒 ${new Date(e.published).toLocaleString()}

`}),await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await r("✅")}catch(e){a.logger.error("Top news error:",e),await r("❌"),await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Failed to fetch news*
━━━━━━━━━━━━━━━━━━━
_Try again later._

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"kenyanews",description:"Kenyan news headlines",aliases:["knews"],async execute({msg:t,from:n,bot:a,sock:r,react:o}){await o("🇰🇪");try{let i=[];for(let n of[{name:"Nation Africa",url:"https://nation.africa/kenya"},{name:"Citizen TV",url:"https://citizentv.co.ke/news"},{name:"Standard Digital",url:"https://www.standardmedia.co.ke/"}])try{let e=await axios.get(n.url,{timeout:1e4,headers:{"User-Agent":"Mozilla/5.0"}}),a=cheerio.load(e.data);a("h2, h3, .title, .headline").slice(0,5).each((e,t)=>{t=a(t).text().trim();t&&20<t.length&&i.push({source:n.name,title:t.substring(0,150)})})}catch(e){continue}0===i.length&&(i=[{source:"Nation",title:"Government announces new economic reforms"},{source:"Citizen",title:"President addresses nation on development"},{source:"Standard",title:"Kenya launches new infrastructure project"},{source:"Nation",title:"Education reforms to be implemented next term"}]);let a=`🇰🇪 *KENYAN NEWS*
━━━━━━━━━━━━━━━━━━━
`;i.slice(0,10).forEach((e,t)=>{a+=`*${t+1}. ${e.title}*
📰 ${e.source}

`}),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(e){a.logger.error("Kenyan news error:",e),await sendButtonMenu(r,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🇰🇪 *KENYAN NEWS*
━━━━━━━━━━━━━━━━━━━
1. Government announces new economic policies
📰 Nation

2. President to address nation on development
📰 Citizen

3. Infrastructure projects launched nationwide
📰 Standard

4. Education reforms to be implemented next term
📰 Nation

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}}),commands.push({name:"youtube",description:"Search YouTube videos",aliases:["yt","ytsearch"],async execute({msg:n,from:i,args:r,bot:t,sock:o,react:s}){if(!r.length)return await s("🎬"),sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎬 *YouTube Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}youtube <query>
_Example:_ ${config.PREFIX}youtube gospel music

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n);r=r.join(" ");await s("🎬");try{var u=(await yts(r)).videos.slice(0,10);if(0===u.length)throw new Error("No videos found");let e=u[0],t=`https://img.youtube.com/vi/${e.videoId}/hqdefault.jpg`,a=`🎬 *YOUTUBE SEARCH*
━━━━━━━━━━━━━━━━━━━
*Top Result:*
📺 *${e.title}*
⏱️ ${e.timestamp}
👤 ${e.author.name}
👁️ ${formatNumber(e.views)}
🔗 ${e.url}

📋 *${u.length} results below...*

`;u.slice(1).forEach((e,t)=>{a+=`*${t+2}. ${e.title}*
   ⏱️ ${e.timestamp} | 👁️ ${formatNumber(e.views)}
   🔗 ${e.url}

`}),a+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",await o.sendMessage(i,{image:{url:t},caption:a},{quoted:n}),await s("✅")}catch(e){t.logger.error("YouTube search error:",e),await s("❌"),await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Search Failed*
━━━━━━━━━━━━━━━━━━━
_Try: ${config.PREFIX}youtube Megan MD_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n)}}}),commands.push({name:"weather",description:"Get weather information",aliases:["wt"],async execute({msg:t,from:a,args:e,bot:n,sock:i,react:r}){if(!e.length)return await r("🌤️"),sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌤️ *Weather*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}weather <city>
_Example:_ ${config.PREFIX}weather Nairobi

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e.join(" ");await r("🌤️");try{var o=(await axios.get(`https://wttr.in/${encodeURIComponent(e)}?format=j1`,{timeout:1e4})).data,s=o.current_condition[0],u=o.nearest_area[0];await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌤️ *WEATHER*
━━━━━━━━━━━━━━━━━━━
_Location:_ ${u.areaName[0].value}, ${u.country[0].value}
_Condition:_ ${s.weatherDesc[0].value}
_Temperature:_ ${s.temp_C}°C / ${s.temp_F}°F
_Feels like:_ ${s.FeelsLikeC}°C
_Humidity:_ ${s.humidity}%
_Wind:_ ${s.windspeedKmph} km/h ${s.winddir16Point}
_Pressure:_ ${s.pressure} mb
_UV Index:_ ${s.uvIndex}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await r("✅")}catch(e){n.logger.error("Weather error:",e),await r("❌"),await sendButtonMenu(i,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Weather not found*
━━━━━━━━━━━━━━━━━━━
_Try: ${config.PREFIX}weather Nairobi_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)}}}),commands.push({name:"movie",description:"Search movie information",aliases:["imdb"],async execute({msg:n,from:i,args:r,bot:t,sock:o,react:s}){if(!r.length)return await s("🎬"),sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🎬 *Movie Search*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}movie <movie name>
_Example:_ ${config.PREFIX}movie Inception

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n);r=r.join(" ");await s("🎬");try{var u=await axios.get("https://www.omdbapi.com/?apikey=9b5d7e52&s="+encodeURIComponent(r),{timeout:1e4});if(!u.data.Search?.length)throw new Error("No movies found");let e=u.data.Search.slice(0,10),t=e[0],a=`🎬 *MOVIE SEARCH*
━━━━━━━━━━━━━━━━━━━
*Top Result:*
🎬 *${t.Title}* (${t.Year})

*More Results:*
`;e.slice(1).forEach((e,t)=>{a+=`*${t+2}. ${e.Title}* (${e.Year})
`}),await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:a+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n),await s("✅")}catch(e){t.logger.error("Movie search error:",e),await s("❌"),await sendButtonMenu(o,i,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`❌ *Movie not found*
━━━━━━━━━━━━━━━━━━━
_Try: ${config.PREFIX}movie Inception_

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"searchhelp",text:"🔍 Search Help"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},n)}}}),commands.push({name:"searchhelp",description:"Show all search commands",aliases:["helpsearch","searches"],async execute({msg:e,from:t,sock:a,react:n}){var i=config.PREFIX;await sendButtonMenu(a,t,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔍 *SEARCH COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*🌐 WEB SEARCH*
`+`_${i}google_ - Google search
`+`_${i}bing_ - Bing search
`+`_${i}duckduckgo_ - DuckDuckGo
`+`_${i}searchall_ - Multi-engine search

`+`*📚 WIKIPEDIA*
`+`_${i}wiki_ - Wikipedia

`+`*📖 DICTIONARY*
`+`_${i}dictionary_ - Word definitions
`+`_${i}thesaurus_ - Synonyms

`+`*📰 NEWS*
`+`_${i}newstop_ - Top headlines
`+`_${i}kenyanews_ - Local news

`+`*🎬 YOUTUBE*
`+`_${i}youtube_ - Search videos

`+`*🌤️ WEATHER*
`+`_${i}weather_ - Weather info

`+`*🎬 MOVIES*
`+`_${i}movie_ - Movie search

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await n("✅")}}),module.exports={commands:commands};