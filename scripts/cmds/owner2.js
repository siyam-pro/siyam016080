const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const gifUrls = [
  "https://i.imgur.com/4FUSn8C.gif",
  "https://i.imgur.com/N3JxhT8.gif",
  "https://i.imgur.com/rOTsKJd.gif"
];

module.exports = {
  config: {
    name: "owner2",
    aliases: [],
    version: "1.0.0",
    author: "𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Owner GIF"
    },
    longDescription: {
      en: "Premium owner gif sender"
    },
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onLoad: async function () {

    const cacheFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

  },

  onStart: async function ({ api, event }) {

    try {

      const loadingMsg = await api.sendMessage(
        "📡 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧 𝗢𝗪𝗡𝗘𝗥 2 𝗟𝗢𝗔𝗗𝗜𝗡𝗚...⏳",
        event.threadID
      );

      const cacheFolder = path.join(__dirname, "cache");

      const filePath = path.join(
        cacheFolder,
        `owner2_${Date.now()}.gif`
      );

      const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

      const response = await axios({
        method: "GET",
        url: randomGifUrl,
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {

        api.sendMessage(
          {
            body: "🫵তোর আব্বু লাগে 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {

            setTimeout(() => {
              api.unsendMessage(loadingMsg.messageID);
            }, 4000);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

          },
          event.messageID
        );

      });

      writer.on("error", async (err) => {

        console.log(err);

        api.sendMessage(
          "❌ GIF Write Failed",
          event.threadID,
          event.messageID
        );

      });

    } catch (e) {

      console.log(e);

      api.sendMessage(
        `❌ ${e.message}`,
        event.threadID,
        event.messageID
      );

    }
  }
};
