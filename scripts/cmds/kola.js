const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "kola",
    version: "2.9.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "fun",
    usePrefix: true,
    description: "Create a funny collage.",
    guide: {
      en: "kola @mention or reply"
    }
  },

  onChat: async function ({ api, event, message, commandName }) {
    const { body, senderID } = event;
    if (!body) return;

    const adminIDs = global.GoatBot.config.adminBot || [];
    const isBotAdmin = adminIDs.includes(senderID);
    const args = body.toLowerCase().split(" ");

    if (isBotAdmin && (args[0] === "kola")) {
      return this.onStart({ api, event, message, commandName });
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    let targetID;

    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } 
    else if (messageReply) {
      targetID = messageReply.senderID;
    } 
    else {
      targetID = event.senderID;
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "User";

      const imgLink = "https://i.imgur.com/iNV52mX.jpeg"; 
      const filePath = path.join(cacheDir, `kola_siyam_${Date.now()}.png`);

      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(targetPfpUrl)
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      const pfpWidth = 130;
      const pfpHeight = 170;
      const x = (canvas.width / 2) - (pfpWidth / 2) + 25;
      const y = (canvas.height / 2) - (pfpHeight / 2) - 110;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        x + pfpWidth / 2,
        y + pfpHeight / 2,
        pfpWidth / 2,
        pfpHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(targetPfp, x, y, pfpWidth, pfpHeight);
      ctx.restore();

      ctx.beginPath();
      ctx.ellipse(
        x + pfpWidth / 2,
        y + pfpHeight / 2,
        pfpWidth / 2,
        pfpHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const finalCaption =
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😂 ঐ দেখ মামা এরে 
» 🫡 চিনতে পারস কি না!
» 🙆 নাম: ${userName}
» 💃 ইজ্জতের তো আর 
» 😹 কিছুই বাকি নাই!
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
      console.error("KOLA ERROR:", e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ঝামেলা হইছে 
» 😔 কলা খাওয়ানো গেল না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};
