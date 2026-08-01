const axios = require("axios");

module.exports = {
  config: {
    name: "i",
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Generate multiple AI images from text.",
    },
    category: "AI-IMAGE",
    guide: {
      vi: "",
      en: "Example: {pn} cute girl | 4 (will generate 4 images)",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        const noPromptMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ একটি প্রম্পট দিন!
» 💡 Example: {pn} 
» 🧭 cute girl | 4
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(noPromptMsg);
      }

      let prompt, quantity;
      if (text.includes("|")) {
        [prompt, quantity] = text.split("|").map(str => str.trim());
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1 || quantity > 10) {
          const invalidQtyMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ছবির সংখ্যা ১ থেকে 
» 🎀 ১০ এর মধ্যে হতে হবে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return message.reply(invalidQtyMsg);
        }
      } else {
        prompt = text;
        quantity = 4; // default quantity
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const generatingMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ ${quantity} টি 
» 🖼️ ছবি তৈরি করা হচ্ছে 
» ⏳ অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const waitingMessage = await message.reply(generatingMsg);

      const imageUrls = [];
      const ratio = "1:1";

      for (let i = 0; i < quantity; i++) {
        const res = await axios.get(`https://www.ai4chat.co/api/image/generate`, {
          params: {
            prompt,
            aspect_ratio: ratio
          }
        });

        if (res.data?.image_link) {
          imageUrls.push(res.data.image_link);
        }
      }

      if (imageUrls.length === 0) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        await api.unsendMessage(waitingMessage.messageID);
        const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কোনো ছবি জেনারেট 
» 🤧 করা সম্ভব হয়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(failMsg);
      }

      const imageStreams = await Promise.all(
        imageUrls.map(url => global.utils.getStreamFromURL(url))
      );

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝗣𝗿𝗼𝗺𝗽𝘁: ${prompt}
» 🖼️ 𝗜𝗺𝗮𝗴𝗲𝘀: ${imageUrls.length}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({ body: successMsg, attachment: imageStreams });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.error("Image generation error:", error.message || error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি তৈরি করতে ব্যর্থ 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      message.reply(errorMsg);
    }
  },
};
