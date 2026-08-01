const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imagen3",
    aliases: [],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: "Generate image using Imagen 3",
    longDescription: "Generate AI image using Imagen 3",
    category: "ai-image",
    guide: {
      en: "{pn} [prompt]\nExample: {pn} a samurai standing in sunset"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    const prompt = args.join(" ");

    if (!prompt) {
      const noPromptMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে একটি 
» 🧭 প্রম্পট দিন!...
» 💡 Example: imagen3 
» 🎀 a samurai standing 
» 💋 in sunset
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noPromptMsg);
    }

    // React while loading
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const url = `https://renzweb.onrender.com/api/imagen3?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const fileName = `${Date.now()}_imagen3.jpg`;
      const filePath = path.join(cacheDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎨 𝗣𝗿𝗼𝗺𝗽𝘁: ${prompt}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      message.reply(
        {
          body: successMsg,
          attachment: fs.createReadStream(filePath)
        },
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete after send
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      );

    } catch (error) {
      console.error("Error generating image:", error.message);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি তৈরি করতে 
» 🤧 ব্যর্থ হয়েছে!..
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      message.reply(errorMsg);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
