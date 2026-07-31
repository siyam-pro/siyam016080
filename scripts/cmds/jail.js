const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

module.exports.config = {
  name: "jail",
  version: "8.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  countDown: 10,
  role: 0,
  shortDescription: "Wanted with thin bars",
  category: "fun",
  guide: { en: "{p}jail @tag" }
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
  const { threadID, messageID, mentions } = event;

  let uid;
  let name = "Wanted";

  if (Object.keys(mentions).length === 0) {
    uid = event.senderID;
  } else {
    uid = Object.keys(mentions)[0];
    name = mentions[uid];
  }

  try {
    name = await usersData.getName(uid);

    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const avatarCache = path.join(cacheDir, `wanted_avatar_${uid}.jpg`);

    const imageUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const downloadCallback = async () => {
      if (fs.existsSync(avatarCache)) {
        const stats = fs.statSync(avatarCache);
        if (stats.size < 10000) {
          const defaultUrl = "https://imgur.com/8Q2Z3tI.png";
          request(encodeURI(defaultUrl))
            .pipe(fs.createWriteStream(avatarCache))
            .on("close", generateWanted);
        } else {
          generateWanted();
        }
      }
    };

    const generateWanted = async () => {
      try {
        const wantedPath = await generateThinBarsImage(avatarCache, name);

        const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔒 @${name} WANTED! Locked Up!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        api.sendMessage({
          body: successMsg,
          mentions: [{ tag: name, id: uid }],
          attachment: fs.createReadStream(wantedPath)
        }, threadID, () => {
          setTimeout(() => {
            [avatarCache, wantedPath].forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
          }, 10000);
        }, messageID);

      } catch (genErr) {
        const genErrMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ জেলে ঢোকাতে
» 💋 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        api.sendMessage(genErrMsg, threadID, messageID);
      }
    };

    request(encodeURI(imageUrl))
      .pipe(fs.createWriteStream(avatarCache))
      .on("close", downloadCallback)
      .on("error", () => {
        const defaultUrl = "https://i.imgur.com/8Q2Z3tI.png";
        request(encodeURI(defaultUrl))
          .pipe(fs.createWriteStream(avatarCache))
          .on("close", generateWanted);
      });

  } catch (error) {
    console.error("Wanted Error:", error);
    const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❎ জেলে ঢুকানো যাচ্ছে না! 
» 🤦 ডিফল্ট চেষ্টা করা হচ্ছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    api.sendMessage(errorMsg, threadID, messageID);
  }
};

async function generateThinBarsImage(avatarPath, name) {
  const avatar = await loadImage(avatarPath);
  const width = 600;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  ctx.font = 'bold 100px Arial';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#991b1b';
  ctx.shadowBlur = 20;
  ctx.fillText('WANTED', width / 2, 120);
  ctx.shadowColor = 'transparent';

  const centerX = width / 2;
  const centerY = height / 2 + 20;
  const radius = 200;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';

  const barCount = 8;
  const barSpacing = width / (barCount + 1);
  for (let i = 1; i <= barCount; i++) {
    const x = i * barSpacing;
    ctx.beginPath();
    ctx.moveTo(x, 180);
    ctx.lineTo(x, height - 180);
    ctx.stroke();
  }

  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(barSpacing, 260);
  ctx.lineTo(width - barSpacing, 260);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(barSpacing, height - 260);
  ctx.lineTo(width - barSpacing, height - 260);
  ctx.stroke();

  ctx.globalAlpha = 1.0;

  ctx.font = 'italic 50px "Segoe UI"';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 20;
  ctx.fillText('Locked Up!', width / 2, height - 100);
  ctx.shadowColor = 'transparent';

  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(name.toUpperCase(), width / 2, height - 50);

  const wantedPath = path.join(__dirname, 'cache', `wanted_thin_${Date.now()}.png`);
  fs.writeFileSync(wantedPath, canvas.toBuffer());
  return wantedPath;
}
