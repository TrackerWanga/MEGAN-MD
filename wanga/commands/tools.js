async function sendButtonMenu(a,e,n,o){var t=require("gifted-btns").sendButtons;try{return await t(a,e,{title:n.title||"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:n.text,footer:n.footer||"> created by wanga",image:n.image?{url:n.image}:null,buttons:n.buttons||[]},{quoted:o})}catch(t){console.error("Button error:",t),await a.sendMessage(e,{text:n.text},{quoted:o})}}async function translateToEnglish(a){if(!a||a.length<10)return a;try{return(await translate(a,{to:"en"})).text}catch(t){return a}}let axios=require("axios"),CryptoJS=require("crypto-js"),morse=require("morse"),uuidv4=require("uuid").v4,translate=require("@iamtraction/google-translate"),faker=require("@faker-js/faker").faker,math=require("mathjs"),fs=require("fs-extra"),path=require("path"),config=require("../../megan/config"),TEMP_DIR=path.join(__dirname,"../../temp"),commands=(fs.ensureDirSync(TEMP_DIR),[]),CHANNEL_LINK="https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b",BOT_LOGO="https://files.catbox.moe/0v8bkv.png";commands.push({name:"binary",description:"Convert text to binary code",aliases:["bin","texttobinary"],async execute({msg:t,from:a,args:e,sock:n,react:o}){e=e.join(" ");if(!e)return await o("🔢"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔢 *BINARY ENCODER*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}binary <text>
_Example:_ ${config.PREFIX}binary Hello

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await o("🔄");var i=e.split("").map(t=>t.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔢 *Binary Encoder*
━━━━━━━━━━━━━━━━━━━
_Original:_ ${e}

_Binary:_
${i}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Binary",copy_code:i})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"debinary",description:"Convert binary code to text",aliases:["unbinary"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){e=e.join(" ");if(!e)return await o("🔢"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔢 *BINARY DECODER*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}debinary <binary>
_Example:_ ${config.PREFIX}debinary 01001000 01100101

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await o("🔄");var s=e.replace(/\s+/g,"");if(!/^[01]+$/.test(s))return i("❌ Invalid binary code");let r="";for(let t=0;t<s.length;t+=8){var u=s.substr(t,8);8===u.length&&(r+=String.fromCharCode(parseInt(u,2)))}await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔢 *Binary Decoder*
━━━━━━━━━━━━━━━━━━━
_Binary:_ ${e}

_Text:_ ${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Text",copy_code:r})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"base64",description:"Encode/decode Base64",aliases:["b64"],async execute({msg:t,from:a,args:e,sock:n,react:o}){var i,e=e.join(" ");if(!e)return await o("📄"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📄 *BASE64*
━━━━━━━━━━━━━━━━━━━
_Usage:_
• ${config.PREFIX}base64 <text> (encode)
• ${config.PREFIX}base64 decode <base64> (decode)

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await o("🔄"),e.toLowerCase().startsWith("decode ")?(i=e.substring(7),await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📄 *Base64 Decoder*
━━━━━━━━━━━━━━━━━━━
_Decoded:_
${i=Buffer.from(i,"base64").toString("utf8")}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:i})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)):(i=e.toLowerCase().startsWith("encode ")?e.substring(7):e,await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📄 *Base64 Encoder*
━━━━━━━━━━━━━━━━━━━
_Encoded:_
${e=Buffer.from(i,"utf8").toString("base64")}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:e})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t)),await o("✅")}}),commands.push({name:"hash",description:"Generate hash values",aliases:["hashgen"],async execute({msg:t,from:a,args:e,sock:n,react:o}){e=e.join(" ");if(!e)return await o("🔒"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔒 *HASH GENERATOR*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}hash <text>
_Example:_ ${config.PREFIX}hash password123

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await o("🔄");var i=CryptoJS.MD5(e).toString(),s=CryptoJS.SHA1(e).toString(),e=CryptoJS.SHA256(e).toString();await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔒 *Hash Generator*
━━━━━━━━━━━━━━━━━━━
_MD5:_ \`${i}\`

_SHA1:_ \`${s}\`

_SHA256:_ \`${e}\`

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy MD5",copy_code:i})},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy SHA256",copy_code:e})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"morse",description:"Convert text to Morse code",aliases:["morsecode"],async execute({msg:t,from:a,args:e,sock:n,react:o}){var i,e=e.join(" ");if(!e)return await o("📡"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📡 *MORSE CODE*
━━━━━━━━━━━━━━━━━━━
_Usage:_
• ${config.PREFIX}morse <text> (encode)
• ${config.PREFIX}morse .... . .-.. .-.. --- (decode)

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);await o("🔄"),/^[\.\-\s]+$/.test(e)?await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📡 *Morse Decoder*
━━━━━━━━━━━━━━━━━━━
_Morse:_ ${e}

_Text:_ ${i=morse.decode(e)}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Text",copy_code:i})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t):await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📡 *Morse Encoder*
━━━━━━━━━━━━━━━━━━━
_Text:_ ${e}

_Morse:_ ${i=morse.encode(e)}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Morse",copy_code:i})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"encrypt",description:"Encrypt text with password",aliases:["encode"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){e=e.join(" ");if(!e)return await o("🔐"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *ENCRYPT*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}encrypt <password> <text>
_Example:_ ${config.PREFIX}encrypt mysecret Hello World

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);var[e,...s]=e.split(" "),s=s.join(" ");if(!e||!s)return i("❌ Need both password and message");await o("🔄");i=CryptoJS.AES.encrypt(s,e).toString();await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *Encrypted*
━━━━━━━━━━━━━━━━━━━
_Password:_ ||${e}||

_Encrypted:_
${i}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:i})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"decrypt",description:"Decrypt text with password",aliases:["decode"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){e=e.join(" ");if(!e)return await o("🔐"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *DECRYPT*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}decrypt <password> <encrypted>
_Example:_ ${config.PREFIX}decrypt mysecret U2FsdGVkX1...

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);var[e,...s]=e.split(" "),s=s.join(" ");if(!e||!s)return i("❌ Need both password and encrypted text");await o("🔄");s=CryptoJS.AES.decrypt(s,e).toString(CryptoJS.enc.Utf8);if(!s)return i("❌ Wrong password or corrupted data");await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *Decrypted*
━━━━━━━━━━━━━━━━━━━
_Password:_ ||${e}||

_Decrypted:_
${s}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:s})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"password",description:"Generate strong passwords",aliases:["pass","genpass"],async execute({msg:t,from:a,args:e,sock:n,react:o}){var s=Math.min(Math.max(parseInt(e[0])||16,8),64),r=(await o("🔐"),[]);for(let t=0;t<3;t++){let t="abcdefghijklmnopqrstuvwxyz",a="ABCDEFGHIJKLMNOPQRSTUVWXYZ",e="0123456789",n="!@#$%^&*()_+-=[]{}|;:,.<>?",o=t+a+e+n,i="";i=(i=(i=(i+=t[Math.floor(Math.random()*t.length)])+a[Math.floor(Math.random()*a.length)])+e[Math.floor(Math.random()*e.length)])+n[Math.floor(Math.random()*n.length)];for(let t=4;t<s;t++)i+=o[Math.floor(Math.random()*o.length)];i=i.split("").sort(()=>Math.random()-.5).join(""),r.push(i)}await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔐 *Strong Passwords*
━━━━━━━━━━━━━━━━━━━
_Length:_ ${s} characters

_Password 1:_ \`${r[0]}\`

_Password 2:_ \`${r[1]}\`

_Password 3:_ \`${r[2]}\`

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy 1",copy_code:r[0]})},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy 2",copy_code:r[1]})},{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy 3",copy_code:r[2]})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"vcc",description:"Generate fake credit cards",aliases:["vccgen"],async execute({msg:a,from:n,args:t,sock:o,react:i,reply:e}){var s=t[0]?.toUpperCase()||"Visa",r=Math.min(parseInt(t[1])||1,5),t=["Visa","MasterCard","Amex","JCB","Diners"];if(!t.includes(s))return e("❌ Invalid type. Use: "+t.join(", "));await i("💳");try{var u=await axios.get("https://api.siputzx.my.id/api/tools/vcc-generator",{params:{type:s,count:r},timeout:2e4});if(u.data?.data?.length){let t=u.data.data,e=`💳 *${s} Cards (${t.length})*
━━━━━━━━━━━━━━━━━━━

`;return t.forEach((t,a)=>{e+=`*${a+1}.* \`${t.cardNumber}\`
   Exp: ${t.expirationDate} | CVV: ${t.cvv}
   Name: ${t.cardholderName}

`}),await sendButtonMenu(o,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:e+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:t.slice(0,3).map((t,a)=>({name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Card "+(a+1),copy_code:t.cardNumber+`|${t.expirationDate}|`+t.cvv})}))},a),void await i("✅")}}catch(t){}var l=[];for(let t=0;t<r;t++){var c=Math.floor(1e16*Math.random()).toString().padStart(16,"0"),_=Math.floor(12*Math.random())+1,m=25+Math.floor(5*Math.random()),d=Math.floor(900*Math.random())+100,g=["John Doe","Jane Smith","Robert Johnson","Maria Garcia","David Brown"],g=g[Math.floor(Math.random()*g.length)];l.push({cardNumber:c,expirationDate:_.toString().padStart(2,"0")+"/"+m,cardholderName:g,cvv:d.toString()})}let p=`💳 *${s} Cards (${l.length})* [Fallback]
━━━━━━━━━━━━━━━━━━━

`;l.forEach((t,a)=>{p+=`*${a+1}.* \`${t.cardNumber}\`
   Exp: ${t.expirationDate} | CVV: ${t.cvv}
   Name: ${t.cardholderName}

`}),await sendButtonMenu(o,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:p+="_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:l.slice(0,3).map((t,a)=>({name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy Card "+(a+1),copy_code:t.cardNumber+`|${t.expirationDate}|`+t.cvv})}))},a),await i("✅")}}),commands.push({name:"email",description:"Generate random email addresses",aliases:["genemail"],async execute({msg:t,from:a,args:e,sock:n,react:o}){var i=Math.min(parseInt(e[0])||1,20),s=(await o("📧"),[]);for(let t=0;t<i;t++)s.push(faker.internet.email());let r=`📧 *Random Emails*
━━━━━━━━━━━━━━━━━━━
_${i} Email(s)_

`;s.forEach((t,a)=>{r+=a+1+`. \`${t}\`
`}),await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:r+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:s.slice(0,3).map((t,a)=>({name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy "+(a+1),copy_code:t})}))},t),await o("✅")}}),commands.push({name:"uuid",description:"Generate UUIDs",aliases:["guid"],async execute({msg:t,from:a,args:e,sock:n,react:o}){var i=Math.min(parseInt(e[0])||5,20),s=(await o("🔑"),[]);for(let t=0;t<i;t++)s.push(uuidv4());let r=`🔑 *UUID Generator*
━━━━━━━━━━━━━━━━━━━
_${i} UUID(s)_

`;s.forEach((t,a)=>{r+=a+1+`. \`${t}\`
`}),await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:r+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:s.slice(0,3).map((t,a)=>({name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy "+(a+1),copy_code:t})}))},t),await o("✅")}}),commands.push({name:"browse",description:"Fetch webpage content",aliases:["fetch"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(!e.length)return await o("🌐"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌐 *BROWSE*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}browse <url>
_Example:_ ${config.PREFIX}browse https://example.com

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e[0];if(!e.startsWith("http"))return i("❌ Please include http:// or https://");await o("🌐");try{var s=await axios.get(e,{timeout:15e3}),r="string"==typeof s.data?s.data:JSON.stringify(s.data),u=4e3<r.length?r.substring(0,4e3)+"...":r;await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌐 *Web Content*
━━━━━━━━━━━━━━━━━━━
${u}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:u})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🔗 Open URL",url:e})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(t){await o("❌"),await i("❌ Error fetching URL: "+t.message)}}}),commands.push({name:"tinyurl",description:"Shorten URLs",aliases:["short"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(!e.length)return await o("🔗"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔗 *SHORTEN URL*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}tinyurl <url>
_Example:_ ${config.PREFIX}tinyurl https://example.com

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e[0];if(!e.startsWith("http"))return i("❌ Please include http:// or https://");await o("🔗");try{var s=(await axios.get("https://tinyurl.com/api-create.php?url="+encodeURIComponent(e),{timeout:15e3})).data;await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔗 *Short URL*
━━━━━━━━━━━━━━━━━━━
_Original:_ ${e}

_Short:_ ${s}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:s})},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🔗 Open",url:s})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(t){await o("❌"),await i("❌ Failed to shorten URL.")}}}),commands.push({name:"screenshot",description:"Take screenshot of a website",aliases:["ss","ssweb"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(!e.length)return await o("📸"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📸 *SCREENSHOT*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}screenshot <url>
_Example:_ ${config.PREFIX}screenshot https://google.com

_Options:_
• Desktop (default)
• Add 'mobile' for mobile view
• Add 'full' for full page

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let s=e[0],r="desktop",u=!1;e[1]&&("mobile"===e[1].toLowerCase()&&(r="mobile"),"full"===e[1].toLowerCase()&&(u=!0),e[2])&&"full"===e[2].toLowerCase()&&(u=!0),s.startsWith("http")||(s="https://"+s),await o("📸");try{var l=await axios.get("https://api.siputzx.my.id/api/tools/ssweb",{params:{url:s,device:r,theme:"light",fullPage:u},responseType:"arraybuffer",timeout:3e4,headers:{"User-Agent":"Mozilla/5.0"}}),c=Buffer.from(l.data),_=`📸 *Screenshot*
━━━━━━━━━━━━━━━━━━━
_🌐 URL:_ ${s}
_📱 Device:_ ${r}
_📄 Full Page:_ ${u?"Yes":"No"}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;await n.sendMessage(a,{image:c,caption:_},{quoted:t}),await o("✅")}catch(t){await o("❌"),await i(`❌ Screenshot failed.

Try: ${config.PREFIX}screenshot https://google.com`)}}}),commands.push({name:"subdomains",description:"Find subdomains for a domain",aliases:["subdomain"],async execute({msg:a,from:n,args:o,sock:i,react:s,reply:e}){if(!o.length)return await s("🔍"),sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔍 *SUBDOMAINS*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}subdomains <domain>
_Example:_ ${config.PREFIX}subdomains github.com

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a);o=o[0];await s("🔍");try{var r=await axios.get("https://api.siputzx.my.id/api/tools/subdomains",{params:{domain:o},timeout:2e4});if(!r.data?.data?.length)throw new Error("No subdomains found");let t=r.data.data.slice(0,20),e=`🔍 *Subdomains for ${o}*
━━━━━━━━━━━━━━━━━━━

`;t.forEach((t,a)=>{e+=a+1+`. ${t}
`}),await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:e+=`
_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy List",copy_code:t.join("\n")})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},a),await s("✅")}catch(t){await s("❌"),await e("❌ Failed to find subdomains.")}}}),commands.push({name:"countryinfo",description:"Get information about a country",aliases:["country"],async execute({msg:e,from:n,args:o,sock:i,react:s,reply:a}){if(!o.length)return await s("🌍"),sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🌍 *COUNTRY INFO*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}countryinfo <country>
_Example:_ ${config.PREFIX}countryinfo Kenya

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e);o=o.join(" ");await s("🌍");try{var r=await axios.get("https://api.siputzx.my.id/api/tools/countryInfo",{params:{name:o},timeout:15e3});if(!r.data?.data)throw new Error("Country not found");let t=r.data.data,a="N/A";t.languages&&(a=Array.isArray(t.languages)?t.languages.join(", "):"object"==typeof t.languages?Object.values(t.languages).join(", "):t.languages.toString());var u=`🌍 *${t.name}*
━━━━━━━━━━━━━━━━━━━

`+`_🏛️ Capital:_ ${t.capital||"N/A"}
`+`_👥 Population:_ ${t.population?.toLocaleString()||"N/A"}
`+`_🗺️ Area:_ ${t.area?.toLocaleString()||"N/A"} km²
`+`_💰 Currency:_ ${t.currency||"N/A"}
`+`_🗣️ Languages:_ ${a}
`+`_⏰ Timezones:_ ${t.timezones?.join(", ")||"N/A"}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga";await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:u,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:u.replace(/\*/g,"")})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},e),await s("✅")}catch(t){await s("❌"),await a("❌ Country not found.")}}}),commands.push({name:"githubstalk",description:"Get GitHub user info",aliases:["ghstalk"],async execute({msg:t,from:n,args:o,sock:i,react:s,reply:a}){if(!o.length)return await s("🐙"),sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🐙 *GITHUB STALK*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}githubstalk <username>
_Example:_ ${config.PREFIX}githubstalk torvalds

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);o=o[0];await s("🐙");try{let a=null,e="https://github.com/"+o;try{var r=await axios.get("https://api.github.com/users/"+o,{timeout:1e4,headers:{"User-Agent":"Mozilla/5.0"}});a=r.data}catch(t){try{var u=await axios.get("https://api.siputzx.my.id/api/stalk/github",{params:{user:o},timeout:1e4});u.data?.data&&(a=u.data.data)}catch(t){a={login:o,name:o,bio:"GitHub user",public_repos:0,followers:0,following:0,created_at:(new Date).toISOString(),html_url:e}}}await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🐙 *${a.login||o}*
━━━━━━━━━━━━━━━━━━━

`+`_📛 Name:_ ${a.name||"N/A"}
`+`_📝 Bio:_ ${a.bio||"N/A"}
`+`_📦 Public Repos:_ ${a.public_repos||0}
`+`_👥 Followers:_ ${a.followers||0}
`+`_👤 Following:_ ${a.following||0}
`+`_📅 Created:_ ${new Date(a.created_at).toLocaleDateString()}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🔗 View Profile",url:a.html_url||e})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}catch(t){await s("❌"),await a("❌ User not found.")}}}),commands.push({name:"youtubestalk",description:"Get YouTube channel info",aliases:["ytstalk"],async execute({msg:t,from:n,args:o,sock:i,react:s,reply:a}){if(!o.length)return await s("📺"),sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📺 *YOUTUBE STALK*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}youtubestalk <channel>
_Example:_ ${config.PREFIX}youtubestalk MrBeast

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);o=o[0];await s("📺");try{let a=null,e="https://youtube.com/@"+o;try{var r=await axios.get("https://api.siputzx.my.id/api/stalk/youtube",{params:{username:o},timeout:15e3});r.data?.data&&(a=r.data.data)}catch(t){a={channelName:o,subscribers:"N/A",totalViews:"N/A",totalVideos:"N/A",joinedDate:"N/A",channelUrl:e}}await sendButtonMenu(i,n,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`📺 *${a.channelName||o}*
━━━━━━━━━━━━━━━━━━━

`+`_👥 Subscribers:_ ${a.subscribers||"N/A"}
`+`_👁️ Total Views:_ ${a.totalViews||"N/A"}
`+`_🎬 Total Videos:_ ${a.totalVideos||"N/A"}
`+`_📅 Joined:_ ${a.joinedDate||"N/A"}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga",image:BOT_LOGO,buttons:[{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🔗 View Channel",url:a.channelUrl||e})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await s("✅")}catch(t){await s("❌"),await a("❌ Channel not found.")}}}),commands.push({name:"calculate",description:"Solve math equations",aliases:["calc","math"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(!e.length)return await o("🧮"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🧮 *CALCULATOR*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}calc <equation>
_Example:_ ${config.PREFIX}calc 2+2

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e.join(" ").replace(/×/g,"*").replace(/÷/g,"/");await o("🧮");try{var s=math.evaluate(e);await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🧮 *Calculator*
━━━━━━━━━━━━━━━━━━━
_Equation:_ ${e}

_Result:_ ${s}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:s.toString()})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(t){await o("❌"),await i("❌ Invalid equation: "+t.message)}}}),commands.push({name:"fliptext",description:"Flip text upside down",aliases:["flip"],async execute({msg:t,from:a,args:e,sock:n,react:o}){if(!e.length)return await o("🔄"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *FLIP TEXT*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}fliptext <text>
_Example:_ ${config.PREFIX}fliptext Hello

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);let i=e.join(" "),s={a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z",A:"∀",B:"𐐒",C:"Ɔ",D:"ᗡ",E:"Ǝ",F:"Ⅎ",G:"⅁",H:"H",I:"I",J:"ſ",K:"ʞ",L:"⅂",M:"W",N:"N",O:"O",P:"Ԁ",Q:"Q",R:"ᴚ",S:"S",T:"⊥",U:"∩",V:"Λ",W:"M",X:"X",Y:"⅄",Z:"Z",0:"0",1:"Ɩ",2:"ᄅ",3:"Ɛ",4:"ㄣ",5:"ϛ",6:"9",7:"ㄥ",8:"8",9:"6","!":"¡","?":"¿",".":"˙",",":"'",'"':"„","'":",","(":")",")":"(","[":"]","]":"[","{":"}","}":"{","<":">",">":"<","&":"⅋",_:"‾"},r=i.split("").map(t=>s[t]||t).reverse().join("");await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🔄 *Flipped Text*
━━━━━━━━━━━━━━━━━━━
_Original:_ ${i}

_Flipped:_ ${r}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:r})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}}),commands.push({name:"emojimix",description:"Mix two emojis together",aliases:["emix"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(e.length<1||!e[0].includes("+"))return await o("😊"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`😊 *EMOJI MIX*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}emojimix 😅+🤔
_Example:_ ${config.PREFIX}emojimix 🐱+🐶

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);var[e,s]=e[0].split("+").map(t=>t.trim());if(!e||!s)return i("❌ Please provide two emojis separated by +");await o("🎨");try{var r=await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(e)}_`+encodeURIComponent(s),{timeout:15e3});if(!r.data.results?.length)return i("❌ Could not mix these emojis.");var u=r.data.results[0];await n.sendMessage(a,{image:{url:u.url},caption:`🎨 *Emoji Mix*

${e} + ${s}

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`},{quoted:t}),await o("✅")}catch(t){await o("❌"),await i("❌ Failed to mix emojis.")}}}),commands.push({name:"zodiak",description:"Get zodiac information",aliases:["zodiac"],async execute({msg:t,from:a,args:e,sock:n,react:o,reply:i}){if(!e.length)return await o("⭐"),sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`⭐ *ZODIAK*
━━━━━━━━━━━━━━━━━━━
_Usage:_ ${config.PREFIX}zodiak <sign>
_Example:_ ${config.PREFIX}zodiak gemini

_Signs:_ aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces

_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,image:BOT_LOGO,buttons:[{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t);e=e[0].toLowerCase();await o("⭐");try{var s=await axios.get("https://api.siputzx.my.id/api/primbon/zodiak",{params:{zodiak:e},timeout:15e3});if(!s.data?.data)throw new Error("Zodiac not found");var r=s.data.data,u=await translateToEnglish(r.zodiak),l=`⭐ *${e.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━

`+`_📝 Description:_ ${u}

`+`_🔢 Lucky Numbers:_ ${r.nomor_keberuntungan||"N/A"}
`+`_🌸 Lucky Flowers:_ ${r.bunga_keberuntungan||"N/A"}
`+`_🎨 Lucky Color:_ ${r.warna_keberuntungan||"N/A"}
`+`_💧 Element:_ ${r.elemen_keberuntungan||"N/A"}
`+`_🪐 Planet:_ ${r.planet_yang_mengitari||"N/A"}

`+"_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga";await sendButtonMenu(n,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:l,image:BOT_LOGO,buttons:[{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 Copy",copy_code:l.replace(/\*/g,"")})},{id:config.PREFIX+"tools",text:"🛠️ Tools"},{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await o("✅")}catch(t){await o("❌"),await i(`❌ Zodiac not found.

Try: ${config.PREFIX}zodiak gemini`)}}}),commands.push({name:"tools",description:"Show all tool commands",aliases:["toolhelp"],async execute({msg:t,from:a,sock:e,react:n}){var o=config.PREFIX;await sendButtonMenu(e,a,{title:"𝐌𝐄𝐆𝐀𝐍-𝐌𝐃",text:`🛠️ *MEGAN TOOLS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`+`*🔢 ENCODING*
`+`_${o}binary_ - Text to binary
`+`_${o}debinary_ - Binary to text
`+`_${o}base64_ - Encode/decode
`+`_${o}hash_ - MD5, SHA1, SHA256
`+`_${o}morse_ - Morse code

`+`*🔐 SECURITY*
`+`_${o}encrypt_ - AES encrypt
`+`_${o}decrypt_ - AES decrypt
`+`_${o}password_ - Strong passwords
`+`_${o}vcc_ - Credit cards

`+`*🎲 GENERATORS*
`+`_${o}email_ - Random emails
`+`_${o}uuid_ - UUIDs

`+`*🌐 WEB*
`+`_${o}browse_ - Fetch webpage
`+`_${o}tinyurl_ - Shorten URL
`+`_${o}screenshot_ - Website screenshot
`+`_${o}subdomains_ - Find subdomains

`+`*🌍 INFO*
`+`_${o}countryinfo_ - Country details
`+`_${o}githubstalk_ - GitHub profile
`+`_${o}youtubestalk_ - Channel info

`+`*🧮 MATH & TEXT*
`+`_${o}calc_ - Calculate
`+`_${o}fliptext_ - Flip text
`+`_${o}emojimix_ - Mix emojis
`+`_${o}zodiak_ - Zodiac info

`+"> created by wanga",image:BOT_LOGO,buttons:[{id:config.PREFIX+"menu",text:"📋 Menu"},{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"📢 Channel",url:CHANNEL_LINK})}]},t),await n("✅")}}),module.exports={commands:commands};