const fs = require("fs-extra");
const path = require("path");

const USER_COOLDOWN = 3 * 60 * 1000;
const lastReplyUser = {};

const _0x5a1b = ['U0lZQU0tSEFTQU4=', 'from'];
const getAuthor = () => Buffer[_0x5a1b[1]](_0x5a1b[0], 'base64').toString('utf-8');

module.exports = {
  config: {
    name: "mantion2",
    version: "14.0",
    author: getAuthor(),
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
            "@Rj Sabbir",
            "সাব্বির",
            "রাইয়ান",
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

      if (
        lastReplyUser[senderID] &&
        now - lastReplyUser[senderID] < USER_COOLDOWN
      ) {
        return;
      }

      lastReplyUser[senderID] = now;

      const captions = [
        "Mantion_দিস না _বস রাইহান এর মন মন ভালো নেই আস্কে-!💔🥀",
        "- আমার বস রাইহান এর সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔",
        "👉আমার বস ♻️ 𝑹𝒂𝒊𝒉𝒂𝒏 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো https://www.facebook.com/profile.php?id=61589656899295🔰 ♪√বস ফ্রি হলে আসবে🧡😁😜🐒",
        "বস রাইহান কে এত মেনশন না দিয়ে باکس আসো হট করে দিবো🤷‍ঝাং 😘🥒",
        "বস রাইহান কে Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
        "বস রাইহান এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
        "বস রাইহান কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒 😏",
        "Mantion_না দিয়ে বস রাইহান এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স https://www.facebook.com/profile.php?id=61589656899295",
        "বস রাইহান কে মেনশন দিসনা পারলে একটা জি এফ দে",
        "বাল পাকনা Mantion_দিস না বস রাইহান প্রচুর বিজি আছে 🥵🥀🤐",
        "চুমু খাওয়ার বয়স টা আমার বস রাইহান চকলেট🍫খেয়ে উড়িয়ে দিল 🤗"
      ];

      const rawCaption =
        captions[Math.floor(Math.random() * captions.length)];

      const styledCaption = `\n❖═══•༻🌺༺•═══❖
『 ${rawCaption} 』
❖═══•༻🌺༺•═══❖\n`;

      // শুধু টেক্সট রিপ্লাই
      await message.reply(styledCaption);

    } catch (err) {
      console.log("AdminMention Error:", err);
    }
  }
};
