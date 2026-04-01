let resolveRealJid=require("../lib/lidResolver").resolveRealJid;class GroupHelper{static extractPhone(e){if(!e)return null;let t=e.replace("@s.whatsapp.net","");return(t=(t=(t=t.replace("@g.us","")).replace("@","")).replace(/\D/g,""))||null}static getJidFromInput(e,t){return e.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length?e.message.extendedTextMessage.contextInfo.mentionedJid[0]:(e=this.extractPhone(t))&&10<=e.length?e+"@s.whatsapp.net":null}static async formatJid(e,t){if(!e)return"N/A";if(e.endsWith("@lid"))try{var i=await resolveRealJid(t,e);if(i&&i.endsWith("@s.whatsapp.net")){let e=i.split("@")[0].split(":")[0];return"@"+e}}catch(e){}return"@"+e.split("@")[0].split(":")[0]}static async categorizeParticipants(e,t){var i,n=[],a=[],r=[];for(i of e){var s=await this.formatJid(i.id,t);"superadmin"===i.admin?n.push({jid:i.id,display:s,role:"superadmin"}):"admin"===i.admin?a.push({jid:i.id,display:s,role:"admin"}):r.push({jid:i.id,display:s,role:"member"})}return{superAdmins:n,admins:a,members:r}}static isAdmin(e,t){e=e.find(e=>e.id===t);return e&&("admin"===e.admin||"superadmin"===e.admin)}static isSuperAdmin(e,t){e=e.find(e=>e.id===t);return e&&"superadmin"===e.admin}static isGroupOwner(e,t){return e.owner===t}static isBotOwner(e,t){return e.split("@")[0]===t}static canPerformAdminAction(e,t,i){return this.isAdmin(e.participants,t)||this.isBotOwner(t,i)}static getAllMentions(e){return e.map(e=>e.id)}static getAdminMentions(e){return e.filter(e=>"admin"===e.admin||"superadmin"===e.admin).map(e=>e.id)}static formatGroupInfo(e){let{subject:t,desc:i,size:n,creation:a,owner:r,participants:s,id:d,restrict:l,announce:m}=e,p=new Date(1e3*a).toLocaleDateString("en-KE",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),o=r?"@"+r.split("@")[0].split(":")[0]:"Not available",u=s.filter(e=>"superadmin"===e.admin).length,c=s.filter(e=>"admin"===e.admin).length,h=s.length-u-c,g="announcement"===m?"🔒 Admins only":"🔓 Everyone",f="locked"===l?"🔒 Admins only":"🔓 Everyone",$=`*📌 GROUP INFORMATION*

`;return $=($=($=($=($+=`📛 *Name:* ${t}
`)+`🆔 *ID:* ${d.split("@")[0]}
`)+`👥 *Members:* ${n}
`+`👑 *Owner:* ${o}
`)+`📅 *Created:* ${p}

`+`*⚙️ SETTINGS*
`)+`• Messages: ${g}
`+`• Edit Info: ${f}

`,u&&($=$+`*👑 Super Admins (${u})*
`+`... and ${u} super admins

`),$=($=c?$+`*👮 Admins (${c})*
`+`... and ${c} admins

`:$)+`*👤 Members (${h})*
`+`... and ${h} members`,i&&($+=`

📝 *Description:*
`+i),$+=`

> created by wanga`}static async formatParticipantList(e,t){let{superAdmins:i,admins:n,members:a}=await this.categorizeParticipants(e,t),r="";return i.length&&(r=(r+=`*👑 Super Admins (${i.length})*
`)+i.map(e=>e.display).join("\n")+"\n\n"),n.length&&(r=(r+=`*👮 Admins (${n.length})*
`)+n.map(e=>e.display).join("\n")+"\n\n"),r=(r+=`*👤 Members (${a.length})*
`)+a.slice(0,20).map(e=>e.display).join("\n"),20<a.length&&(r+=`
... and ${a.length-20} more`),r+=`

> created by wanga`}static formatActionResult(e,t){let i=t.filter(e=>"200"===e.status).length,n=t.filter(e=>"200"!==e.status).length,a=""+({add:"➕",remove:"➖",promote:"👑",demote:"👤"}[e]||"✅")+` *${e.toUpperCase()} RESULT*

`;return a+=`✅ Success: ${i}
`,0<n&&(a+=`❌ Failed: ${n}
`),a+=`
> created by wanga`}static parsePollArgs(e){let t=[],i="",n=!1,a=e.join(" ");for(let e=0;e<a.length;e++){var r=a[e];'"'!==r||0!==e&&"\\"===a[e-1]?" "!==r||n?i+=r:i&&(t.push(i),i=""):!(n=!n)&&i&&(t.push(i),i="")}return i&&t.push(i),t}static extractGroupCode(e){return e&&e.includes("chat.whatsapp.com")?(e=e.split("/"))[e.length-1]:null}static isGroupJid(e){return e&&e.endsWith("@g.us")}static isUserJid(e){return e&&e.endsWith("@s.whatsapp.net")}}module.exports=GroupHelper;