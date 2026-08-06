const axios = require("axios");
const fs = require("fs");

const EXPECTED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const fileContent = fs.readFileSync(__filename, "utf8");

if (!fileContent.includes(`author: "${EXPECTED_AUTHOR}"`)) {
  console.log("⛔ 𝐀𝐔𝐓𝐇𝐎𝐑 𝐋𝐎𝐂𝐊 𝐓𝐑𝐈𝐆𝐆𝐄𝐑𝐄𝐃!");
  console.log("❌ 𝐀𝐮𝐭𝐡𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝! 𝐅𝐢𝐥𝐞 𝐢𝐬 𝐥𝐨𝐜𝐤𝐞𝐝 𝐧𝐨𝐰.");
  process.exit(1);
}

module.exports = {
  config: {
    name: "cdp",
    aliases: ["coupledp", "pairdp"],
    version: "1.5",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: { en: "𝐆𝐞𝐭 𝐫𝐚𝐧𝐝𝐨𝐦 𝐜𝐨𝐮𝐩𝐥𝐞 𝐃𝐏 (𝐍𝐨-𝐏𝐫𝐞𝐟𝐢𝐱)" },
    guide: { en: "𝐉𝐮𝐬𝐭 𝐭𝐲𝐩𝐞 '𝐜𝐝𝐩'" }
  },

  onChat: async function ({ api, event }) {
    if (!event.body) return;
    const word = event.body.toLowerCase().trim();

    if (word === "cdp") {
      return this.onStart({ api, event });
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    api.sendMessage(
      "⏳ | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭, 𝐁𝐨𝐬𝐬! 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐂𝐨𝐮𝐩𝐥𝐞 𝐃𝐏... 😘✨",
      threadID,
      messageID
    );

    try {
      const urlRes = await axios.get(
        "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json"
      );
      const baseUrl = urlRes.data.saimx69x;

      const res = await axios.get(`${baseUrl}/api/cdp2`);
      const { boy, girl } = res.data;

      const getImg = async (url) => {
        return (await axios.get(url, { responseType: "stream" })).data;
      };

      return api.sendMessage(
        {
          body: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐂𝐨𝐮𝐩𝐥𝐞 𝐃𝐏! 😘✨",
          attachment: [await getImg(girl), await getImg(boy)]
        },
        threadID,
        messageID
      );
    } catch (e) {
      console.error(e);
      return api.sendMessage(
        "❌ 𝐀𝐏𝐈 𝐄𝐫𝐫𝐨𝐫! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.",
        threadID,
        messageID
      );
    }
  }
};
