const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const videoList = [
  { url: "https://files.catbox.moe/3nus2b.mp4", file: "video1.mp4" },
  { url: "https://files.catbox.moe/t2kbfa.mp4", file: "video2.mp4" },
  { url: "https://files.catbox.moe/qu53g7.mp4", file: "video3.mp4" },
  { url: "https://files.catbox.moe/rzhmck.mp4", file: "video4.mp4" },
  { url: "https://files.catbox.moe/g7jy2d.mp4", file: "video5.mp4" }
];

const USER_COOLDOWN = 3 * 60 * 1000;
const lastReplyUser = {};

// ব্যাকগ্রাউন্ডে ভিডিও ডাউনলোড করার ফাংশন
async function downloadVideos() {
  for (const vid of videoList) {
    const filePath = path.join(CACHE_DIR, vid.file);
    if (!fs.existsSync(filePath)) {
      try {
        const response = await axios({
          method: "GET",
          url: vid.url,
          responseType: "stream",
          timeout: 30000
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
        console.log(`[DOWNLOAD] Success: ${vid.file}`);
      } catch (err) {
        console.log(`[DOWNLOAD] Failed: ${vid.file}`, err.message);
      }
    }
  }
}

downloadVideos();

// লেখকের নাম হাইড করার সিক্রেট মেথড (কেউ কোড খুললে নাম বুঝতে পারবে না)
const _0x5a1b = ['U0lZQU0tSEFTQU4=', 'from'];
const getAuthor = () => Buffer[_0x5a1b[1]](_0x5a1b[0], 'base64').toString('utf-8');

module.exports = {
  config: {
    name: "mantion2",
    version: "14.0",
    author: getAuthor(), // কমান্ডে চেক করলে "SIYAM-HASAN" দেখাবে
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Admin mention auto reply with exact match and user cooldown"
    },
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {
    try {
      const admins = [
        {
          uid: "61568411310748",
          triggers: [
            "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ",
            "@RJ siyam",
            "siyam",
            "*siyam",
            "সিয়াম ভাই",
            "boss siyam",
            "siyam boss",
            "হৃদয়",
            "হৃদয় ভাই",
            "সিয়াম",
            "রিদয় ভাই",
            "বট ওনার কে"
          ]
        }
      ];

      const senderID = String(event.senderID);
      if (admins.some(a => a.uid === senderID)) return;

      const text = (event.body || "").toLowerCase().trim();
      if (!text) return;

      const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

      const triggeredAdmin = admins.find(admin => {
        const isMentioned = mentionedIDs.includes(admin.uid);
        const isExactTrigger = admin.triggers.some(
          trigger => text === trigger.toLowerCase().trim()
        );
        return isMentioned || isExactTrigger;
      });

      if (!triggeredAdmin) return;

      const now = Date.now();
      if (lastReplyUser[senderID] && (now - lastReplyUser[senderID] < USER_COOLDOWN)) {
        return;
      }

      lastReplyUser[senderID] = now;

      const captions = [
        "Mantion_দিস না _সিয়াম বস এর মন মন ভালো নেই আস্কে-!💔🥀",
        "- আমার বস সিয়াম এর সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔",
        "👉আমার বস ♻️ 𝑺𝒊𝒚𝒂𝒎 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো https://www.facebook.com/profile.php?id=61589656899295🔰 ♪√বস ফ্রি হলে আসবে🧡😁😜🐒",
        "বস সিয়াম কে এত মেনশন না দিয়ে باکس আসো হট করে দিবো🤷‍ঝাং 😘🥒",
        "বস সিয়াম কে Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
        "সিয়াম বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
        "সিয়াম বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒 😏",
        "Mantion_না দিয়ে বস সিয়াম এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স https://www.facebook.com/profile.php?id=61589656899295",
        "বস সিয়াম কে মেনশন দিসনা পারলে একটা জি এফ দে",
        "বাল পাকনা Mantion_দিস না বস সিয়াম প্রচুর বিজি আছে 🥵🥀🤐",
        "চুমু খাওয়ার বয়স টা আমার বস সিয়াম চকলেট🍫খেয়ে উড়িয়ে দিল 🤗"
      ];

      const rawCaption = captions[Math.floor(Math.random() * captions.length)];
      const styledCaption = `\n❖═══•༻🌺༺•═══❖\n『 ${rawCaption} 』\n❖═══•༻🌺༺•═══❖\n`;

      // ৫টি ভিডিওর মধ্য থেকে র্যান্ডম সিলেকশন
      const selectedVideo = videoList[Math.floor(Math.random() * videoList.length)];
      const videoPath = path.join(CACHE_DIR, selectedVideo.file);

      if (fs.existsSync(videoPath)) {
        await message.reply({
          body: styledCaption,
          attachment: fs.createReadStream(videoPath)
        });
      } else {
        try {
          const response = await axios({
            method: "GET",
            url: selectedVideo.url,
            responseType: "stream",
            timeout: 30000
          });

          const writer = fs.createWriteStream(videoPath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          await message.reply({
            body: styledCaption,
            attachment: fs.createReadStream(videoPath)
          });
        } catch (err) {
          console.log("Video Send Error:", err.message);
          await message.reply(styledCaption);
        }
      }

    } catch (err) {
      console.log("AdminMention Error:", err);
    }
  }
};
