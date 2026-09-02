const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const AUTHOR = "𝆠፝𝆠፝𝐑𝐀𝐓𝐇𝐀𝐍-𝐍𝐎𝐘𝐎𝐍 ";

module.exports = {
  config: {
    name: "cutereply",
    version: "3.2.0",
    author: AUTHOR,
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Premium Auto Reply with exact match and user cooldown"
    },
    longDescription: {
      en: "Auto reply with stylish message & image. Exact trigger match with 3 minutes user cooldown."
    },
    category: "system"
  }
};

if (module.exports.config.author !== AUTHOR) {
  console.log("AUTHOR LOCK ACTIVATED");
  process.exit(1);
}

const USER_COOLDOWN = 3 * 60 * 1000;
const lastReplyUser = {};

const TRIGGERS = [
  {
    words: [
      "রায়হান",
      "Rayhan",
      "@Rj Sabbir",
      "Boss",
      "@মা্ঁতা্ঁল্ঁ রা্ঁজা্ঁ"
    ],
    text: `𝗢𝗪𝗡𝗘𝗥 𝐑𝐀𝐓𝐇𝐀𝐍-𝐍𝐎𝐘𝐎𝐍
───────────────
» 🌷 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗗𝗘𝗔𝗥
» 🤲 আসসালামু আলাইকুম
» 👑 রায়হান বস এখন 
» 🦉 ব্যস্ত আছেন
» 💌 আপনার মেসেজ 
» 🖥️ ইনবক্সে দিয়ে রাখুন
» ⚡ বস ফ্রি হলে উত্তর পাবেন
» 🤍 ধৈর্য ধরার জন্য ধন্যবাদ
───────────────
» 👤 𝆠፝𝐑𝐀𝐓𝐇𝐀𝐍-𝐍𝐎𝐘𝐎𝐍
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞:https://www.facebook.com/profile.php?id=61592296966851`,
    images: [
      "https://i.imgur.com/XDj7Lg3.jpeg",
      "https://i.imgur.com/vPTaRaf.jpeg",
      "https://i.imgur.com/maHcZQB.jpeg",
      "https://i.imgur.com/pWNb6lR.jpeg"
    ]
  },
  {
    words: [
      "নিঝুম",
      "@বট",
      "@Rj Sabbir"
    ],
    text: `🔰💠𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧💠🔱
───────────────
» 🌷 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗗𝗘𝗔𝗥
» 😹 আমাকে মেনশন দিয়ে লাভ নাই
» 🤖 আমি একটি Messenger Bot
» 💌 শুধুমাত্র বিনোদনের জন্য তৈরি
» ⚡ চাইলে আপনিও নিজের গ্রুপে 
» 🤖 নিতে পারেন
» 🤍 ধন্যবাদ
───────────────
» 👑 𝗢𝗪𝗡𝗘𝗥: 𝆠፝𝐑𝐀𝐓𝐇𝐀𝐍-𝐍𝐎𝐘𝐎𝐍

» 📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧: +8801789138157
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/profile.php?id=61592296966851",
    images: [
      "https://i.imgur.com/rkrXNso.jpeg",
      "https://i.imgur.com/wyNCOKV.gif"
    ]
  }
];

module.exports.onStart = async function () {};

module.exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").toLowerCase().trim();

    if (!body) return;

    if (senderID == api.getCurrentUserID()) return;

    const now = Date.now();
    if (lastReplyUser[senderID] && (now - lastReplyUser[senderID] < USER_COOLDOWN)) {
      return;
    }

    let matched = null;

    for (const item of TRIGGERS) {
      if (item.words.some(word => body === word.toLowerCase().trim())) {
        matched = item;
        break;
      }
    }

    if (!matched) return;

    lastReplyUser[senderID] = now;

    const imgUrl = matched.images[Math.floor(Math.random() * matched.images.length)];
    const imgName = path.basename(imgUrl);
    const imgPath = path.join(__dirname, imgName);

    if (!fs.existsSync(imgPath)) {
      await downloadImage(imgUrl, imgPath);
    }

    api.sendMessage(
      {
        body: matched.text,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      messageID
    );

  } catch (err) {
    console.log(err);
  }
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject();
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", () => {
      fs.unlink(dest, () => {});
      reject();
    });
  });
}
