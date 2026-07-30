const axios = require("axios");

const gifUrl = "https://i.imgur.com/4FUSn8C.gif";

module.exports = {
  config: {
    name: "owner2",
    aliases: [],
    version: "1.0.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Owner GIF"
    },
    longDescription: {
      en: "Premium owner gif sender"
    },
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    let loadingMsg;
    try {
      const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📡  𝗪𝗔𝗜𝗧 𝗢𝗪𝗡𝗘𝗥 2 
» 🧭 𝗟𝗢𝗔𝗗𝗜𝗡𝗚... ⏳
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      loadingMsg = await api.sendMessage(loadingText, event.threadID);

      const getStream = typeof global.utils?.getStreamFromURL === "function" 
        ? global.utils.getStreamFromURL 
        : async (url) => (await axios.get(url, { responseType: "stream" })).data;

      const gifStream = await getStream(gifUrl);

      const mainMessageText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚡ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 
» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 
» 🫵 𝐓𝐎𝐑 𝐀𝐁𝐁𝐔 𝐋𝐀𝐆𝐄
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await api.sendMessage(
        {
          body: mainMessageText,
          attachment: gifStream
        },
        event.threadID,
        async (err) => {
          if (!err && loadingMsg) {
            setTimeout(() => {
              api.unsendMessage(loadingMsg.messageID);
            }, 4000);
          }
        },
        event.messageID
      );

    } catch (e) {
      console.error("Owner2 Command Error:", e);
      if (loadingMsg) {
        api.unsendMessage(loadingMsg.messageID);
      }
      return message.reply(`❌ Error: ${e.message}`);
    }
  }
};
