const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "vs",
    aliases: ["st", "tool"],
    version: "1.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 3,
    role: 0,
    shortDescription: "All in one Smart Utility Tool",
    longDescription: "Generate QR codes, Text to Speech voice, Web Screenshots and Short Links easily.",
    category: "utility",
    guide: "{pn} qr <text/url> | {pn} tts <text> | {pn} ss <url> | {pn} short <url>"
  },

  onStart: async function ({ api, event, args }) {
    const subCommand = args[0]?.toLowerCase();
    const input = args.slice(1).join(" ");

    if (!subCommand || !input) {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛠️ স্মার্ট টুলস মেনু:
───────────────
» 1. vs qr text/link কিউআর কোড তৈরি
» 2. vs tts text ভয়েস ভয়েস স্পিচ
» 3. vs ss website_url ওয়েবসাইট স্ক্রিনশট
» 4. vs short url লিংক ছোট করা
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }

    const cachePath = path.join(__dirname, "../cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    // ================= 1. QR CODE GENERATOR =================
    if (subCommand === "qr") {
      const msg = await api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ QR Code 
» 😋 তৈরি করা হচ্ছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID
      );

      try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(input)}`;
        const filePath = path.join(cachePath, `qr_${Date.now()}.png`);

        const res = await axios.get(qrUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        res.data.pipe(writer);

        writer.on("finish", () => {
          api.sendMessage(
            {
              body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ আপনার QRCode 
» 🖥️ তৈরি সম্পন্ন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); },
            msg.messageID
          );
        });
      } catch (e) {
        return api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ QR কোড তৈরি করতে সমস্যা হয়েছে!`, event.threadID, msg.messageID);
      }
    }

    // ================= 2. TEXT TO SPEECH (TTS) =================
    else if (subCommand === "tts") {
      const msg = await api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ ভয়েস জেনারেট হচ্ছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID
      );

      try {
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(input)}&tl=bn&client=tw-ob`;
        const filePath = path.join(cachePath, `tts_${Date.now()}.mp3`);

        const res = await axios.get(ttsUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        res.data.pipe(writer);

        writer.on("finish", () => {
          api.sendMessage(
            {
              body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ভয়েস মেসেজ 
» 👿 তৈরি সম্পূর্ণ!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); },
            msg.messageID
          );
        });
      } catch (e) {
        return api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ ভয়েস জেনারেট করতে ব্যর্থ হয়েছে!`, event.threadID, msg.messageID);
      }
    }

    // ================= 3. WEBSITE SCREENSHOT =================
    else if (subCommand === "ss") {
      const msg = await api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ ওয়েবসাইটের স্ক্রিনশট 
» 🎀 নেওয়া হচ্ছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID
      );

      try {
        let url = input.startsWith("http") ? input : `https://${input}`;
        const ssUrl = `https://image.thum.io/get/width/1200/crop/800/${url}`;
        const filePath = path.join(cachePath, `ss_${Date.now()}.png`);

        const res = await axios.get(ssUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        res.data.pipe(writer);

        writer.on("finish", () => {
          api.sendMessage(
            {
              body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ওয়েবসাইট স্ক্রিনশট 
» 🥳 ক্যাপচারড!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); },
            msg.messageID
          );
        });
      } catch (e) {
        return api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ স্ক্রিনশট নিতে ব্যর্থ হয়েছে! সঠিক URL দিন।`, event.threadID, msg.messageID);
      }
    }

    // ================= 4. URL SHORTENER =================
    else if (subCommand === "short") {
      try {
        let targetUrl = input.startsWith("http") ? input : `https://${input}`;
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`);

        return api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ লিংক সফলভাবে 
» 💌 ছোট করা হয়েছে!
» 🔗 Short URL: ${res.data}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          event.threadID,
          event.messageID
        );
      } catch (e) {
        return api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ লিংক ছোট করতে ব্যর্থ হয়েছে!`, event.threadID, event.messageID);
      }
    }

    else {
      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ সাব-কমান্ড ভুল দিয়েছেন!
» 💡 ব্যবহার করুন: qr, tts, 
» 🤭 ss, অথবা short
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        event.threadID,
        event.messageID
      );
    }
  }
};
