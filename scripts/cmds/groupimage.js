const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "groupimage",
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    role: 1, // অ্যাডমিন বা মডারেটরদের জন্য (চাইলে 0 করো)
    shortDescription: "Change group photo",
    longDescription: "রিপ্লাই দেওয়া ছবিটাকে গ্রুপ প্রোফাইল ছবিতে সেট করবে",
    category: "box",
    guide: "{pn} (একটি ছবিতে রিপ্লাই দাও)"
  },

  onStart: async function ({ api, event }) {
    try {
      // ✅ প্রথমে চেক করবো রিপ্লাই আছে কিনা
      if (event.type !== "message_reply") {
        const noReplyMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ দয়া করে একটি
» 🖼️ ছবিতে রিপ্লাই দাও!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noReplyMsg, event.threadID, event.messageID);
      }

      // ✅ অ্যাটাচমেন্ট আছে কিনা
      const attachments = event.messageReply.attachments;
      if (!attachments || attachments.length === 0) {
        const noImageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ রিপ্লাই করা মেসেজে
» 🔍 কোনো ছবি পাওয়া যায়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noImageMsg, event.threadID, event.messageID);
      }

      // ✅ একাধিক ছবি দেওয়া থাকলে
      if (attachments.length > 1) {
        const multiImageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ শুধু একটি ছবিতে
» 📸 রিপ্লাই দাও!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(multiImageMsg, event.threadID, event.messageID);
      }

      // ✅ ডাউনলোড ও সেট করা
      const imageURL = attachments[0].url;
      const pathImg = __dirname + "/cache/groupimage.png";
      const getData = (await axios.get(imageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathImg, Buffer.from(getData, "utf-utf8"));
      await api.changeGroupImage(fs.createReadStream(pathImg), event.threadID);
      fs.unlinkSync(pathImg);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ গ্রুপ প্রোফাইল ছবি
» 🖼️ সফলভাবে পরিবর্তন হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(successMsg, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ছবিটি সেট করা যায়নি
» 🔄 আবার চেষ্টা করো!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
