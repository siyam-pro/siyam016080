const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "convertmp3",
    aliases: ["mp3", "convertmp3"],
    version: "1.0.1",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    shortDescription: "Convert video to MP3 🎧",
    longDescription: "Download video from URL and convert to MP3.",
    category: "media",
    guide: {
      en: "{pn} <video_url> or reply to a video"
    }
  },

  onStart: async function({ api, args, event }) {
    const { threadID, messageID } = event;
    const filePath = path.join(__dirname, `/cache/audio_${Date.now()}.mp3`);

    try {
      let url = args.join(" ");
      if (!url && event.type === "message_reply") {
        const attachment = event.messageReply.attachments?.[0];
        if (attachment && (attachment.type === "video" || attachment.type === "audio")) {
          url = attachment.url;
        }
      }

      if (!url) {
        const noUrlMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗣𝗟𝗘𝗔𝗦𝗘 𝗣𝗥𝗢𝗩𝗜𝗗𝗘 𝗔
» 🤦 𝗩𝗜𝗗𝗘𝗢 𝗨𝗥𝗟 𝗢𝗥 𝗥𝗘𝗣𝗟𝗬!
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

      const response = await axios.get(url, { responseType: "arraybuffer" });
      await fs.outputFile(filePath, Buffer.from(response.data));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔊  𝗠𝗣𝗦 𝗜𝗦 𝗥𝗘𝗔𝗗𝗬 ✅
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await api.sendMessage({
        body: successMsg,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
      }, messageID);

    } catch (err) {
      console.error(err);
      
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢
» 🧭 𝗖𝗢𝗡𝗩𝗘𝗥𝗧 𝗩𝗜𝗗𝗘𝗢!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      
      api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
