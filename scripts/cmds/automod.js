const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const userWarnings = new Map();
const userSpamTracker = new Map();

const badWordsList = [
  "boda", "gud", "mugi", "khanki", "magi", "chudi", "madarchod", "gandu", 
  "chod", "bokachoda", "bal", "bramon", "voda", "khanki magi", "chudmarani",
  "fuck", "bitch", "bastard", "asshole", "dick", "pussy", "slut", "whore",
  "বোদা", "গুদ", "খানকি", "মাগি", "চুদি", "মাদারচোদ", "গাঁড়ু", "চোদ",
  "বোকাচোদা", "বাল", "চুদমারানি", "খানকি মাগি", "ভোদা"
];

const forbiddenLinkPatterns = [
  /t\.me\//i,
  /telegram\.me\//i,
  /chat\.whatsapp\.com\//i,
  /discord\.gg\//i,
  /discord\.com\/invite\//i,
  /m\.me\/j\//i
];

async function generateWarningImage(avatarUrl) {
  const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
  const baseImage = await loadImage(Buffer.from(response.data));

  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, 500, 500);

  ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
  ctx.fillRect(0, 0, 500, 500);

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 15;
  ctx.strokeRect(0, 0, 500, 500);

  ctx.save();
  ctx.translate(250, 250);
  ctx.rotate(-45 * Math.PI / 180);

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(-300, -35, 600, 70);

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.strokeRect(-300, -35, 600, 70);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("WARNING", 0, 0);

  ctx.restore();

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = path.join(cacheDir, `warn_${Date.now()}.png`);
  
  fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
  return filePath;
}

module.exports = {
  config: {
    name: "automod",
    version: "1.0.0",
    author: "亗 SIYAM HASAN 亗",
    countDown: 0,
    role: 0,
    shortDescription: "Auto moderation for bad words, links and spamming",
    longDescription: "Detects bad words, forbidden links, and spam messages then warns users with profile overlay",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, api, usersData }) {
    const { body, senderID, threadID } = event;
    if (!body || senderID === api.getCurrentUserID()) return;

    const lowerBody = body.toLowerCase();
    let violationReason = null;
    let detectedDetail = "";

    const foundBadWord = badWordsList.find(word => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(lowerBody) || lowerBody.includes(word);
    });

    if (foundBadWord) {
      violationReason = "খারাপ গালিগালাজ প্রয়োগ";
      detectedDetail = foundBadWord;
    }

    if (!violationReason) {
      const foundLink = forbiddenLinkPatterns.some(pattern => pattern.test(lowerBody));
      if (foundLink) {
        violationReason = "অনুমোদিত লিংক বা গ্রুপ লিংক শেয়ার";
        detectedDetail = "গ্রুপ/চ্যানেল লিংক";
      }
    }

    if (!violationReason) {
      const now = Date.now();
      const userSpamData = userSpamTracker.get(senderID) || { count: 0, lastMsg: "", time: now };

      if (now - userSpamData.time < 3000) {
        if (userSpamData.lastMsg === lowerBody) {
          userSpamData.count += 1;
        } else {
          userSpamData.count = 1;
          userSpamData.lastMsg = lowerBody;
        }
      } else {
        userSpamData.count = 1;
        userSpamData.lastMsg = lowerBody;
        userSpamData.time = now;
      }

      userSpamTracker.set(senderID, userSpamData);

      if (userSpamData.count >= 3) {
        violationReason = "একই মেসেজ বারবার স্প্যাম করা";
        detectedDetail = "মেসেজ স্প্যামিং";
        userSpamTracker.delete(senderID);
      }
    }

    if (violationReason) {
      let currentWarnCount = (userWarnings.get(senderID) || 0) + 1;
      userWarnings.set(senderID, currentWarnCount);

      const userName = await usersData.getName(senderID);
      const avatarUrl = `https://graph.facebook.com/${senderID}/picture?height=500&width=500&access_token=6628568379%7Cc154142d172352352345e6f3b063d804`;

      let imagePath = null;
      try {
        imagePath = await generateWarningImage(avatarUrl);
      } catch (e) {
        imagePath = null;
      }

      const warningText = `» ⚠️ সিকিউরিটি ওয়ার্নিং আলার্ট ⚠️
───────────────
» 👤 ব্যবহারকারী: ${userName}
» 🚫 কারণ: ${violationReason}
» 🔍 নির্দিষ্ট বিষয়: ${detectedDetail}
» 📊 ওয়ার্নিং গণনা: [ ${currentWarnCount} / 2 ]
───────────────
» 🛑 সাবধান! ২ টি ওয়ার্নিং পূর্ণ হলে গ্রুপ থেকে ব্যবস্থা নেওয়া হবে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const msgPayload = { body: warningText };
      if (imagePath && fs.existsSync(imagePath)) {
        msgPayload.attachment = fs.createReadStream(imagePath);
      }

      await message.reply(msgPayload);

      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlink(imagePath, () => {});
      }

      if (currentWarnCount >= 2) {
        userWarnings.set(senderID, 0);
        try {
          await api.removeUserFromGroup(senderID, threadID);
        } catch (err) {
          message.send("» ⚠️ ইউজারকে গ্রুপ থেকে রিমুভ করতে বটের এডমিন পারমিশন প্রয়োজন।");
        }
      }
    }
  }
};
