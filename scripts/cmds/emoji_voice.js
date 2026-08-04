const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cooldowns = new Map();

module.exports = {
  config: {
    name: "emoji_voice",
    version: "2.0.2",
    author: "亗 SIYAM HASAN 亗",
    countDown: 5,
    role: 0,
    shortDescription: "Sends a cute girl's voice when an emoji is used 😍",
    longDescription: "One emoji triggers multiple voices, sent randomly 😘",
    category: "system"
  },
  onStart: async function () {},
  onChat: async function ({ event, message }) {
    const { body, senderID } = event;
    if (!body) return;

    const emojiAudioMap = {
      "🥱": ["https://files.catbox.moe/9pou40.mp3","https://files.catbox.moe/60cwcg.mp3"],
      "😁": ["https://files.catbox.moe/60cwcg.mp3"],
      "😌": ["https://files.catbox.moe/epqwbx.mp3"],
      "🥺": ["https://files.catbox.moe/wc17iq.mp3","https://files.catbox.moe/dv9why.mp3"],
      "🤭": ["https://files.catbox.moe/cu0mpy.mp3"],
      "😅": ["https://files.catbox.moe/jl3pzb.mp3"],
      "😏": ["https://files.catbox.moe/z9e52r.mp3"],
      "😞": ["https://files.catbox.moe/tdimtx.mp3"],
      "🤫": ["https://files.catbox.moe/0uii99.mp3"],
      "🍼": ["https://files.catbox.moe/p6ht91.mp3"],
      "🤔": ["https://files.catbox.moe/hy6m6w.mp3"],
      "🥰": ["https://files.catbox.moe/dv9why.mp3"],
      "🤦": ["https://files.catbox.moe/ivlvoq.mp3"],
      "😘": ["https://files.catbox.moe/ma2jlz.mp4","https://files.catbox.moe/37dqpx.mp3"],
      "😑": ["https://files.catbox.moe/p78xfw.mp3"],
      "😢": ["https://files.catbox.moe/shxwj1.mp3"],
      "🙊": ["https://files.catbox.moe/3bejxv.mp3"],
      "🤨": ["https://files.catbox.moe/4aci0r.mp3"],
      "😡": ["https://files.catbox.moe/shxwj1.mp3","https://files.catbox.moe/h9ekli.mp3"],
      "🤬": ["https://files.catbox.moe/shxwj1.mp3","https://files.catbox.moe/h9ekli.mp3"],
      "🙈": ["https://files.catbox.moe/3qc90y.mp3"],
      "😍": ["https://files.catbox.moe/qjfk1b.mp3"],
      "😭": ["https://files.catbox.moe/itm4g0.mp3"],
      "😱": ["https://files.catbox.moe/mu0kka.mp3"],
      "😻": ["https://files.catbox.moe/y8ul2j.mp3"],
      "😿": ["https://files.catbox.moe/tqxemm.mp3"],
      "💔": ["https://files.catbox.moe/6yanv3.mp3"],
      "🤣": ["https://files.catbox.moe/2sweut.mp3","https://files.catbox.moe/jl3pzb.mp3"],
      "🥹": ["https://files.catbox.moe/jf85xe.mp3"],
      "বট": ["https://files.catbox.moe/3u6shs.mp3"],
      "🫣": ["https://files.catbox.moe/ttb6hi.mp3"],
      "🐸": ["https://files.catbox.moe/utl83s.mp3","https://files.catbox.moe/sg6ugl.mp3"],
      "💋": ["https://files.catbox.moe/37dqpx.mp3"],
      "🫦": ["https://files.catbox.moe/61w3i0.mp3"],
      "😴": ["https://files.catbox.moe/rm5ozj.mp3"],
      "🙏": ["https://files.catbox.moe/7avi7u.mp3"],
      "😼": ["https://files.catbox.moe/4oz916.mp3"],
      "🖕": ["https://files.catbox.moe/593u3j.mp3","https://files.catbox.moe/dtua60.mp3"],
      "🥵": ["https://files.catbox.moe/l90704.mp3"],
      "🙂": ["https://files.catbox.moe/4oks08.mp3"],
      "😒": ["https://files.catbox.moe/mt5il0.mp3"],
      "😓": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🤧": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🙄": ["https://files.catbox.moe/vgzkeu.mp3"],
      "good night": ["https://files.catbox.moe/i29m4q.mp3"],
      "গুড নাইট": ["https://files.catbox.moe/i29m4q.mp3"],
      "good morning": ["https://files.catbox.moe/8gzqx5.mp3"],
      "গুড মর্নিং": ["https://files.catbox.moe/8gzqx5.mp3"],
      "siyam": ["https://files.catbox.moe/9w6moo.mp3"],
      "সিয়াম ভাই": ["https://files.catbox.moe/9w6moo.mp3"],
      "সিয়াম": ["https://files.catbox.moe/9w6moo.mp3"],
      "সিয়া.ম": ["https://files.catbox.moe/9w6moo.mp3"],
      "@ট্ঁপ্ঁ গা্ঁলি্ঁ বা্ঁজ্ঁ হৃ্ঁদ্ঁয়্ঁ": ["https://files.catbox.moe/lkysl2.mp4"],
      "@everyone": ["https://files.catbox.moe/stcply.mp3"],
      "নিঝুম": ["https://files.catbox.moe/3u6shs.mp3"],
      "👍": ["https://files.catbox.moe/ahux2o.mp4"]
    };

    const triggerKey = body.trim().toLowerCase();
    let audioList = emojiAudioMap[body.trim()];

    if (!audioList) {
      const foundKey = Object.keys(emojiAudioMap).find(k => k.toLowerCase() === triggerKey);
      if (foundKey) {
        audioList = emojiAudioMap[foundKey];
      }
    }

    if (!audioList) return;

    const cooldownKey = `${senderID}_${triggerKey}`;
    const now = Date.now();
    const cooldownTime = 3 * 60 * 1000;

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey);
      if (now < expirationTime) {
        return;
      }
    }

    cooldowns.set(cooldownKey, now + cooldownTime);

    const audioUrl = audioList[Math.floor(Math.random() * audioList.length)];
    const cacheDir = path.join(__dirname, "cache");

    fs.ensureDirSync(cacheDir);

    const ext = audioUrl.endsWith(".mp4") ? "mp4" : "mp3";
    const filePath = path.join(
      cacheDir,
      `${encodeURIComponent(triggerKey)}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`
    );

    try {
      const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      await message.reply({ attachment: fs.createReadStream(filePath) });
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete cache file:", err);
      });
    } catch (error) {
      console.error(error);
      message.reply("\n");
    }
  }
};
