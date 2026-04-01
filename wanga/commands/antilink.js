let commands=[];commands.push({name:"antilink",description:"Toggle anti-link for groups (on/off)",aliases:["linkblock"],async execute({from:n,args:i,bot:o,react:a,reply:e,isGroup:s,isAdmin:t,isOwner:l}){return s?t||l?0===i.length?e(`🔗 *ANTI-LINK*

Current: ${await o.db.isGroupAntiLinkEnabled(n)?"✅ ON":"❌ OFF"}

*Usage:*
.antilink on - Block links
.antilink off - Allow links`):(s=i[0].toLowerCase(),["on","off"].includes(s)?void("on"===s?(await o.db.enableGroupAntiLink(n),await a("✅"),await e("🔗 Anti-link ENABLED for this group! Links will be deleted.")):(await o.db.disableGroupAntiLink(n),await a("✅"),await e("🔗 Anti-link DISABLED for this group! Links are allowed."))):e("❌ Invalid option. Use: on or off")):e("❌ You must be an admin to use this command!"):e("❌ This command only works in groups!")}}),module.exports={commands:commands};