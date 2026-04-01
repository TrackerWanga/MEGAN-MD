let config=require("../../megan/config"),AIHandler=require("../../megan/lib/aiHandler"),downloadMediaMessage=require("gifted-baileys").downloadMediaMessage,uploader=require("../../megan/lib/upload"),commands=[],aiHandler=null,initializeAI=a=>(aiHandler||(aiHandler=new AIHandler(a),console.log("✅ AI Handler initialized")),aiHandler),getQuotedImage=async(a,e)=>{try{var i,t,n=a.message?.extendedTextMessage?.contextInfo?.quotedMessage;return n&&n.imageMessage?(i=await downloadMediaMessage({key:{id:a.message.extendedTextMessage.contextInfo.stanzaId},message:n},"buffer",{},{logger:console}),t=`gemini_img_${Date.now()}.jpg`,(await uploader.uploadAuto(i,t)).url):null}catch(a){return console.error("Error extracting quoted image:",a),null}},showTyping=async(a,e)=>{try{await a.sendPresenceUpdate("composing",e)}catch(a){}};commands.push({name:"megan",description:"Chat with Megan AI",aliases:["meganai"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("ℹ️"),o(`*🤖 MEGAN AI*

*Usage:*
${config.PREFIX}megan <message>

*Example:*
${config.PREFIX}megan Hello, how are you?

> created by wanga`);e=e.join(" ");await n("🤔"),await showTyping(t,a);try{await o(`*🤖 Megan:*
${await i.meganAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("Megan error:",a),await n("❌"),await o(`*🤖 Megan AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"duckai",description:"Chat with DuckAI (multiple models available)",aliases:["duck"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("🦆"),o(`*🦆 DUCKAI*

*Usage:*
${config.PREFIX}duckai <message>

*Example:*
${config.PREFIX}duckai Tell me a joke

> created by wanga`);e=e.join(" ");await n("🦆"),await showTyping(t,a);try{await o(`*🦆 DuckAI:*
${await i.duckAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("DuckAI error:",a),await n("❌"),await o(`*🦆 DuckAI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"gemini",description:"Chat with Google Gemini AI (supports image analysis)",aliases:["gem"],async execute({msg:a,from:e,args:i,bot:t,sock:n,react:o,reply:r}){t=initializeAI(t),a=await getQuotedImage(a,n);if(!i.length&&!a)return await o("ℹ️"),r(`*✨ GOOGLE GEMINI*

*Usage:*
• ${config.PREFIX}gemini <message>
• Reply to an image with ${config.PREFIX}gemini <question>

*Examples:*
• ${config.PREFIX}gemini Explain quantum physics
• Reply to image: ${config.PREFIX}gemini What's in this image?

> created by wanga`);i=i.length?i.join(" "):"What's in this image?";await o("✨"),await showTyping(n,e);try{await r(`*✨ Gemini:*
${a?await t.geminiAI(i,"You are a helpful assistant.",a):await t.geminiAI(i)}

> created by wanga`),await o("✅")}catch(a){console.error("Gemini error:",a),await o("❌"),await r(`*✨ Google Gemini*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"gemini-lite",description:"Fast Google Gemini responses",aliases:["gemlite","gfast"],async execute({msg:a,from:e,args:i,bot:t,sock:n,react:o,reply:r}){t=initializeAI(t),a=await getQuotedImage(a,n);if(!i.length&&!a)return await o("⚡"),r(`*⚡ GEMINI LITE*

*Usage:*
• ${config.PREFIX}gemini-lite <message>
• Reply to an image with ${config.PREFIX}gemini-lite <question>

*Examples:*
• ${config.PREFIX}gemini-lite Hello
• Reply to image: ${config.PREFIX}gemini-lite What's in this photo?

> created by wanga`);i=i.length?i.join(" "):"What's in this image?";await o("⚡"),await showTyping(n,e);try{await r(`*⚡ Gemini Lite:*
${a?await t.geminiLiteAI(i+` (Image: ${a})`):await t.geminiLiteAI(i)}

> created by wanga`),await o("✅")}catch(a){console.error("Gemini Lite error:",a),await o("❌"),await r(`*⚡ Gemini Lite*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"gpt",description:"Chat with GPT OSS 120B",aliases:["gptai"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("💬"),o(`*💬 GPT AI*

*Usage:*
${config.PREFIX}gpt <message>

*Example:*
${config.PREFIX}gpt Tell me a fact

> created by wanga`);e=e.join(" ");await n("💬"),await showTyping(t,a);try{await o(`*💬 GPT:*
${await i.gptAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("GPT error:",a),await n("❌"),await o(`*💬 GPT AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"deepseek",description:"Chat with DeepSeek R1 AI",aliases:["deep"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("🔍"),o(`*🔍 DEEPSEEK AI*

*Usage:*
${config.PREFIX}deepseek <message>

*Example:*
${config.PREFIX}deepseek Explain reasoning

> created by wanga`);e=e.join(" ");await n("🔍"),await showTyping(t,a);try{await o(`*🔍 DeepSeek:*
${await i.deepseekAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("DeepSeek error:",a),await n("❌"),await o(`*🔍 DeepSeek AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"mistral",description:"Chat with Mistral AI",aliases:["mistralai"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("🌪️"),o(`*🌪️ MISTRAL AI*

*Usage:*
${config.PREFIX}mistral <message>

*Example:*
${config.PREFIX}mistral Hello

> created by wanga`);e=e.join(" ");await n("🌪️"),await showTyping(t,a);try{await o(`*🌪️ Mistral:*
${await i.mistralAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("Mistral error:",a),await n("❌"),await o(`*🌪️ Mistral AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"codellama",description:"Get coding help from CodeLlama",aliases:["code","coding"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("💻"),o(`*💻 CODELlAMA*

*Usage:*
${config.PREFIX}codellama <your coding question>

*Examples:*
• ${config.PREFIX}codellama Write a function to reverse a string in Python
• ${config.PREFIX}codellama Explain async/await in JavaScript

> created by wanga`);e=e.join(" ");await n("💻"),await showTyping(t,a);try{await o(`*💻 CodeLlama:*
${await i.codeLlamaAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("CodeLlama error:",a);try{await o(`*💻 Coding Assistant (Fallback):*
${await i.mistralAI(e,"You are a coding expert.")}

> created by wanga`),await n("⚠️")}catch{await n("❌"),await o(`❌ *CodeLlama Error*

Please try again later.

> created by wanga`)}}}}),commands.push({name:"bibleai",description:"Ask questions about the Bible",aliases:["bible","bibleq"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("📖"),r=i.getBibleVersions(),o(`*📖 BIBLE AI*

*Usage:*
${config.PREFIX}bibleai <question>

*Available translations:*
${r.join(", ")}

*Set default:*
${config.PREFIX}setbibleversion <code>

*Examples:*
• ${config.PREFIX}bibleai What is faith?
• ${config.PREFIX}bibleai Who was Moses?

> created by wanga`);var r=e.join(" ");await n("📖"),await showTyping(t,a);try{var s=await i.bibleAI(r),c=s?.answer||s||"I couldn't find an answer to that question.";await o(`*📖 BIBLE (${s?.version||"ESV"})*

${c}

> created by wanga`),await n("✅")}catch(a){console.error("Bible AI error:",a),await n("❌"),await o(`*📖 Bible AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"setbibleversion",description:"Set default Bible translation",aliases:["bibleversion"],async execute({args:a,bot:e,react:i,reply:t,isOwner:n}){e=initializeAI(e);return n?a.length?(n=a[0].toUpperCase(),e.setBibleVersion(n)?(await i("✅"),void await t(`✅ *BIBLE VERSION UPDATED*

Default Bible version set to: *${n}*

> created by wanga`)):(await i("❌"),t(`❌ *Invalid Version*

Available: ${e.getBibleVersions().join(", ")}

> created by wanga`))):(a=e.getBibleVersions(),t(`*📖 BIBLE VERSIONS*

*Current default:* ${e.defaultBibleVersion||"ESV"}

*Available:*
${a.join(", ")}

*Usage:*
${config.PREFIX}setbibleversion <code>

> created by wanga`)):(await i("❌"),t(`❌ *Owner Only Command*

This command can only be used by the bot owner.

> created by wanga`))}}),commands.push({name:"teacher",description:"Ask the AI teacher for help",aliases:["teach","learn"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("👨‍🏫"),o(`*👨‍🏫 TEACHER AI*

*Usage:*
${config.PREFIX}teacher <your question>

*Examples:*
• ${config.PREFIX}teacher Explain photosynthesis
• ${config.PREFIX}teacher math What is calculus?

> created by wanga`);let r=null,s=e.join(" "),c=e[0].toLowerCase();["math","science","history","english","physics","chemistry","biology"].includes(c)&&(r=c,s=e.slice(1).join(" ")),await n("👨‍🏫"),await showTyping(t,a);try{await o(`*👨‍🏫 Teacher:*
${await i.teacherAI(s,r)}

> created by wanga`),await n("✅")}catch(a){console.error("Teacher AI error:",a),await n("❌"),await o(`*👨‍🏫 Teacher AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"gita",description:"Ask questions about Bhagavad Gita",aliases:["gitaai"],async execute({from:a,args:e,bot:i,sock:t,react:n,reply:o}){i=initializeAI(i);if(!e.length)return await n("🕉️"),o(`*🕉️ GITA AI*

*Usage:*
${config.PREFIX}gita <question>

*Example:*
${config.PREFIX}gita What is karma?

> created by wanga`);e=e.join(" ");await n("🕉️"),await showTyping(t,a);try{await o(`*🕉️ Gita:*

${await i.gitaAI(e)}

> created by wanga`),await n("✅")}catch(a){console.error("Gita AI error:",a),await n("❌"),await o(`*🕉️ Gita AI*

I'm having trouble connecting right now. Please try again in a moment.

> created by wanga`)}}}),commands.push({name:"aimenu",description:"Show all AI commands",aliases:["aihelp","ais"],async execute({react:a,reply:e}){await e("*🤖 AI COMMANDS*\n\n*MEGAN AI*\n"+`• ${config.PREFIX}megan - Cloudflare AI

`+`*GOOGLE AI*
`+`• ${config.PREFIX}gemini - Full Gemini + images
`+`• ${config.PREFIX}gemini-lite - Fast version

`+`*POPULAR MODELS*
`+`• ${config.PREFIX}gpt - GPT OSS 120B
`+`• ${config.PREFIX}deepseek - DeepSeek R1
`+`• ${config.PREFIX}mistral - Mistral AI
`+`• ${config.PREFIX}duckai - Multi-model AI

`+`*SPECIALIZED AI*
`+`• ${config.PREFIX}codellama - Coding help
`+`• ${config.PREFIX}teacher - Educational AI

`+`*RELIGIOUS AI*
`+`• ${config.PREFIX}bibleai - Bible Q&A
`+`• ${config.PREFIX}setbibleversion - Change translation
`+`• ${config.PREFIX}gita - Bhagavad Gita

`+`*EXAMPLES*
`+`• ${config.PREFIX}megan Hello
`+`• ${config.PREFIX}teacher Explain gravity
`+`• ${config.PREFIX}codellama Write Python function
`+`• Reply to image: ${config.PREFIX}gemini What's this?
`+`• ${config.PREFIX}bibleai What is love?

`+"> created by wanga"),await a("✅")}}),module.exports={commands:commands};