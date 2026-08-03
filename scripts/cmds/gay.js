const DIG = require("discord-image-generation");
const axios = require('axios');
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
  config: {
    name: "gay",
    aliases: ["gay"],
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "rainbowify someone's avatar",
    longDescription: "",
    category: "fun",
    guide: "{pn} [@mention]"
  },

  onStart: async function ({ message, event, args }) {
    try {
      const mentions = Object.keys(event.mentions);
      const senderID = event.senderID;

      const targetID = event.type === "message_reply"
        ? event.messageReply.senderID
        : mentions.length > 0
          ? mentions[0]
          : senderID;

      const pth = await makeGay(targetID);

      const responseMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏳️‍🌈 𝐇𝐞𝐲 𝐥𝐨𝐨𝐤 𝐚𝐭 𝐭𝐡𝐢𝐬 𝐚𝐯𝐚𝐭𝐚𝐫!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({
        body: responseMsg,
        attachment: fs.createReadStream(pth)
      });

      try { fs.unlinkSync(pth); } catch (e) { /* ignore */ }
    } catch (e) {
      console.error(e);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞
» ⚠️ 𝐤𝐨𝐫𝐚 𝐬𝐨𝐦𝐯𝐨𝐛 𝐡𝐨𝐲𝐧𝐢.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};

async function getAvatarBuffer(uid) {
  const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

async function makeGay(uid) {
  const avatar = await getAvatarBuffer(uid);
  const img = await new DIG.Gay().getImage(avatar);
  const tmpDir = os.tmpdir();
  const pth = path.join(tmpDir, `gay_${Date.now()}_${Math.floor(Math.random()*10000)}.png`);
  fs.writeFileSync(pth, img);
  return pth;
}
