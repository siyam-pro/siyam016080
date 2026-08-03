const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay2",
    version: "3.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Gay canvas with fixed syntax",
    longDescription: "Places PFPs on background with fixed destructuring and blacklist.",
    category: "fun",
    guide: "{pn} @tag | {pn} [reply]"
  },

  onStart: async function ({ api, event, args, usersData }) {

    const { threadID, messageID, senderID, mentions, type, messageReply } = event; 
    
    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else {
      const tagError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐨𝐫
» 📩 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐭𝐡𝐞𝐢𝐫 𝐦𝐞𝐬𝐬𝐚𝐠𝐞!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(tagError, threadID, messageID);
    }

    const blacklistedID = "61587068812520";
    if (targetID == blacklistedID) {
      const blacklistError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐢 𝐮𝐬𝐞𝐫 𝐞𝐫 𝐮𝐩𝐨𝐫 𝐞𝐢
» 🚫 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐤𝐚𝐣 𝐤𝐨𝐫𝐛𝐞 𝐧𝐚!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(blacklistError, threadID, messageID);
    }

    try {
      const waitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛠️ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐢𝐦𝐚𝐠𝐞...
» ⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(waitMsg, threadID, messageID);

      const backgroundURL = "https://i.ibb.co/Ld1J2cx6/598832374d5c.png";
      const senderPFPURL = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const targetPFPURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [bgImg, senderPFP, targetPFP] = await Promise.all([
        loadImage(backgroundURL),
        loadImage(senderPFPURL),
        loadImage(targetPFPURL)
      ]);

      const canvas = createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const drawCirclePFP = (img, x, y, size) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      };

      drawCirclePFP(senderPFP, 400, 170, 60); 
      drawCirclePFP(targetPFP, 210, 180, 60);

      const path = __dirname + `/cache/gay_${senderID}.png`;
      fs.writeFileSync(path, canvas.toBuffer("image/png"));

      const targetName = await usersData.getName(targetID);
      const responseMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤷 ওমাগো মাদার চোদ গে😹
» 👤 𝐍𝐚𝐦𝐞: ${targetName}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage({
        body: responseMsg,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (e) {
      console.error(e);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞
» ⚠️ 𝐤𝐨𝐫𝐚 𝐬𝐨𝐦𝐯𝐨𝐛 𝐡𝐨𝐲𝐧𝐢.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
