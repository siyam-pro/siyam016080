const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "weigen",
    aliases: ["wgen"],
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 3,
    role: 0,
    shortDescription: "Generate AI image",
    longDescription: "Generate an image using Weigen AI API with a prompt",
    category: "AI-IMAGE",
    guide: "{pn} <prompt>"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ছবি তৈরি করতে একটি
» ✍️ প্রম্পট (Prompt) লিখুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const msg = await api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎨 আপনার ছবি তৈরি করা
» ⏳ হচ্ছে, অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      event.threadID
    );

    try {
      // Make sure cache folder exists
      const cachePath = path.join(__dirname, "../cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

      const imgPath = path.join(cachePath, `weigen-${Date.now()}.png`);

      const response = await axios({
        method: "GET",
        url: "https://www.arch2devs.ct.ws/api/weigen",
        params: { prompt },
        responseType: "stream"
      });

      const writer = fs.createWriteStream(imgPath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎨 Image GeneratedSuSuccessfully
Successfullyuccessfully!
» 📝 Prompt: "${prompt}"
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }, msg.messageID);
      });

      writer.on("error", err => {
        console.error("❌ File System Error (ছবি সেভ করার সমস্যা):", err);
        api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ Error: Failed to save
» 📁 generated image file.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          event.threadID,
          msg.messageID
        );
      });

    } catch (err) {
      console.error("❌ API / Network Error (ছবি জেনারেট সমস্যা):", err);
      api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ Error: Failed to 
» ✍️ generate image. API 
» 👿 issue or invalid response
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        msg.messageID
      );
    }
  }
};
