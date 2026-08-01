const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "v",
  aliases: ["vi", "mp4"],
  version: "1.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  countDown: 5,
  role: 0,
  shortDescription: "ভিডিও প্লেয়ার কমান্ড",
  category: "media"
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const links = [
    "https://files.catbox.moe/etsdn9.mp3",
    "https://files.catbox.moe/ayepdz.mp3",
    "https://files.catbox.moe/oaecnx.mp3",
    "https://files.catbox.moe/xtpf61.mp3",
    "https://files.catbox.moe/12grz0.mp3",
    "https://files.catbox.moe/aaqddo.mp3",
    "https://files.catbox.moe/k3acvx.mp3",
    "https://files.catbox.moe/nry1qv.mp3",
    "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/y8dzik.mp3",
    "https://files.catbox.moe/z9d2e6.mp3",
    "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/0xscc8.mp3",
    "https://files.catbox.moe/q4m2ad.mp3",
    "https://files.catbox.moe/y8bg4r.mp3",
    "https://files.catbox.moe/q61co1.mp3",
    "https://files.catbox.moe/euq7fo.mp3",
    "https://files.catbox.moe/x5f56o.mp3",
    "https://files.catbox.moe/avlqok.mp3",
    "https://files.catbox.moe/v0twt3.mp3",
    "https://files.catbox.moe/qmpvpt.mp3"
  ];

  const randomLink = links[Math.floor(Math.random() * links.length)];
  const filePath = __dirname + `/cache/video_${Date.now()}.mp4`;

  try {
    const response = await axios({
      method: "GET",
      url: randomLink,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝐘𝐨𝐮𝐫 𝐑𝐚𝐧𝐝𝐨𝐦 𝐕𝐢𝐝𝐞𝐨
» 📡 𝐈𝐬 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲
» 📥 𝐋𝐨𝐚𝐝𝐞𝐝 𝐍𝐨𝐰!
» 🛡️ 𝐄𝐧𝐣𝐨𝐲 𝐓𝐡𝐞 𝐕𝐢𝐝𝐞𝐨!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    });

  } catch (error) {
    return api.sendMessage("❌ ভিডিও ফাইল প্রসেস করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
