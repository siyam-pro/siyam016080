const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "man",
    aliases: ["spiderman"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "memes",
    longDescription: "",
    category: "photo",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID } = event;
    const mention = Object.keys(event.mentions);

    if (mention.length == 0) {
      const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👤  𝗣𝗟𝗘𝗔𝗦𝗘 𝗠𝗘𝗡𝗧𝗜𝗢𝗡 𝗦𝗢𝗠𝗘𝗢𝗡𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noMentionMsg);
    }

    const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🕸️  𝗠𝗔𝗞𝗜𝗡𝗚 𝗜𝗠𝗔𝗚𝗘...
» ⏳  𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    const loadingMsg = await api.sendMessage(loadingText, threadID, messageID);

    try {
      if (mention.length == 1) {
        const one = event.senderID, two = mention[0];
        const ptth = await bal(one, two);

        const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🕸️  𝗜𝗧'𝗦 𝗛𝗜𝗠!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await message.reply({
          body: successMsg,
          attachment: fs.createReadStream(ptth)
        });

        if (fs.existsSync(ptth)) fs.unlinkSync(ptth);
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);

      } else {
        const one = mention[1], two = mention[0];
        const ptth = await bal(one, two);

        const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🕸️  𝗛𝗘 𝗜𝗦 𝗡𝗢𝗧 𝗠𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await message.reply({
          body: successMsg,
          attachment: fs.createReadStream(ptth)
        });

        if (fs.existsSync(ptth)) fs.unlinkSync(ptth);
        if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
      }
    } catch (e) {
      console.error(e);
      if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);

      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢 𝗖𝗥𝗘𝗔𝗧𝗘 𝗜𝗠𝗔𝗚𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};

async function bal(one, two) {
  let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avone.circle();
  let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avtwo.circle();
  let pth = __dirname + `/cache/spiderman_${Date.now()}.png`;
  let img = await jimp.read("https://i.imgur.com/AIizK0f.jpeg");
  img.resize(1440, 1080).composite(avone.resize(170, 170), 325, 110).composite(avtwo.resize(170, 170), 1000, 95);

  await img.writeAsync(pth);
  return pth;
}
