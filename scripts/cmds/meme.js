const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "meme",
    aliases: ["memes"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ message, event, api }) {
    const { threadID, messageID } = event;
    let loadingMsg;

    try {
      const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🍫 𝗠𝗘𝗠𝗘 𝗟𝗢𝗔𝗗𝗜𝗡𝗚...
» 🌀  𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      loadingMsg = await api.sendMessage(loadingText, threadID, messageID);

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/meme`);
      const imageUrl = res.data?.imageUrl;

      if (!imageUrl) {
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
        
        const noImageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛑 𝗠𝗘𝗠𝗘 𝗣𝗔𝗪𝗔 𝗝𝗔𝗬𝗡𝗜!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noImageMsg, threadID, messageID);
      }

      const stream = await axios({
        method: "GET",
        url: imageUrl,
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤣  𝗛𝗘𝗥𝗘 𝗜𝗦
» 😊 𝗬𝗢𝗨𝗥 𝗠𝗘𝗠𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await api.sendMessage({
        body: successMsg,
        attachment: stream.data
      }, threadID, async () => {
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
      }, messageID);

    } catch (error) {
      console.error(error);
      if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️  𝗦𝗢𝗠𝗢𝗦𝗬𝗔 𝗛𝗢𝗬𝗘𝗖𝗛𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
