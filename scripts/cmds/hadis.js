const axios = require("axios");

/* ================== 🔐 AUTHOR LOCK SYSTEM ================== */
const REAL_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function checkAuthorLock(config, api, event) {
  if (config.author !== REAL_AUTHOR) {
    api.sendMessage(
      "⛔ You are not authorized to change the author name. Locked by 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍!",
      event.threadID,
      event.messageID
    );
    return false;
  }
  return true;
}
/* =========================================================== */

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "hadis",
    aliases: ["hadith"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "islamic",
    shortDescription: {
      en: "Random Bangla Hadis"
    },
    longDescription: {
      en: "Sends a random Bangla Hadis with source from Mahmud's global API"
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, api, event }) {
    // 🔐 AUTHOR CHECK
    if (!checkAuthorLock(module.exports.config, api, event)) return;

    try {
      const base = await mahmud();
      const res = await axios.get(`${base}/api/hadis`);
      const hadis = res.data;

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📖 ${hadis.text}

- ${hadis.source} 🖤
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      message.reply(successMsg);

    } catch (err) {
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥹 হাদিস তথ্য আনতে 
» 🆔 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      message.reply(errorMsg);
    }
  }
};
