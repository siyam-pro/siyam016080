const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "hijla",
    version: "1.1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "fun",
    description: "Create a funny hijla image with an oval/face-shaped pfp.",
    guide: "{pn} @mention or reply"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      const noTargetMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ আরে মামা, কারে সাজাবি
» 💃 তারে তো মেনশন দিলি না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noTargetMsg);
    }

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "User";

      const imgLink = "https://i.imgur.com/taT6Gb7.jpeg"; 
      const filePath = path.join(cacheDir, `hijla_milon_${Date.now()}.png`);

      const loadingMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ দাঁড়া মামা ওরে হিজলা
» 🥵 সাজাইয়া দিচ্ছি... 💄
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      message.reply(loadingMsg);

      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(targetPfpUrl)
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      const pfpWidth = 90;  
      const pfpHeight = 110; 
      const x = 148; 
      const y = 82; 

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x + pfpWidth / 2, y + pfpHeight / 2, pfpWidth / 2, pfpHeight / 2, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(targetPfp, x, y, pfpWidth, pfpHeight); 
      ctx.restore();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const finalCaption = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💃 ঐ দেখ মামা, আমাদের
» 🥱 নতুন হিজলা!
» 👤 𝗡𝗮𝗺𝗲: ${userName} 
» 👏 মামা হাততালি দে সবাই!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage({
        body: finalCaption,
        mentions: [{ tag: userName, id: targetID }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (e) {
      console.error("HIJLA ERROR:", e);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ মামা ওটা পালাইছে!
» 🆔 আবার ট্রাই কর।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};
