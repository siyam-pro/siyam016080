const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "hug",
  version: "3.1.1",
  permission: 0,
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Hug someone 🥰",
  prefix: true,
  category: "canvas",
  usages: "hug @mention",
  cooldowns: 5
};

module.exports.onLoad = async () => {
  const dir = path.join(__dirname, "cache", "canvas");
  const filePath = path.join(dir, "hugv1.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    const image = (await axios.get(
      "https://drive.google.com/uc?id=1D5g9o1ICiqw4TmjsRg2g6dBGb2Pkg1EH",
      { responseType: "arraybuffer" }
    )).data;

    fs.writeFileSync(filePath, image);
  }
};

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const __root = path.join(__dirname, "cache", "canvas");
  const bg = await jimp.read(path.join(__root, "hugv1.png"));

  const pathImg = path.join(__root, `hug_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  const getAvatar = async (uid, savePath) => {
    const avatarBuffer = (await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;

    fs.writeFileSync(savePath, Buffer.from(avatarBuffer));
  };

  await getAvatar(one, avatarOnePath);
  await getAvatar(two, avatarTwoPath);

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  bg.composite(circleOne.resize(150, 150), 320, 100);
  bg.composite(circleTwo.resize(130, 130), 280, 280);

  const finalImg = await bg.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, finalImg);

  if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
  if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

function stylishCaption(name) {
  return `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤗 ${name} তোমাকে 🥰
» 😘 জড়িয়ে ধরে হাগ দিলাম
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length === 0) {
    const noMentionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🥺 দয়া করে যাকে হাগ 
» 🥵 দিতে চান মেনশন করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    return api.sendMessage(noMentionMsg, threadID, messageID);
  }

  const one = senderID;
  const two = mentionIDs[0];
  const name = mentions[two].replace("@", "");

  try {
    const imgPath = await makeImage({ one, two });

    api.sendMessage(
      {
        body: stylishCaption(name),
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );
  } catch (err) {
    console.error(err);
    const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবিটি তৈরি করতে 
» 🤧 সমস্যা হয়েছে। 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    return api.sendMessage(errorMsg, threadID, messageID);
  }
};

/* ✅ FRAMEWORK FIX */
module.exports.onStart = module.exports.run;
