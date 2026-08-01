const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imgen",
    aliases: ["imggen", "imagine"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: "Generate AI image using imgen API",
    longDescription: "Use this command to generate images from a prompt using the imgen endpoint.",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\nExample: {pn} A dragon flying over a castle"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      const noPromptMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ একটি প্রম্পট লিখুন!
» 💡 Example: .
» 👑 imgen A dragon 
» ✅ flying over a castle
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noPromptMsg, threadID, messageID);
    }

    const waitMsgText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ ছবি তৈরি হচ্ছে...
» 🧭 কিছুক্ষণ অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    const msg = await api.sendMessage(waitMsgText, threadID);

    try {
      const response = await axios({
        method: "GET",
        url: "https://www.arch2devs.ct.ws/api/imgen",
        params: { prompt },
        responseType: "arraybuffer"
      });

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imagePath = path.join(cacheDir, `imgen_${senderID}_${Date.now()}.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅  Prompt: ${prompt}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(
        {
          body: successMsg,
          attachment: fs.createReadStream(imagePath)
        },
        threadID,
        () => {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        },
        msg.messageID
      );

    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি তৈরি করতে 
» 🥶 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(errorMsg, threadID, msg.messageID);
    }
  }
};
