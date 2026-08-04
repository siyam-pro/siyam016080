const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

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

// 🔒 AUTHOR LOCK
if (module.exports.config.author !== AUTHOR) {
  console.log("🚫 AUTHOR LOCK ACTIVATED");
  process.exit(1);
}

// ⏱️ USER COOLDOWN (3 Minutes = 180,000 Milliseconds)
const USER_COOLDOWN = 3 * 60 * 1000;
const lastReplyUser = {};

// ✨ AUTO REPLY DATA
const TRIGGERS = [
  // 👑 OWNER REPLY
  {
    words: [
      "siyam",
      "সিয়াম",
      "@RJ siyam",
      "সিয়া.ম",
      "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ"
    ],
    text: `𝗢𝗪𝗡𝗘𝗥 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
» 🌷 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗗𝗘𝗔𝗥
» 🤲 আসসালামু আলাইকুম
» 👑 সিয়াম বস এখন 
» 🦉 ব্যস্ত আছেন
» 💌 আপনার মেসেজ 
» 🖥️ ইনবক্সে দিয়ে রাখুন
» ⚡ বস ফ্রি হলে উত্তর পাবেন
» 🤍 ধৈর্য ধরার জন্য ধন্যবাদ
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
» 📞 +8801789138157
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/profile.php?id=61592677587804`,
    images: [
      "https://i.imgur.com/XDj7Lg3.jpeg",
      "https://i.imgur.com/vPTaRaf.jpeg",
      "https://i.imgur.com/maHcZQB.jpeg",
      "https://i.imgur.com/pWNb6lR.jpeg"
    ]
  },
  // 🤖 BOT REPLY
  {
    words: [
      "নিঝুম",
      "@বট",
      "@নি্ঁঝু্ঁম্ঁ রা্ঁতে্ঁর্ঁ প্ঁরী্ঁ"
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
» 👑 𝗢𝗪𝗡𝗘𝗥: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍

» 📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧: +8801789138157
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/profile.php?id=61592677587804`,
    images: [
      "https://i.imgur.com/rkrXNso.jpeg",
      "https://i.imgur.com/wyNCOKV.gif"
    ]
  }
];

module.exports.onStart = async function () {};

// 💬 CHAT EVENT
module.exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").toLowerCase().trim();

    if (!body) return;

    // 🤖 IGNORE BOT
    if (senderID == api.getCurrentUserID()) return;

    // ⏱️ INDIVIDUAL USER COOLDOWN CHECK
    const now = Date.now();
    if (lastReplyUser[senderID] && (now - lastReplyUser[senderID] < USER_COOLDOWN)) {
      return; // ৩ মিনিট পার না হলে এখানেই কোড থেমে যাবে, কোনো রিপ্লাই দেবে না।
    }

    let matched = null;

    // 🔍 EXACT MATCH WORD CHECK
    for (const item of TRIGGERS) {
      if (item.words.some(word => body === word.toLowerCase().trim())) {
        matched = item;
        break;
      }
    }

    if (!matched) return;

    // ⏱️ SET COOLDOWN FOR THIS USER
    lastReplyUser[senderID] = now;

    // 🎲 RANDOM IMAGE
    const imgUrl = matched.images[Math.floor(Math.random() * matched.images.length)];
    const imgName = path.basename(imgUrl);
    const imgPath = path.join(__dirname, imgName);

    // 📥 DOWNLOAD IMAGE
    if (!fs.existsSync(imgPath)) {
      await downloadImage(imgUrl, imgPath);
    }

    // 📤 SEND MESSAGE
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

// 📥 IMAGE DOWNLOAD
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
