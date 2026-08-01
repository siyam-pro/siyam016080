const axios = require('axios'); // ✅ Axios সরাসরি import করা হয়েছে

module.exports = {
  config: {
    name: "imgur",
    version: "1.0.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: "Upload image/video/GIF to Imgur and get direct links",
    longDescription: "Reply to any image, video, or GIF to upload it to Imgur and get the link.",
    category: "other",
    guide: "[reply with any media file]",
    cooldowns: 0
  },

  onStart: async function ({ api, event }) {
    // Get API link from JSON
    let Shaon;
    try {
      const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
      Shaon = apis.data.imgur;
    } catch {
      return api.sendMessage("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐈𝐦𝐠𝐮𝐫 𝐀𝐏𝐈 𝐥𝐢𝐧𝐤!", event.threadID, event.messageID);
    }

    const reply = event.messageReply;
    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return api.sendMessage(
        "𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐈𝐦𝐠𝐮𝐫...!✅",
        event.threadID,
        event.messageID
      );
    }

    const links = [];

    for (const attachment of reply.attachments) {
      try {
        const url = encodeURIComponent(attachment.url);
        const upload = await axios.get(`${Shaon}/imgur?link=${url}`);
        links.push(upload.data.uploaded.image || "❌ 𝐍𝐨 𝐥𝐢𝐧𝐤 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝");
      } catch (e) {
        links.push("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝");
      }
    }

    const messageToSend = links.length === 1
      ? links[0]
      : `✅ 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐟𝐢𝐥𝐞𝐬 𝐈𝐦𝐠𝐮𝐫 𝐥𝐢𝐧𝐤𝐬:\n\n${links.join("\n")}`;

    return api.sendMessage(messageToSend, event.threadID, event.messageID);
  }
};
