const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "convertmp3",
    aliases: ["mp3", "convertmp3"],
    version: "1.0.0",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    shortDescription: "Convert video to MP3 🎧",
    longDescription: "Download video from URL and convert to MP3.",
    category: "media",
    guide: {
      en: "{pn} <video_url>"
    }
  },

  onStart: async function({ api, args, event }) {
    const { threadID, messageID } = event;

    try {
      const url = args.join(" ") || event.messageReply?.attachments?.[0]?.url;
      if (!url) {
        const noUrlMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗣𝗟𝗘𝗔𝗦𝗘 𝗣𝗥𝗢𝗩𝗜𝗗𝗘𝗔
» 🤦 𝗩𝗜𝗗𝗘𝗢 𝗨𝗥𝗟!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noUrlMsg, threadID, messageID);
      }

      const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎧  𝗠𝗣𝟯 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗜𝗡𝗚...
» 🧭  𝗟𝗢𝗔𝗗𝗜𝗡𝗚... ⏳
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const loadingMsg = await api.sendMessage(loadingText, threadID, messageID);

      const { data } = await axios.get(url, { responseType: "arraybuffer" });

      const filePath = path.join(__dirname, "/cache/video.mp3");
      fs.writeFileSync(filePath, Buffer.from(data));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔊  𝗠𝗣𝟯 𝗜𝗦 𝗥𝗘𝗔𝗗𝗬 ✅
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await api.sendMessage({
        body: successMsg,
        attachment: fs.createReadStream(filePath)
      }, threadID, async () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
      }, messageID);

    } catch (err) {
      console.log(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢
» 🧭 𝗖𝗢𝗡𝗩𝗘𝗥𝗧 𝗩𝗜𝗗𝗘𝗢!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧``;
      api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
