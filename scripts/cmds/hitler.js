const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "hitler",
    aliases: ["হিটলার"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    description: {
      bn: "কাউকে হিটলার বানিয়ে মজার ছবি তৈরি করুন",
      en: "Create a funny Hitler image of someone",
      vi: "Tạo một bức ảnh Hitler vui nhộn về ai đó"
    },
    category: "fun",
    guide: {
      bn: '   {pn} <@tag/reply/UID>: কাউকে হিটলার বানাতে ট্যাগ করুন',
      en: '   {pn} <@tag/reply/UID>: Tag/Reply to make someone Hitler',
      vi: '   {pn} <@tag/reply/UID>: Gắn thẻ để biến ai đó thành Hitler'
    }
  },

  langs: {
    bn: {
      noTarget: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কাউকে মেনশন দিন
» 🏟️ রিপ্লাই করুন অথবা 
» 🆔 𝐔𝐈𝐃 দিন! 🎖
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🐸 এই নাও তোমার
» 🖼️ হিটলার ছবি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      error: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ সমস্যা হয়েছে: %1
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    },
    en: {
      noTarget: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ Please mention
» 🦥 reply, or provide 
» 🆔 𝐔𝐈𝐃 of the target
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🐸 Here is your 
» 🤦 Hitler image!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      error: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ API error: %1
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    },
    vi: {
      noTarget: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ Hãy gắn thẻ 
» 🫦 phản hồi hoặc 
» 🆔 cung cấp 𝐔𝐈𝐃🎖
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🐸 Ảnh Hitler 
» 🤌 của bạn đây!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      error: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  Lỗi: %1
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {
    const { mentions, messageReply } = event;
    let id;

    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0] && !isNaN(args[0])) {
      id = args[0];
    }

    if (!id) return message.reply(getLang("noTarget"));

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const filePath = path.join(cacheDir, `hitler_${id}.png`);

    try {
      api.setMessageReaction("🎖", event.messageID, () => {}, true);

      const baseUrl = await baseApiUrl();
      const url = `${baseUrl}/api/dig?type=hitler&user=${id}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      return message.reply({
        body: getLang("success"),
        attachment: fs.createReadStream(filePath)
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error("Hitler Error:", err);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return message.reply(getLang("error", err.message));
    }
  }
};
