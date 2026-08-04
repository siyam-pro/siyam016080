const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

const fetchAvatar = async (uid) => {
  try {
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const finalUrl = avatarUrl.includes("?")
      ? `${avatarUrl}&t=${Date.now()}`
      : `${avatarUrl}?t=${Date.now()}`;

    const response = await axios.get(finalUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Failed to fetch avatar: ${error.message}`);
  }
};

module.exports = {
  config: {
    name: 'dim',
    aliases: ['anda'],
    version: '2.1',
    author: '𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍', // নাম পরিবর্তন করলে বট বন্ধ হয়ে যাবে
    role: 0,
    category: 'fun',
    shortDescription: 'Turn someone into dim meme',
    longDescription: 'Funny dim meme with avatar on egg head',
    guide: '{pn} @mention / reply'
  },

  onStart: async function ({ event, api, message }) {

    const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

    if (module.exports.config.author !== LOCKED_AUTHOR) {
      const lockMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(lockMsg);
    }

    try {
      const targetID = event.mentions && Object.keys(event.mentions).length > 0
        ? Object.keys(event.mentions)[0]
        : event.messageReply?.senderID;

      if (!targetID) {
        const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ কাউকে 𝗠𝗲𝗻𝘁𝗶𝗼𝗻
» 🆔 𝐔𝐈𝐃 বা 𝗥𝗲𝗽𝗹𝘆 দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(noMentionMsg);
      }

      if (targetID === event.senderID) {
        const selfMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🙄 এই বলদ  নিজেকে 𝗗𝗶𝗺
» 🤧 বানানো যাবে না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(selfMsg);
      }

      const waitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝗗𝗶𝗺 বানানো হচ্ছে...
» 🚀 অনুগ্রহ করে কিছুক্ষণ
» 👰 অপেক্ষা করুন।...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply(waitMsg);

      const avatarBuffer = await fetchAvatar(targetID);
      const avatar = await loadImage(avatarBuffer);

      const cacheDir = path.join(__dirname, 'cache', 'dim');
      await fs.ensureDir(cacheDir);
      const bgPath = path.join(cacheDir, 'bg.jpg');

      let bg;
      if (!fs.existsSync(bgPath)) {
        const bgRes = await axios.get(
          'https://i.postimg.cc/Wbt5GLY7/5674fba3a393f7578a73919569b5147f.jpg',
          { responseType: 'arraybuffer' }
        );
        await fs.writeFile(bgPath, bgRes.data);
        bg = await loadImage(bgRes.data);
      } else {
        bg = await loadImage(await fs.readFile(bgPath));
      }

      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bg, 0, 0);

      const size = 150;
      const x = 100;
      const y = 60;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;

      const text = 'PURE DIM 😂';
      ctx.strokeText(text, bg.width / 2, bg.height - 40);
      ctx.fillText(text, bg.width / 2, bg.height - 40);

      const output = path.join(cacheDir, `${targetID}_${Date.now()}.png`);
      await fs.writeFile(output, canvas.toBuffer());

      const info = await api.getUserInfo(targetID);
      const name = info[targetID]?.name || 'Someone';

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥚 ${name}
» 🫡 এখন একদম 𝗗𝗶𝗺!
» 🤬 আর বেয়াদবি করিস না!
» 🐮-🫵-🙄-😏-🥵-🥱
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({
        body: successMsg,
        mentions: [{ tag: name, id: targetID }],
        attachment: fs.createReadStream(output)
      });

      setTimeout(() => fs.unlink(output).catch(() => {}), 5000);

    } catch (e) {
      console.error(e);
      let errorMsg;
      if (e.message.includes('Failed to fetch avatar')) {
        errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗔𝘃𝗮𝘁𝗮𝗿 আনতে সমস্যা হয়েছে!
» 🔒 প্রোফাইল 𝗣𝗿𝗶𝘃𝗮𝘁𝗲 হতে পারে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      } else {
        errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗗𝗶𝗺 বানাতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      }
      return message.reply(errorMsg);
    }
  }
};
