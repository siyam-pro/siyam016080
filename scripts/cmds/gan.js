const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

let lastPlayed = -1;

// 🔐 AUTHOR LOCK
const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "gan",
    version: "1.0.4",
    role: 0,
    author: AUTHOR_LOCK,
    shortDescription: "Play random audio song with command 🎶",
    longDescription: "Sends a random audio from preset Catbox links.",
    category: "media",
    guide: "{p}gan"
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;

    // 🔐 ANTI-CHANGE LOCK CHECK
    if (module.exports.config.author !== AUTHOR_LOCK) {
      const lockErrorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝐀𝐮𝐭𝐡𝐨𝐫 𝐥𝐨𝐜𝐤 𝐟𝐚𝐢𝐥𝐞𝐝!
» ⚠️ 𝐅𝐢𝐥𝐞 𝐦𝐨𝐝𝐢𝐟𝐢𝐞𝐝.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(lockErrorMsg, threadID, messageID);
    }

    // 🎵 আপনার অরিজিনাল ২৯টি লিংকের একটিও বাদ দেওয়া হয়নি:
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
      const emptyError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐍𝐨 𝐬𝐨𝐧𝐠𝐬 𝐜𝐨𝐮𝐥𝐝 𝐛𝐞 𝐟𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(emptyError, threadID, messageID);
    }

    api.setMessageReaction("🎵", messageID, () => {}, true);

    let index;
    do {
      index = Math.floor(Math.random() * songLinks.length);
    } while (index === lastPlayed && songLinks.length > 1);

    lastPlayed = index;

    const url = songLinks[index];
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const tempFilePath = path.join(cacheDir, `temp_${Date.now()}`);
    const audioFilePath = path.join(cacheDir, `audio_${Date.now()}.mp3`);

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        // MP4 বা অন্য যেকোনো ফরম্যাটকে অডিও (MP3) ভয়েসে কনভার্ট করা
        ffmpeg(tempFilePath)
          .toFormat("mp3")
          .on("end", async () => {
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

            const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎶 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐚𝐮𝐝𝐢𝐨 𝐬𝐨𝐧𝐠
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

            api.sendMessage(
              {
                body: successMsg,
                attachment: fs.createReadStream(audioFilePath)
              },
              threadID,
              async () => {
                if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);
              },
              messageID
            );
          })
          .on("error", (err) => {
            console.error(err);
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);

            const convError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐨𝐧𝐯𝐞𝐫𝐭 𝐭𝐨 𝐚𝐮𝐝𝐢𝐨!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
            api.sendMessage(convError, threadID, messageID);
          })
          .save(audioFilePath);
      });

      writer.on("error", () => {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        const sendError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐚𝐮𝐝𝐢𝐨!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        api.sendMessage(sendError, threadID, messageID);
      });

    } catch (err) {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      const downloadError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐮𝐝𝐢𝐨!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(downloadError, threadID, messageID);
    }
  }
};
