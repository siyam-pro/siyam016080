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
    name: "butslap",
    aliases: ["buttslap"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "fun",
    cooldown: 8,
    guide: {
      en: "{pn} [mention/reply/UID]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const sendMessage = message ? message.reply.bind(message) : (msg, callback) => api.sendMessage(msg, event.threadID, callback || null, event.messageID);

    const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

    if (module.exports.config.author !== LOCKED_AUTHOR) {
      const lockMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return sendMessage(lockMsg);
    }

    const { threadID, messageID, messageReply, mentions, senderID } = event;
    const type = args[0];

    if (!type) {
      const usageMsg = 
`» 👑 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡 👑
───────────────
» 📖 ব্যবহার পদ্ধতি:
» 🧭 𝗯𝘂𝘁𝘁𝘀𝗹𝗮𝗽 @𝘁𝗮𝗴 𝗿𝗲𝗽𝗹𝘆
» 🆔 𝗨𝗜𝗗 দিন।
───────────────
» 🧚🏻‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return sendMessage(usageMsg);
    }

    let id = senderID;
    let id2;

    if (messageReply) {
      id2 = messageReply.senderID;
    } else if (mentions && Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];
    } else if (args[0] && !isNaN(args[0])) {
      id2 = args[0];
    } else if (args[1] && !isNaN(args[1])) {
      id2 = args[1];
    } else {
      const targetMsg = 
`» 👑 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡 👑
───────────────
» 🫵 যাকে থাপ্পড় মারতে চান
» 🏷️ তাকে 𝗧𝗮𝗴, 𝗥𝗲𝗽𝗹𝘆 অথবা
» 🆔 𝗨𝗜𝗗 দিন।
───────────────
» 🧚🏻‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return sendMessage(targetMsg);
    }

    const waitMsg = 
`» 👑 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡 👑
───────────────
» 🖼️ 𝗦𝗹𝗮𝗽 𝗜𝗺𝗮𝗴𝗲 প্রসেস করা হচ্ছে...
» ⏳ একটু অপেক্ষা করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    await sendMessage(waitMsg);

    try {
      const url = `${await baseApiUrl()}/api/dig?type=buttslap&user=${id}&user2=${id2}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `slap_${id2}.png`);
      fs.writeFileSync(filePath, response.data);

      const successMsg = 
`» 👑 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡 👑
───────────────
» 👋 𝗕𝘂𝘁𝘁𝘀𝗹𝗮𝗽 একদম সফল!
» 💢 জোরে একটা সপাটে 
» 😹 থাপ্পড় দেওয়া হলো!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return sendMessage(
        {
          body: successMsg,
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );
    } catch (err) {
      console.error(err);

      const errorMsg = 
`» 👑 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡 👑
───────────────
» ❌ 𝗜𝗺𝗮𝗴𝗲 তৈরি করতে
» ☠️ সমস্যা হয়েছে!
» 🔄 সিয়াম ভাই এর সাথে 
» 🫶 যোগাযোগ করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return sendMessage(errorMsg);
    }
  }
};
