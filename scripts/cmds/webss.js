const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "webss",
    version: "1.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Website screenshot"
    },
    description: {
      en: "Take a full page screenshot of any website"
    },
    category: "Ai",
    guide: {
      en: "{p}webss <url>\nExample: {p}webss https://google.com"
    }
  },

  langs: {
    en: {
      missing: `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
» 🐸 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗨𝗥𝗟 
» ❤️‍🩹 𝗣𝗹𝗲𝗮𝘀𝗲 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝗔 𝗩𝗮𝗹𝗶𝗱 𝗨𝗿𝗹
» 🫣 𝗘𝘅𝗮𝗺𝗽𝗹𝗲 : 𝘄𝗲𝗯𝘀𝘀 𝗵𝘁𝘁𝗽𝘀://𝗲𝘅𝗮𝗺𝗽𝗹𝗲.𝗰𝗼𝗺
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`,
      loading: `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
» 📸 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 
» ⏳ 𝗪𝗲𝗯 𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁 𝗧𝗮𝗸𝗶𝗻𝗴...
» 🌐 %1
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`,
      error: `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
» ❌ 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗙𝗔𝗜𝗟𝗘𝗗 
» ⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗢𝗿 𝗕𝗹𝗼𝗰𝗸𝗲𝗱 𝗨𝗿𝗹
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const url = args[0].startsWith("http")
      ? args[0]
      : `https://${args[0]}`;

    const loadingMessage = getLang("loading").replace("%1", url);
    await message.reply(loadingMessage);

    try {
      const res = await axios.get(
        `https://api.popcat.xyz/v2/screenshot?url=${encodeURIComponent(url)}`,
        { responseType: "arraybuffer" }
      );

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const filePath = path.join(
        cacheDir,
        `webss_${Date.now()}.png`
      );

      fs.writeFileSync(filePath, res.data);

      await message.reply(
        {
          body: `━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
» ✅ 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 
» 📸 𝗪𝗲𝗯𝘀𝗶𝘁𝗲 𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁
» 🌐 𝗨𝗿𝗹 : ${url}
» 🖼️ 𝗧𝘆𝗽𝗲 : 𝗙𝘂𝗹𝗹 𝗣𝗮𝗴𝗲
» ⚡ 𝗦𝘁𝗮𝘁𝘂𝘀 : 𝗦𝘂𝗰𝗰𝗲𝘀𝘀
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`,
          attachment: fs.createReadStream(filePath)
        },
        () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      );
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
