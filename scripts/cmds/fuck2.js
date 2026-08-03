const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "fuck2",
    aliases: ["fck2"],
    version: "3.3",
    author: AUTHOR_LOCK,
    countDown: 5,
    role: 0,
    shortDescription: "Overlay two users avatars on template",
    longDescription: "Overlay two users avatars on another image template",
    category: "funny",
    guide: "{p}fuck2 @mention or reply"
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    const sendMessage = message && typeof message.reply === "function" 
      ? (data) => message.reply(data)
      : (data) => api.sendMessage(data, threadID, messageID);

    try {
      const mentions = Object.keys(event.mentions || {});
      
      const two = event.type === "message_reply"
        ? event.messageReply.senderID
        : mentions.length > 0
          ? mentions[0]
          : null;

      if (!two) {
        const noMentionError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧
» 📌 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return sendMessage(noMentionError);
      }

      const one = event.senderID;

      const dir = path.join(__dirname, "cache");
      fs.ensureDirSync(dir);

      const bgPath = path.join(dir, "fuckv3_template.png");

      if (!fs.existsSync(bgPath)) {
        const img = await axios.get(
          "https://i.ibb.co/TW9Kbwr/images-2022-08-14-T183542-356.jpg",
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(bgPath, Buffer.from(img.data));
      }

      const avatar1 = path.join(dir, `av1_${one}_${Date.now()}.png`);
      const avatar2 = path.join(dir, `av2_${two}_${Date.now()}.png`);

      const getAvatar = async (id, savePath) => {
        const avatar = await axios.get(
          `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(savePath, Buffer.from(avatar.data));
      };

      await getAvatar(one, avatar1);
      await getAvatar(two, avatar2);

      const bg = await loadImage(bgPath);
      const av1 = await loadImage(avatar1);
      const av2 = await loadImage(avatar2);

      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bg, 0, 0, bg.width, bg.height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(70, 350, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av1, 20, 300, 100, 100);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(175, 95, 75, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av2, 100, 20, 150, 150);
      ctx.restore();

      const outPath = path.join(dir, `fuck2_result_${Date.now()}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outPath, buffer);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👅 উফ বেবি আস্তে চুদো 
» 🥵 ব্যথা পাবে তো 🤭
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await sendMessage({
        body: successMsg,
        attachment: fs.createReadStream(outPath),
      });

      if (fs.existsSync(avatar1)) fs.unlinkSync(avatar1);
      if (fs.existsSync(avatar2)) fs.unlinkSync(avatar2);
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

    } catch (err) {
      console.error(err);
      const processError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐫𝐫𝐨𝐫: ${err.message}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return sendMessage(processError);
    }
  },
};
