const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imgtool",
    aliases: ["filter", "ফিল্টার"],
    version: "2.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Advanced Image Filter & Editor Tool",
    longDescription: "Apply various high-quality filters and enhancements to any image easily.",
    category: "media",
    guide: "{pn} <filter_number> (Reply to an image)"
  },

  onStart: async function ({ api, event, args }) {
    // Check if the user replied to an image
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🖼️ যেকোনো ছবির ওপর রিপ্লাই দিন!
» 📌 ফিল্টার লিস্ট:
» 1. Grayscale সাদা-কালো
» 2. Invert কালার ইনভার্ট
» 3. Sepia ভিন্টেজ লুক
» 4. Blur ব্লার ফিল্টার
» 5. Sharpen শার্প ফিল্টার
» 6. Pixelate পিক্সেল আর্ট
───────────────
» 💡 ব্যবহার: ছবির ওপর রিপ্লাই দিয়ে অপশন নম্বর লিখুন (যেমন: 1, 2)
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ অনুগ্রহ করে শুধু 
» 🎀 ছবির ওপর রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const filterChoice = args[0];
    const validFilters = {
      "1": "grayscale",
      "2": "invert",
      "3": "sepia",
      "4": "blur",
      "5": "sharpen",
      "6": "pixelate"
    };

    if (!filterChoice || !validFilters[filterChoice]) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ১ থেকে ৬ এর 
» 🫡 মধ্যে সিলেক্ট করুন!
» 1. Grayscale
» 2. Invert
» 3. Sepia
» 4. Blur
» 5. Sharpen
» 6. Pixelate
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const msg = await api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎨 ছবিতে ফিল্টার 
» 🪐 যুক্ত করা হচ্ছে...
» ⏳ অনুগ্রহ করে 
» ✍️ অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      event.threadID
    );

    try {
      const imageUrl = attachment.url;
      const selectedFilter = validFilters[filterChoice];

      // API request to filter image
      const apiUrl = `https://api.popcat.xyz/${selectedFilter}?image=${encodeURIComponent(imageUrl)}`;

      const cachePath = path.join(__dirname, "../cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

      const imgPath = path.join(cachePath, `imgtool-${Date.now()}.png`);

      const response = await axios({
        method: "GET",
        url: apiUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(imgPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ছবি সফলভাবে 
» 😋 এডিট করা হয়েছে!
» 🎭 ফিল্টার: ${selectedFilter.toUpperCase()}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          },
          msg.messageID
        );
      });

      writer.on("error", err => {
        console.error("❌ ফাইল সেভ করতে সমস্যা:", err);
        api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি সেভ করতে 
» 🖥️ সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          event.threadID,
          msg.messageID
        );
      });

    } catch (err) {
      console.error("❌ ইমেজ প্রসেসিং এরর:", err);
      api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি ফিল্টার করতে 
» 👿 সমস্যা হয়েছে!
» ✍️ আবার চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        msg.messageID
      );
    }
  }
};
