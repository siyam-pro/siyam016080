const axios = require("axios");

module.exports = {
  config: {
    name: "creart",
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Generate AI image",
    longDescription: "Generate image using prompt via smfahim.xyz CreartAI",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <your prompt>"
    }
  },

  onStart: async function ({ message, args }) {

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

      return message.reply(lockMsg);
    }

    const prompt = args.join(" ");

    if (!prompt) {
      const usageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ছবি তৈরি করার জন্য
» 👰 একটি 𝗣𝗿𝗼𝗺𝗽𝘁 দিন।
───────────────
» 💡 ব্যবহার পদ্ধতি:
» 🙄 creart a beautiful cat
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(usageMsg);
    }

    const waitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝗜𝗺𝗮𝗴𝗲 তৈরি করা হচ্ছে...
» 📝 𝗣𝗿𝗼𝗺𝗽𝘁: "${prompt}"
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    await message.reply(waitMsg);

    try {
      const url = `https://smfahim.xyz/creartai?prompt=${encodeURIComponent(prompt)}`;
      const imgRes = await axios.get(url, { responseType: "stream" });

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 আপনার 𝗜𝗺𝗮𝗴𝗲 
» 🎀 তৈরি সম্পন্ন হয়েছে!
» 📝 𝗣𝗿𝗼𝗺𝗽𝘁: "${prompt}"
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply({
        body: successMsg,
        attachment: imgRes.data
      });

    } catch (error) {
      console.error("Image generation error:", error.message);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗜𝗺𝗮𝗴𝗲 তৈরি করতে
» ☠️ সমস্যা হয়েছে!
» 🔄 অনুগ্রহ করে কিছুক্ষণ পর
» 🫣 আবার চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(errorMsg);
    }
  }
};
