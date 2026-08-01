module.exports.config = {
 name: "daily",
 aliases: ["claim"],
 version: "1.0",
 author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
 countDown: 5,
 role: 0,
 shortDescription: "Claim daily reward",
 category: "economy"
};

module.exports.onStart = async function ({ api, event, usersData }) {
 const { senderID, threadID, messageID } = event;

 const cooldown = 24 * 60 * 60 * 1000; // 24h
 const reward = Math.floor(Math.random() * 5000) + 1000;

 const userData = await usersData.get(senderID);

 if (!userData.data) userData.data = {};

 const lastClaim = userData.data.lastDaily || 0;
 const now = Date.now();

 if (now - lastClaim < cooldown) {
 const remaining = cooldown - (now - lastClaim);

 const hours = Math.floor(remaining / (1000 * 60 * 60));
 const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

 return api.sendMessage(
 `⏳ 𝐘𝐨𝐮 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐜𝐥𝐚𝐢𝐦𝐞𝐝 𝐲𝐨𝐮𝐫 𝐝𝐚𝐢𝐥𝐲 𝐫𝐞𝐰𝐚𝐫𝐝! 🆔 ${threadID} | 🕒 𝐂𝐨𝐦𝐞 𝐛𝐚𝐜𝐤 𝐚𝐟𝐭𝐞𝐫 ${hours}𝐡 ${minutes}𝐦`,
 threadID,
 messageID
 );
 }

 const currentMoney = userData.data.money || 0;
 const newBalance = currentMoney + reward;

 await usersData.set(senderID, {
 data: {
 ...userData.data,
 money: newBalance,
 lastDaily: now
 }
 });

 api.sendMessage(
`🎁 𝐃𝐚𝐢𝐥𝐲 𝐑𝐞𝐰𝐚𝐫𝐝 𝐂𝐥𝐚𝐢𝐦𝐞𝐝!

💵 𝐑𝐞𝐰𝐚𝐫𝐝: ${reward}$
🏦 𝐍𝐞𝐰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: ${newBalance}$`,
 threadID,
 messageID
 );
};
