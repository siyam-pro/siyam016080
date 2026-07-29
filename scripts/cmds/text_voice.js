const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const _x1 = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const _x2 = "SIYAM_HASAN";

const __lock = (() => {
  const a = ["𝆠", "፝", "𝐒", "𝐈", "𝐘", "𝐀", "𝐌"];
  return a.join("");
})();

global.SiyamVoiceStatus = false;

const cacheDir = path.join(__dirname, "cache", "voices");
const rotationFile = path.join(__dirname, "cache", "salam_rotation.json");

setInterval(() => {
  try {
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      let totalSize = 0;
      const fileStats = files.map(file => {
        const filePath = path.join(cacheDir, file);
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
        return { path: filePath, mtime: stat.mtimeMs };
      });

      if (totalSize > 50 * 1024 * 1024) {
        fileStats.sort((a, b) => a.mtime - b.mtime);
        while (totalSize > 30 * 1024 * 1024 && fileStats.length > 0) {
          const oldest = fileStats.shift();
          try {
            const size = fs.statSync(oldest.path).size;
            fs.unlinkSync(oldest.path);
            totalSize -= size;
          } catch(e) {}
        }
      }
    }
  } catch (err) {}
}, 60 * 60 * 1000);

module.exports = {
  config: {
    name: "text_voice",
    version: "4.0.0",
    author: _x2,
    countDown: 1,
    role: 0,
    shortDescription: "Voice system",
    longDescription: "Voice system",
    category: "system"
  },

  _s() {
    if (!_x1.includes(__lock)) {  
      throw new Error("SYSTEM LOCKED");  
    }  
    if (module.exports.config.author !== _x2) {  
      throw new Error("AUTHOR CHANGE DETECTED");  
    }  
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    this._s();  
    if (!event.body) return;  

    const botID = String(global.GoatBot?.config?.botID || (typeof api !== 'undefined' ? api.getCurrentUserID() : "")); 
    const senderID = String(event.senderID);
    if (senderID === botID || senderID === "0") return;

    const admins = (global.GoatBot?.config?.adminBot || []).map(id => String(id));
    const isAdmin = admins.includes(senderID);

    if (!isAdmin) return;

    const input = event.body.toLowerCase().replace(/\s+/g, " ").trim();  

    if (input === "voice on") {
      global.SiyamVoiceStatus = true;
      return message.reply("Voice system activated successfully.");
    }

    if (input === "voice off") {
      global.SiyamVoiceStatus = false;
      return message.reply("Voice system deactivated.");
    }

    if (!global.SiyamVoiceStatus) return;

    const badWordsMap = {
      "ভুদা": "https://files.catbox.moe/gnyx0p.mp3",  
      "আসো হাত মারি": "https://files.catbox.moe/8ioph1.mp3",  
      "🖕": "https://files.catbox.moe/n4kdj7.mp3"
    };

    const exactMatchMap = {  
      "good night": "https://files.catbox.moe/i29m4q.mp3",  
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",  
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",  
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",  
      "siyam": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম ভাই": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম": "https://files.catbox.moe/9w6moo.mp3",  
      "@তা্ঁনি্ঁশা্ঁর্ঁ' জা্ঁমা্ঁই্ঁ' সি্ঁয়া্ঁম্ঁ": "https://files.catbox.moe/lkysl2.mp4",  
      "@everyone": "https://files.catbox.moe/stcply.mp3",  
      "নিঝুম": "https://files.catbox.moe/3u6shs.mp3",  
      ",sex": "https://files.catbox.moe/uy7mrv.mp3",  
      ",hot": "https://files.catbox.moe/m5djca.mp3",  
      "s+n": "https://files.catbox.moe/841gpc.mp4",  
      "টুকি": "https://files.catbox.moe/e8ebel.mp3",  
      "@RJ siyam": "https://files.catbox.moe/9w6moo.mp3",  
      "নুনু": "https://files.catbox.moe/r5uz42.mp3",  
      "👍": "https://files.catbox.moe/ahux2o.mp4",  
      "✡️": "https://files.catbox.moe/5rdtc6.mp3",  
      "মিম তুমারে চুদি": "https://files.catbox.moe/plex4g.mp4",  
      "কপি বট": "https://files.catbox.moe/4vmyke.mp4"
    };  

    const multiVoiceMap = {
      "bot": "https://files.catbox.moe/gzq54t.mp3",
      "জান": "https://files.catbox.moe/78r669.mp4",
      "baby": "https://files.catbox.moe/gzq54t.mp3",
      "bby": "https://files.catbox.moe/x8ina4.mp3",
      "বেবি": "https://files.catbox.moe/3u6shs.mp3"
    };  

    if (input === "voicehelp") {  
      const badWordsList = Object.keys(badWordsMap);
      const exactMatchList = Object.keys(exactMatchMap);
      const multiVoiceList = Object.keys(multiVoiceMap);
      const totalVoices = badWordsList.length + exactMatchList.length + multiVoiceList.length + 6;

      let serial = 1;
      let msg = `🛡️ ［ 𝗩𝗢𝗜𝗖𝗘 𝗛𝗘𝗟𝗣 🛡️\n\n🔋────🛡️────🪫\n\n`;
      
      msg += `┌── 🚫 [ GALI / INCLUDES ]\n`;
      badWordsList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
      msg += `├── ${serial++}. Smart Filter\n`;
      msg += `├── ${serial++}. bishwas\n`;
      msg += `├── ${serial++}. bye\n`;
      msg += `├── ${serial++}. গোলাপ / হাই\n`;

      msg += `├── 🎵 [ EXACT MATCH ]\n`;
      exactMatchList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
      msg += `├── ${serial++}. assalamualaikum\n`;
      msg += `├── ${serial++}. Haha Filter\n`;

      msg += `├── 💖 [ MULTI-VOICE ]\n`;
      multiVoiceList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
      
      msg += `└──────────────🐲\n`;
      msg += `🤖 𝗕𝗢𝗧: 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧\n`;
      msg += `👑 𝗢𝗪𝗡𝗘𝗥: 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡\n`;
      msg += `📊 𝗧𝗢𝗧𝗔𝗟 𝗩𝗢𝗜𝗖𝗘𝗦: ${totalVoices}\n\n`;
      msg += `📱 Contact: +8801789138157`;

      return message.reply(msg);  
    }  

    let targetAudioUrl = null;
    let matchedTrigger = null;

    const targetAbuseRegex = /(চুদি|চৌদি|চুদা|চোদ|খানকি|মাগির পোলা|মাদারচোদ|chudi|choda|khanki)/i;
    
    if (targetAbuseRegex.test(input)) {
        targetAudioUrl = "https://files.catbox.moe/0ykb7f.mp3";
        matchedTrigger = "chudi_global_filter";
    }

    if (!targetAudioUrl && (input.includes("বিশ্বাস") || input.includes("bishwas"))) {
      targetAudioUrl = "https://files.catbox.moe/5ymyo5.mp4";
      matchedTrigger = "bishwas_global_filter";
    }

    if (!targetAudioUrl && (input.includes("বাই") || input.includes("bye"))) {
      targetAudioUrl = "https://files.catbox.moe/fdqh2m.mp3";
      matchedTrigger = "bye_global_filter";
    }

    if (!targetAudioUrl && (input === "গোলাপ" || input === "হাই")) {
      targetAudioUrl = "https://files.catbox.moe/bo0o5e.mp3";
      matchedTrigger = "hi_golap_exact_filter";
    }

    if (!targetAudioUrl && (input.includes("আসসালামু আলাইকুম") || input.includes("assalamualaikum"))) {
      const salamLinks = [
        "https://files.catbox.moe/tx1keh.mp4",
        "https://files.catbox.moe/crjins.mp4"
      ];
      let index = 0;
      try {
        if (fs.existsSync(rotationFile)) {
          const rData = fs.readJsonSync(rotationFile);
          index = rData.index || 0;
        }
      } catch(e) {}
      
      targetAudioUrl = salamLinks[index];
      matchedTrigger = `salam_rotation_${index}`;
      
      try {
        fs.ensureDirSync(path.dirname(rotationFile));
        fs.writeJsonSync(rotationFile, { index: (index + 1) % salamLinks.length });
      } catch(e) {}
    }

    if (!targetAudioUrl && (input.includes("haha") || /😹|😸|🧛|🧟/.test(input))) {
      targetAudioUrl = "https://files.catbox.moe/5jsh3v.mp4";
      matchedTrigger = "haha_emoji_filter";
    }

    if (!targetAudioUrl) {
      for (const key in badWordsMap) {
        if (input.includes(key)) {
          targetAudioUrl = badWordsMap[key];
          matchedTrigger = key;
          break;
        }
      }
    }

    if (!targetAudioUrl && exactMatchMap[input]) {
      targetAudioUrl = exactMatchMap[input];
      matchedTrigger = input;
    }

    if (!targetAudioUrl && multiVoiceMap[input]) {
      targetAudioUrl = multiVoiceMap[input];
      matchedTrigger = input;
    }

    if (targetAudioUrl) {
      fs.ensureDirSync(cacheDir);  
      
      const ext = ".mp3";  
      const safeFileName = Buffer.from(matchedTrigger).toString("hex") + ext;  
      const filePath = path.join(cacheDir, safeFileName);  

      try {  
        if (fs.existsSync(filePath)) {  
          return await message.reply({  
            attachment: fs.createReadStream(filePath)  
          });  
        }  

        let response = null;
        let retries = 2;

        while (retries > 0) {
          try {
            response = await axios.get(targetAudioUrl, {  
              responseType: "arraybuffer",
              timeout: 5000 
            });
            if (response && response.data && response.data.byteLength > 100) break; 
          } catch (downloadErr) {
            retries--;
            if (retries === 0) throw downloadErr;
          }
        }

        if (!response || !response.data) throw new Error("Invalid stream payload");

        fs.writeFileSync(filePath, Buffer.from(response.data));

        await message.reply({  
          attachment: fs.createReadStream(filePath)  
        });  

      } catch (e) {  
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch(err) {}
        }
      }  
    }  
  }
};
