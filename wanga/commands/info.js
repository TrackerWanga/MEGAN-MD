let config=require("../../megan/config"),os=require("os"),commands=[];commands.push({name:"info",description:"Show bot information",aliases:["bot","status"],async execute({msg:o,from:e,bot:t,sock:a,react:i}){var m=new Date,n=m.toLocaleTimeString(),m=m.toLocaleDateString(),s=process.uptime(),c=Math.floor(s/86400),r=Math.floor(s%86400/3600),s=Math.floor(s%3600/60),d=os.totalmem()/1073741824,f=(d-os.freemem()/1073741824).toFixed(2),t=`*📱 BOT INFO*

`+`👤 *Owner:* ${config.OWNER_NAME}
`+`📞 *Phone:* ${config.OWNER_NUMBER}
`+`🤖 *Bot:* ${config.BOT_NAME}
`+`🔧 *Prefix:* ${config.PREFIX}
`+`⚙️ *Mode:* ${config.MODE}
`+`📚 *Commands:* ${t.commands.size}
`+`⏱️ *Uptime:* ${c}d ${r}h ${s}m
`+`🕒 *Time:* ${n}
`+`📅 *Date:* ${m}
`+`💾 *RAM:* ${f}GB/${d.toFixed(2)}GB

`+"> created by wanga";await a.sendMessage(e,{text:t},{quoted:o}),await i("✅")}}),module.exports={commands:commands};