const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "media",
    aliases: ["audio1", "audio2", "watch1", "watch2"],
    version: "5.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "media",
    usePrefix: false
  },

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();

    const isAudio = body.startsWith("audio1") || body.startsWith("audio2");
    const isVideo = body.startsWith("watch1") || body.startsWith("watch2");

    if (!isAudio && !isVideo) return;

    let query = "";
    const args = event.body.split(/\s+/);
    const triggerWord = args.shift().toLowerCase();
    const inputQuery = args.join(" ");

    if (event.messageReply && event.messageReply.body) {
      query = event.messageReply.body;
    } else {
      query = inputQuery;
    }

    if (!query) {
      const noQueryMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎵  𝗚𝗔𝗡𝗘𝗥 𝗡𝗔𝗠 𝗟𝗘𝗞𝗛𝗢!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noQueryMsg);
    }

    const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔍  𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚: ${query}
» ⏳  𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    const waitMsg = await message.reply(loadingText);

    try {
      // 1. YouTube Search API
      const searchUrl = `https://api.vyt.workers.dev/search?q=${encodeURIComponent(query)}`;
      const searchRes = await axios.get(searchUrl);
      const data = searchRes.data?.results?.[0] || searchRes.data?.[0];

      if (!data || (!data.url && !data.id)) {
        const notFoundMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  𝗡𝗢 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 𝗙𝗢𝗨𝗡𝗗!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.editMessage(notFoundMsg, waitMsg.messageID);
      }

      const ytUrl = data.url || `https://www.youtube.com/watch?v=${data.id}`;
      const title = data.title || "Media File";

      const cacheDir = path.join(process.cwd(), "cache");
      if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
      const filePath = path.join(cacheDir, `${isAudio ? "audio" : "video"}_${Date.now()}.${isAudio ? "mp3" : "mp4"}`);

      // 2. Download Media via working fallback endpoints
      const typeParam = isAudio ? "audio" : "video";
      const downloadApi = `https://api.cobalt.tools/api/json`;
      
      let downloadUrl = null;

      try {
        const cobaltRes = await axios.post(downloadApi, {
          url: ytUrl,
          downloadMode: isAudio ? "audio" : "auto",
          audioFormat: "mp3"
        }, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        if (cobaltRes.data && cobaltRes.data.url) {
          downloadUrl = cobaltRes.data.url;
        }
      } catch (e) {
        // Fallback API if primary is busy
        const fallbackRes = await axios.get(`https://yt-download-api.vercel.app/api?url=${encodeURIComponent(ytUrl)}&type=${typeParam}`);
        downloadUrl = fallbackRes.data?.downloadUrl || fallbackRes.data?.url;
      }

      if (!downloadUrl) throw new Error("Download URL could not be retrieved");

      // 3. File Stream and Save
      const response = await axios({
        method: "get",
        url: downloadUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎬  𝗧𝗜𝗧𝗟𝗘: ${title}
» 📥  𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await api.unsendMessage(waitMsg.messageID).catch(() => {});
        await message.reply({
          body: successMsg,
          attachment: fs.createReadStream(filePath)
        });

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      writer.on("error", async (err) => {
        throw err;
      });

    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💥  𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗔𝗜𝗟𝗘𝗗!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.editMessage(errorMsg, waitMsg.messageID);
    }
  },

  onStart: async function () {}
};
