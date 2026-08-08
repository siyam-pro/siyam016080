const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

async function getStream(url) {
  const res = await axios({ url, responseType: "stream" });
  return res.data;
}

module.exports = {
  config: {
    name: "xnx",
    aliases: ["xnx2"],
    version: "0.0.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Search and download videos" },
    description: { en: "Search and download videos via reply (xnx with thumbnail, xnx2 without thumbnail)" },
    category: "media",
    guide: { en: "{pn} <keyword> or {p}xnx2 <keyword>" }
  },

  onStart: async function ({ api, args, message, event, commandName }) {
    if (this.config.author !== String.fromCharCode(55349, 56780, 55349, 56776, 55349, 56792, 55349, 56768, 55349, 56780, 45, 55349, 56775, 55349, 56768, 55349, 56786, 55349, 56768, 55349, 56781)) return;

    let base;
    const creatorName = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡";

    try {
      const configRes = await axios.get(nix);
      base = configRes.data?.api;
      if (!base) throw new Error();
    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("❌ | Error: Failed to fetch API configuration.", event.threadID, event.messageID);
    }

    const query = args.join(" ");
    if (!query) return api.sendMessage("⚠️ | Usage: xnx <keyword> or xnx2 <keyword>", event.threadID, event.messageID);

    const usedCommand = event.body.split(" ")[0].toLowerCase();
    const isXnx2 = usedCommand.includes("xnx2");

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const res = await axios.get(`${base}/xnx?q=${encodeURIComponent(query)}`);
      const results = res.data.result;

      if (!results || results.length === 0) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("❌ | No results found for your search.", event.threadID, event.messageID);
      }

      const limitedResults = results.slice(0, 6);
      let msg = `🔎 | Results for: "${query}"\n━━━━━━━━━━━━━━━━━━\n\n`;
      const thumbnails = [];

      for (let i = 0; i < limitedResults.length; i++) {
        const v = limitedResults[i];
        msg += `${i + 1}. ${v.title}\n⏱ ${v.duration || 'N/A'} | 👀 ${v.views || 'N/A'}\n\n`;
        
        if (!isXnx2 && v.thumbnail) {
          try {
            thumbnails.push(await getStream(v.thumbnail));
          } catch (e) {}
        }
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return api.sendMessage(
        {
          body: msg + "📝 | Reply with a number (1-6) to download.\n🖌️ Created by: " + creatorName,
          attachment: thumbnails.length ? thumbnails : undefined
        },
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            results: limitedResults,
            messageID: info.messageID,
            author: event.senderID,
            commandName: this.config.name,
            base
          });
        },
        event.messageID
      );

    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("❌ | Failed to search videos. Try again later.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (this.config.author !== String.fromCharCode(55349, 56780, 55349, 56776, 55349, 56792, 55349, 56768, 55349, 56780, 45, 55349, 56775, 55349, 56768, 55349, 56786, 55349, 56768, 55349, 56781)) return;

    const { results, author, messageID, base } = Reply;
    const creatorName = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡";
    
    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > results.length) {
      return api.sendMessage("❌ | Invalid selection. Please choose 1 to 6.", event.threadID, event.messageID);
    }

    const selected = results[choice - 1];
    await api.unsendMessage(messageID).catch(() => {});
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const dlRes = await axios.get(`${base}/xnxdl?url=${encodeURIComponent(selected.link)}`);
      const data = dlRes.data.result;
      const videoUrl = data.files.high || data.files.low;

      const cachePath = path.join(process.cwd(), 'cache');
      if (!fs.existsSync(cachePath)) fs.ensureDirSync(cachePath);
      const filePath = path.join(cachePath, `vid_milon_${Date.now()}.mp4`);

      const vidData = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(vidData.data));

      const body = `━━━━━━━━━━━━━━━━━━\n🎬 𝗧𝗶𝘁𝗹𝗲: ${data.title}\n⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${data.duration || 'N/A'}\n👀 𝗜𝗻𝗳𝗼: ${data.info || 'N/A'}\n━━━━━━━━━━━━━━━━━━\n✅ | Download Success!\n🖌️ Power by: ${creatorName}`;

      await api.sendMessage(
        { body: body, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        },
        event.messageID
      );

    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("❌ | Failed to download the selected video.", event.threadID, event.messageID);
    }
  }
};
