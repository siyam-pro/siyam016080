const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "mia",
    aliases: ["miakhalifa"],
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: "Mia meme maker",
    guide: {
      en: "{pn} <text>"
    }
  },

  wrapText: async (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);

      const words = text.split(" ");
      const lines = [];
      let line = "";

      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }

        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = "";
        }

        if (words.length === 0) lines.push(line.trim());
      }
      resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) {
    const { loadImage, createCanvas } = require("canvas");
    let { threadID, messageID } = event;

    const text = args.join(" ");
    if (!text) {
      const noTextMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✍️  𝗧𝗘𝗫𝗧 𝗟𝗘𝗞𝗛𝗢 𝗕𝗥𝗢!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noTextMsg, threadID, messageID);
    }

    const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🖼️  𝗠𝗜𝗔 𝗠𝗘𝗠𝗘 𝗠𝗔𝗞𝗜𝗡𝗚...
» ⏳  𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    const loadingMsg = await api.sendMessage(loadingText, threadID, messageID);

    const imageURL = "https://i.ibb.co/4gDpt4Tx/img-1765026096438.jpg";
    const pathImg = __dirname + "/cache/mia.png";

    try {
      const res = await axios.get(imageURL, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(res.data));

      const baseImage = await loadImage(pathImg);
      const canvasImg = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvasImg.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvasImg.width, canvasImg.height);

      ctx.font = "300 32px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      const lines = await this.wrapText(ctx, text, 600);
      const startY = 160;

      ctx.fillText(lines.join("\n"), 50, startY);

      fs.writeFileSync(pathImg, canvasImg.toBuffer());

      return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        threadID,
        async () => {
          if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
          if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
        },
        messageID
      );

    } catch (err) {
      console.error(err);
      if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥  𝗦𝗢𝗠𝗢𝗦𝗬𝗔 𝗛𝗢𝗬𝗘𝗖𝗛𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  },
};
