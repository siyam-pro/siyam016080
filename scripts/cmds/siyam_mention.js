const fs = require("fs-extra");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "siyam_mention",
    version: "7.0.0",
    author: AUTHOR_LOCK,
    countDown: 0,
    role: 0,
    shortDescription: "Admin mention reply styled",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {

    if (this.config.author !== AUTHOR_LOCK) {
      console.log("⚠️ Author changed! Module stopped.");
      return;
    }

    const admins = [
      {
        uid: "61568411310748",
        names: ["@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ"]
      },
      {
        uid: "61584641872032",
        names: ["@ট্ঁপ্ঁ গা্ঁলি্ঁ বা্ঁজ্ঁ হৃ্ঁদ্ঁয়্ঁ"]
      }
    ];

    const senderID = String(event.senderID);

    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase().trim();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      text.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    const captions = [
      "বস সিয়াম কে এত মেনশন দিস না — নাইলে বস এক চাটানিতে শেষ কইরা দিবো তোরে 😏💋🔨",
      "- আমার বস সিয়াম এর সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔",
      "👉আমার বস ♻️ 亗𝐃𝐒 乂𝐒𝐈𝐘𝐀𝐌亗 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো 🪶 ♪√বস ফ্রি হলে আসবে🧡😁😜🐒https://facebook.com/61568411310748",
      "বস সিয়াম কে এত মেনশন না দিয়ে বক্স আসো হট করে দিবো🤷‍ঝাং 😘🥒",
      "বস সিয়াম কে Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
      "সিয়াম বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
      "সিয়াম বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒 😏",
      "Mantion_না দিয়ে বস সিয়াম এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স 🪶https://facebook.com/61568411310748",
      "বস সিয়াম কে মেনশন দিসনা পারলে একটা জি এফ দে",
      "বাল পাকনা Mantion_দিস না বস সিয়াম প্রচুর বিজি আছে 🥵🥀🤐",
      "চুমু খাওয়ার বয়স টা আমার বস সিয়াম মাদিহা কে🍫খেয়ে উড়িয়ে দিল 🤗"
    ];

    const formatCaption = (captionText) => {
      return `•──────•°•❀•°•───────•
- ${text}
•──────•°•❀•°•───────•
[ ʙᴏᴛ ᴏᴡɴᴇʀ : ꜱɪʏᴀᴍ ʜᴀꜱᴀɴ ]
•──────•°•❀•°•───────•`;
    };

    const rawCaption = captions[Math.floor(Math.random() * captions.length)];
    const styledCaption = formatCaption(rawCaption);

    try {
      await message.reply({
        body: styledCaption
      });
    } catch (err) {
      console.log("Error sending admin reply:", err);
    }
  }
};
