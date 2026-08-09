const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "voicefx",
    aliases: ["vfx", "audioeffect"],
    version: "1.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Voice Message Effect Generator",
    longDescription: "Apply cool effects to audio or voice messages.",
    category: "fun",
    guide: "{pn} <1-5> (Reply to any voice message or audio)"
  },

  onStart: async function ({ api, event, args }) {
    // ১. ভয়েস মেসেজ বা অডিওতে রিপ্লাই চেক করা
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎙️ যেকোনো ভয়েস বা 
» 😋 অডিওতে রিপ্লাই দিন!
───────────────
» 🔊 ইফেক্ট অপশনসমূহ:
» 1. Chipmunk বাচ্চা কন্ঠ
» 2. Deep Robot গম্ভীর রোবট
» 3. Fast Speed দ্রুত গতি
» 4. Slow Motion আস্তে গতি
» 5. Reverse Audio উল্টো আওয়াজ
───────────────
» 💡 ব্যবহার: অডিও রিপ্লাই 
» 🤭 করে ১ থেকে ৫ লিখুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const audioAttachment = event.messageReply.attachments.find(att => att.type === "audio");

    if (!audioAttachment) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ রিপ্লাই করা মেসেজে 
» 👿 কোনো ভয়েস/অডিও 
» 🚴 পাওয়া যায়নি!
» 💡 দয়া করে একটি 
» 🙂‍↔️ অডিও ফাইলে রিপ্লাই দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const effectChoice = args[0];
    const validEffects = {
      "1": "chipmunk",
      "2": "robot",
      "3": "fast",
      "4": "slow",
      "5": "reverse"
    };

    if (!effectChoice || !validEffects[effectChoice]) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ১ থেকে ৫ এর 
» 🖥️ মধ্যে একটি নম্বর দিন!
» 1. Chipmunk
» 2. Deep Robot
» 3. Fast Speed
» 4. Slow Motion
» 5. Reverse Audio
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const msg = await api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎙️ ভয়েস ইফেক্ট প্রসেসিং হচ্ছে...
» ⏳ অনুগ্রহ করে অপেক্ষা করুন...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      event.threadID
    );

    try {
      const audioUrl = audioAttachment.url;
      const selectedEffect = validEffects[effectChoice];

      // External Voice Filter API
      const apiUrl = `https://api.popcat.xyz/voiceeffect?effect=${selectedEffect}&url=${encodeURIComponent(audioUrl)}`;

      const cachePath = path.join(__dirname, "../cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

      const audioPath = path.join(cachePath, `vfx_${Date.now()}.mp3`);

      const response = await axios({
        method: "GET",
        url: apiUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ভয়েস পরিবর্তন 
» 🫡 সফল হয়েছে!
» 🎭 Effect: ${selectedEffect.toUpperCase()}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            attachment: fs.createReadStream(audioPath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
          },
          msg.messageID
        );
      });

      writer.on("error", err => {
        console.error("❌ অডিও সেভ করতে প্রবলেম:", err);
        api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অডিও ফাইলটি তৈরি 
» 😜 করতে ব্যর্থ হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          event.threadID,
          msg.messageID
        );
      });

    } catch (err) {
      console.error("❌ ভয়েস ইফেক্ট এরর:", err);
      api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভয়েস পরিবর্তন 
» 🫢 করতে সমস্যা হয়েছে!
» ✍️ সার্ভিস অনলাইন 
» 🎀 আছে কিনা চেক করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        msg.messageID
      );
    }
  }
};
