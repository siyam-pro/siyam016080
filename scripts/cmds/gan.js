const fs = require("fs");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

// 🔐 AUTHOR LOCK (DO NOT CHANGE)
const AUTHOR_LOCK = "FARHAN-KHAN";

module.exports = {
  config: {
    name: "gan",
    version: "1.0.2",
    role: 0,
    author: AUTHOR_LOCK,
    shortDescription: "Play random song with command 🎶",
    longDescription: "Sends a random mp3 song from preset Catbox links.",
    category: "media",
    guide: "{p}gan"
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;

    // 🔐 ANTI-CHANGE LOCK CHECK
    if (module.exports.config.author !== AUTHOR_LOCK) {
      return api.sendMessage(
        "⛔ 𝗔𝘂𝘁𝗵𝗼𝗿 𝗹𝗼𝗰𝗸 𝗳𝗮𝗶𝗹𝗲𝗱! 𝗙𝗶𝗹𝗲 𝗺𝗼𝗱𝗶𝗳𝗶𝗲𝗱.",
        threadID,
        messageID
      );
    }

    const songLinks = [
      "https://files.catbox.moe/jx9cpq.mp4",
      "https://files.catbox.moe/jzg3j7.mp4",
      "https://files.catbox.moe/m4nggm.mp4",
      "https://files.catbox.moe/dbxfju.mp4",
      "https://files.catbox.moe/xx6d7i.mp4",
      "https://files.catbox.moe/0gncxf.mp4",
      "https://files.catbox.moe/gcm88s.mp4",
      "https://files.catbox.moe/yz23lp.mp4",

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

    if (songLinks.length === 0) {
      return api.sendMessage("❌ Nᴏ sᴏɴɢs ᴄᴏᴜʟᴅ ʙᴇ ғᴏᴜɴᴅ!", threadID, messageID);
    }

    api.setMessageReaction("🎵", messageID, () => {}, true);

    let index;
    do {
      index = Math.floor(Math.random() * songLinks.length);
    } while (index === lastPlayed && songLinks.length > 1);

    lastPlayed = index;

    const url = songLinks[index];
    const filePath = path.join(__dirname, `/cache/song_${index}.mp3`);

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        api.sendMessage(
          {
            body: "🎶 Hᴇʀᴇ's ʏᴏᴜʀ sᴏɴɢ 🎧",
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          async () => {
            fs.unlinkSync(filePath);
          },
          messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ Fᴀɪʟᴇᴅ ᴛᴏ sᴇɴᴅ sᴏɴɢ!", threadID, messageID);
      });

    } catch (err) {
      api.sendMessage("⚠️ Fᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ sᴏɴɢ!", threadID, messageID);
    }
  }
};
