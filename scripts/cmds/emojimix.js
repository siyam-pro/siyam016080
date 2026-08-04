const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mix"],
    version: "1.0.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: {
      en: "Mix two emojis"
    },
    longDescription: {
      en: "Mix two emojis into one image"
    },
    category: "fun",
    guide: {
      en: "{p}mix 😄 😍"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length < 2) {
      const usageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ভুল ফরম্যাট!
» 📝 অন্তত দুইটি ইমোজি দিন।
───────────────
» 💡 ব্যবহার পদ্ধতি:
» 🙄 ${global.GoatBot.config.prefix}mix 😄 😍
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(usageMsg, threadID, messageID);
    }

    const emoji1 = args[0];
    const emoji2 = args[1];

    const cachePath = path.join(__dirname, "cache", `emojimix_${Date.now()}.png`);

    try {
      const url = encodeURI(
        `https://web-api-delta.vercel.app/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`
      );

      const res = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(cachePath, res.data);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 আপনার 𝗘𝗺𝗼𝗷𝗶 𝗠𝗶𝘅 
» 🫣 সফল হয়েছে...!
» 🎨 মিশ্রণ: ${emoji1} + ${emoji2}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await api.sendMessage(
        {
          body: successMsg,
          attachment: fs.createReadStream(cachePath)
        },
        threadID,
        messageID
      );

      fs.unlinkSync(cachePath);

    } catch (error) {
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ দুঃখিত! ${emoji1} এবং ${emoji2}
» 💥 একসাথে 𝗠𝗶𝘅 
» 🙄 করা সম্ভব নয়...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
