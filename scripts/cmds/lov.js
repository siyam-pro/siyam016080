const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "love3",
    aliases: ["us"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "we together",
    longDescription: "",
    category: "love",
    guide: {
      vi: "{pn} [@tag]",
      en: "{pn} [@tag]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const mention = Object.keys(event.mentions);

    if (mention.length == 0) {
      const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🙈 কাউকে মেনশন না করলে 
» 🙄 প্রেম করবা কার সাথে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noMentionMsg);
    } else if (mention.length == 1) {
      const one = event.senderID, two = mention[0];
      bal(one, two).then(ptth => {
        const msg1 = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👩‍❤️‍👨 শুধু তুমি আর আমি,
» 🥱 বাকি সব ফাউল প্রানী! 🥰
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        message.reply({ body: msg1, attachment: fs.createReadStream(ptth) }).then(() => fs.unlinkSync(ptth));
      });
    } else {
      const one = mention[1], two = mention[0];
      bal(one, two).then(ptth => {
        const msg2 = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💖 দুইজনের কী যে পিরীত!
» 🌹 সারা জীবন যেন এভাবেই কাটায়! 😉
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        message.reply({ body: msg2, attachment: fs.createReadStream(ptth) }).then(() => fs.unlinkSync(ptth));
      });
    }
  }
};

async function bal(one, two) {
  let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avone.circle();
  let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avtwo.circle();
  let pth = "abcd.png";
  let img = await jimp.read("https://i.imgur.com/ReWuiwU.jpg");

  img.resize(466, 659).composite(avone.resize(110, 110), 150, 76).composite(avtwo.resize(100, 100), 245, 305);

  await img.writeAsync(pth);
  return pth;
}
