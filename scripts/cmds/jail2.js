const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "jail2",
    aliases: [],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: {
      en: "{pn} [mention/reply/UID]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply, mentions } = event;

    let id2;
    if (messageReply) {
      id2 = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];
    } else if (args[0]) {
      id2 = args[0];
    } else {
      const noTargetMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🐸 যাকে জেলে পুরতে চাওতাকে
» ✅ তাকে মেনশন, রিপ্লাই বা
» 🆔 ইউআইডি (UID) দাও!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noTargetMsg, threadID, messageID);
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=jail&user=${id2}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const filePath = path.join(cacheDir, `jail_${id2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, response.data);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🐸 যাক পাঠানোঘরেষে
» 🤧 অবশেষে তোকে শ্রীঘরে
» 🥱 পাঠানো গেল! 😂
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          attachment: fs.createReadStream(filePath),
          body: successMsg
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        messageID
      );
    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি তৈরি করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
