const axios = require('axios');

module.exports = {
  config: {
    name: "fflike",
    version: "1.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Send Free Fire likes",
    longDescription: "Send likes to a Free Fire player using API proxy",
    category: "game",
    guide: {
      en: "{pn} <uid> <server_code>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const uid = args[0];
    const server = args[1]?.toLowerCase();
    
    const validServers = ['bd', 'ind', 'id', 'sg', 'th', 'vn', 'br', 'ru'];
    
    if (!uid || !server) {
      const wrongFormat = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐖𝐫𝐨𝐧𝐠 𝐅𝐨𝐫𝐦𝐚𝐭!
» 📌 𝐔𝐬𝐚𝐠𝐞: fflike uid server

🌍 𝐒𝐞𝐫𝐯𝐞𝐫 𝐂𝐨𝐝𝐞𝐬:
• bd - Bangladesh
• ind - India
• id - Indonesia
• sg - Singapore
• th - Thailand
• vn - Vietnam
• br - Brazil
• ru - Russia

💡 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: fflike 6967621174 bd
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(wrongFormat);
    }
    
    if (!validServers.includes(server)) {
      const invalidServer = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐫𝐯𝐞𝐫 𝐜𝐨𝐝𝐞!
» 📌 𝐕𝐚𝐥𝐢𝐝: bd, ind, 
» 🆔 id, sg, th, vn, br, ru
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(invalidServer);
    }

    const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐒𝐞𝐧𝐝𝐢𝐧𝐠 𝐥𝐢𝐤𝐞𝐬 𝐭𝐨...
» 🆔 𝐔𝐈𝐃: ${uid}
» 🌍 𝐒𝐞𝐫𝐯𝐞𝐫: ${server.toUpperCase()}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    const loadingMsg = await message.reply(loadingText);

    try {
      const response = await axios.get(
        `https://akashx404-ff-liker-api.onrender.com/like`,
        {
          params: {
            uid: uid,
            server_name: server
          },
          timeout: 10000
        }
      );

      const data = response.data;
      
      if (data.success) {
        const playerData = data.data;
        
        const statusMsg = {
          0: "✅ 𝐋𝐢𝐤𝐞𝐬 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!",
          1: "⚠️ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐥𝐢𝐤𝐞𝐝 𝐭𝐨𝐝𝐚𝐲!",
          2: "⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧 𝐩𝐞𝐫𝐢𝐨𝐝 𝐚𝐜𝐭𝐢𝐯𝐞!",
          3: "❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐈𝐃 𝐨𝐫 𝐒𝐞𝐫𝐯𝐞𝐫!"
        };
        
        const statusText = statusMsg[playerData.status] || "Unknown status";
        
        const replyMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👤 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞: ${playerData.PlayerNickname || 'Unknown'}
» 🆔 𝐔𝐈𝐃: ${playerData.UID || uid}
» 🌍 𝐒𝐞𝐫𝐯𝐞𝐫: ${server.toUpperCase()}
───────────────
» ❤️ 𝐋𝐢𝐤𝐞𝐬 𝐁𝐞𝐟𝐨𝐫𝐞: ${playerData.LikesbeforeCommand || 0}
» ❤️ 𝐋𝐢𝐤𝐞𝐬 𝐀𝐟𝐭𝐞𝐫: ${playerData.LikesafterCommand || 0}
» ✨ 𝐆𝐢𝐯𝐞𝐧: ${playerData.LikesGivenByAPI || 0}
───────────────
» 📊 𝐒𝐭𝐚𝐭𝐮𝐬: ${statusText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        
        api.editMessage(replyMsg, loadingMsg.messageID);
      } else {
        const apiError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐀𝐏𝐈 𝐄𝐫𝐫𝐨𝐫: ${data.error || "Unknown error"}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        api.editMessage(apiError, loadingMsg.messageID);
      }
      
    } catch (error) {
      console.error("FF Like Error:", error.message);
      
      let errorText = "❌ Failed to connect to API server.";
      
      if (error.code === 'ECONNABORTED') {
        errorText = "❌ Request timeout. Server took too long to respond.";
      } else if (error.response) {
        errorText = "❌ API Error: " + (error.response.data.error || "Server error");
      }
      
      const catchErrorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ${errorText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.editMessage(catchErrorMsg, loadingMsg.messageID);
    }
  }
};
