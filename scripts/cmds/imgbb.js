const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "imgbb",
    aliases: ["i"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    description: {
      en: "Upload image(s) to imgbb"
    },
    category: "uploader",
    guide: {
      en: "{pn} (reply to one or more images)"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const imgbbApiKey = "1b4d99fa0c3195efe42ceb62670f2a25";
    
    const attachments = event.messageReply?.attachments?.filter(att =>
      ["photo", "sticker", "animated_image"].includes(att.type)
    );

    if (!attachments || attachments.length === 0) {
      const noImageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে এক বা 
» 🧑‍💻 একাধিক ছবির রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noImageMsg, threadID, messageID);
    }

    try {
      const uploadedLinks = await Promise.all(
        attachments.map(async (attachment, index) => {
          const response = await axios.get(attachment.url, { responseType: "arraybuffer" });
          const formData = new FormData();
          formData.append("image", Buffer.from(response.data, "binary"), { filename: `image${index}.jpg` });

          const res = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders(),
            params: {
              key: imgbbApiKey
            }
          });

          return res.data.data.url;
        })
      );

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔗  𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱 𝗟𝗶𝗻𝗸𝘀:
» ✅ ${uploadedLinks.join("\n")}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(successMsg, threadID, messageID);

    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ImgBB-তে ছবি 
» ☠️ আপলোড করতে 
» ❎ ব্যর্থ হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
