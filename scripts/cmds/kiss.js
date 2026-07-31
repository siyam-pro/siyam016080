const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "kiss",
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    longDescription: "Generate anime-style kiss image",
    category: "love",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ message, event, api }) {
    const { threadID, messageID } = event;

    try {
      const mention = Object.keys(event.mentions);
      if (mention.length === 0) {
        const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💋 কাকে কিস করতে চাও 
» 🥱 তাকে মেনশন করো!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(noMentionMsg);
      }

      const senderID = event.senderID;
      const targetID = mention[0];

      const base = await mahmud();
      const apiURL = `${base}/api/kiss`;

      const response = await axios.post(
        apiURL,
        { senderID, targetID },
        { responseType: "arraybuffer" }
      );

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgPath = path.join(
        cacheDir,
        `kiss_${senderID}_${targetID}_${Date.now()}.png`
      );
      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥵 উফ্ বেবি! তোমাকে তো 
» 🤤 খেয়ে দিল, এখন তো 
» 💋 তোমার বিয়ে হবে না!🤭🤣
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({
        body: successMsg,
        attachment: fs.createReadStream(imgPath)
      });

      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    } catch (err) {
      console.error("Error in kiss command:", err.message || err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কিস করাতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝HN𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};
