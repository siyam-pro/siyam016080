const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "11.5",
  role: 0,
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "⏰ ২৪ ঘণ্টায় ২৪টি নির্দিষ্ট ভিডিও ও টেক্সট পাঠাবে (অ্যান্টি-ব্যান ও সেফ লিমিটসহ)",
  category: "AutoTime",
  countDown: 3,
};

const cacheDir = path.join(__dirname, "cache");
const statusFile = path.join(__dirname, "autotimer_status.json");

const startupVideoPath = path.join(cacheDir, "startup_video.mp4");
const startupVideoUrl = "https://files.catbox.moe/3y330y.mp4"; 
const startupMsg = `» 🕌 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔 𝐀𝐋𝐀𝐈𝐊𝐔𝐌
───────────────
» 🎥 এখন থেকে এই গ্রুপে
» ⏰ ভিডিও সহ টাইম
» 📥 প্রতি ১ ঘন্টা পর পর আসবে 
───────────────
» ⚙️ বন্ধ করতে
» ➤ ,autoseen off ❌
───────────────
» 🤖 𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`;

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(statusFile)) {
  fs.writeJsonSync(statusFile, { enabled: true });
}

const timerData = {
  "12:00 AM": { text: "🌌 এখন রাত ১২টা বাজে❥︎নতুন দিন শুরু হলো ✨", url: "https://files.catbox.moe/2ii8c7.mp4" },
  "01:00 AM": { text: "🌙 এখন রাত ১টা বাজে❥︎গভীর রাত, ঘুমাও সবাই 🤫", url: "https://files.catbox.moe/ah0s9r.mp4" },
  "02:00 AM": { text: "🖤 এখন রাত ২টা বাজে❥︎কিছু নীরব স্মৃতি ও একাকীত্ব 🥀", url: "https://files.catbox.moe/ydwkrm.mp4" },
  "03:00 AM": { text: "💤 এখন রাত ৩টা বাজে❥︎মন শুধু তোমাকেই খোঁজে 🥺", url: "https://files.catbox.moe/111n24.mp4" },
  "04:00 AM": { text: "🕌 এখন ভোর ৪টা বাজে❥︎তাহাজ্জুদ/ফজরের প্রস্তুতি নাও 🤲", url: "https://files.catbox.moe/ebyeyi.mp4" },
  "05:00 AM": { text: "🌅 এখন ভোর ৫টা বাজে❥︎শুভ সকাল, ভালো কাটুক দিনটি ☕", url: "https://files.catbox.moe/olpzpk.mp4" },
  "06:00 AM": { text: "🌞 এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই ☕", url: "https://files.catbox.moe/3y330y.mp4" },
  "07:00 AM": { text: "🍞 এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও", url: "https://files.catbox.moe/j4fhyp.mp4" },
  "08:00 AM": { text: "✨ এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে", url: "https://files.catbox.moe/gc2ard.mp4" },
  "09:00 AM": { text: "🕘 এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই", url: "https://files.catbox.moe/44oya3.mp4" },
  "10:00 AM": { text: "☀️ এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি", url: "https://files.catbox.moe/ffvnm1.mp4" },
  "11:00 AM": { text: "😌 এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও", url: "https://files.catbox.moe/c5ja93.mp4" },
  "12:00 PM": { text: "❤️ এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে", url: "https://files.catbox.moe/56bgjp.mp4" },
  "01:00 PM": { text: "🤲 এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/2l5loh.mp4" },
  "02:00 PM": { text: "🍛 এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো", url: "https://files.catbox.moe/0j8bwh.mp4" },
  "03:00 PM": { text: "☀️ এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো", url: "https://files.catbox.moe/4hjg4f.mp4" },
  "04:00 PM": { text: "🥀 এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/l5bfws.mp4" },
  "05:00 PM": { text: "🌆 এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও", url: "https://files.catbox.moe/7nvnsi.mp4" },
  "06:00 PM": { text: "🌇 এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও 😍", url: "https://files.catbox.moe/j7gndp.mp4" },
  "07:00 PM": { text: "🌃 এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো ❤️", url: "https://files.catbox.moe/9tfka4.mp4" },
  "08:00 PM": { text: "🧖 এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো", url: "https://files.catbox.moe/6dyzum.mp4" },
  "09:00 PM": { text: "🌙 এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও 😴", url: "https://files.catbox.moe/hgf9vq.mp4" },
  "10:00 PM": { text: "💤 এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে", url: "https://files.catbox.moe/3e5pct.mp4" },
  "11:00 PM": { text: "🌌 এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো 🥰", url: "https://files.catbox.moe/uak967.mp4" }
};

let lastSentTime = "";

module.exports.onLoad = async function ({ api }) {
  console.log("🔥 AUTOTIMER LOADED");

  if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
    console.error("❌ Author Changed");
    return process.exit(1);
  }

  const handleStartupAnnouncement = async () => {
    console.log("🚀 Startup function running");
    try {
      if (!fs.existsSync(startupVideoPath) || fs.statSync(startupVideoPath).size === 0) {  
        const response = await axios.get(startupVideoUrl, { responseType: "arraybuffer" });  
        fs.writeFileSync(startupVideoPath, Buffer.from(response.data));  
      }  

      const allThreads = await api.getThreadList(20, null, ["INBOX"]);  
      const groups = allThreads.filter(thread => thread.isGroup);  

      console.log("📨 Sending startup message to groups:", groups.length);

      groups.forEach((thread, index) => {
        setTimeout(() => {
          api.sendMessage({  
            body: startupMsg,  
            attachment: fs.createReadStream(startupVideoPath)  
          }, thread.threadID, (err, info) => {
            if (!err && info && info.messageID) {  
              setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000); 
            }  
          });
        }, index * 3000); 
      });

    } catch (err) {  
      console.error("❌ Error sending startup announcement:", err.message);
    }
  };

  setTimeout(handleStartupAnnouncement, 5000);

  const checkTimeAndSend = async () => {
    console.log("⏰ Timer Check:", moment().tz("Asia/Dhaka").format("hh:mm:ss A"));
    try {
      if (!fs.existsSync(statusFile)) return;
      const statusData = fs.readJsonSync(statusFile);
      if (!statusData.enabled) return;

      const currentTime = moment().tz("Asia/Dhaka");  
      const minutes = currentTime.format("mm");  
      const now = currentTime.format("hh:00 A");  

      if (minutes !== "00") return;  
      if (!timerData[now]) return;  

      if (now !== lastSentTime) {  
        lastSentTime = now;  

        const todayDate = currentTime.format("DD-MM-YYYY");  
        const currentHourData = timerData[now];  
        const videoUrl = currentHourData.url;  
          
        const videoName = `video_${now.replace(/:| /g, "_")}.mp4`;  
        const videoPath = path.join(cacheDir, videoName);  

        if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {  
          const response = await axios.get(videoUrl, { responseType: "arraybuffer" });  
          fs.writeFileSync(videoPath, Buffer.from(response.data));  
          console.log("📥 Downloaded:", videoName);  
        }  

        const text = currentHourData.text;  
        const msg = `
╭───────────────⭓
│ ⏰ 𝗔𝗨𝗧𝗢 𝗧𝗜𝗠𝗘 𝗡𝗢𝗧𝗘
├───────────────⭓
│ 🕒 𝗧𝗜𝗠𝗘 : ${now}
│ 📅 𝗗𝗔𝗧𝗘 : ${todayDate}
├───────────────⭓
│ ${text}
├───────────────⭓
│ 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
╰───────────────⭓`;

        const allThreads = await api.getThreadList(20, null, ["INBOX"]);  
        const groups = allThreads.filter(thread => thread.isGroup);  

        console.log("📨 Sending regular message to groups:", groups.length);

        groups.forEach((thread, index) => {
          setTimeout(() => {
            const mentions = thread.participantIDs ? thread.participantIDs.map(uid => ({ tag: "@", id: uid })) : [];  

            api.sendMessage({  
              body: msg,  
              mentions,  
              attachment: fs.createReadStream(videoPath)  
            }, thread.threadID, (err, info) => {  
              if (!err && info && info.messageID) {  
                setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000);  
              }  
            });
          }, index * 3000);
        });

        console.log("✅ Scheduled routine video for:", now);  
      }  
    } catch (err) {  
      console.error("❌ Error in interval:", err.message);  
    }
  };

  setInterval(checkTimeAndSend, 60000);
};

module.exports.onStart = async function ({ api, event, args }) {
  if (!fs.existsSync(statusFile)) {
    fs.writeJsonSync(statusFile, { enabled: true });
  }
  const statusData = fs.readJsonSync(statusFile);

  if (!args[0]) {
    return api.sendMessage(
      "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚙️ 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘\n» ➤ autotimer on  \n» 📽️ চালু করতে ✅\n» ➤ autotimer off \n» 🫶 বন্ধ করতে ❌\n───────────────\n» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      event.threadID,
      event.messageID
    );
  }

  if (args[0].toLowerCase() === "on") {
    if (statusData.enabled) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀索-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 ইতিমধ্যে \n»🌡️𝑶𝑵 আছে 🟢\n» 🔔 অটো ভিডিও এখন\n» 🥱 চালু রয়েছে 📥\n───────────────\n» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        event.threadID,
        event.messageID
      );
    }
    fs.writeJsonSync(statusFile, { enabled: true });
    lastSentTime = ""; 

    return api.sendMessage(
      "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⏰ 👑 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄𝐑 𝐎𝐍 ✅\n» ✡️ এখন থেকে\n» 🫣 অটো ভিডিও যাবে 📥\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      event.threadID,
      event.messageID
    );
  }

  if (args[0].toLowerCase() === "off") {
    if (!statusData.enabled) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🛑 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 \n» 🙄 আগেই 𝑶𝑭𝑭 আছে 📴\n» 🔕 ইতিমধ্যে বন্ধ করা রয়েছে ❎\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        event.threadID,
        event.messageID
      );
    }
    fs.writeJsonSync(statusFile, { enabled: false });

    return api.sendMessage(
      "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📴 𝘼𝙐𝙏𝙊 𝙏𝙄𝙈𝙀𝙍 𝙊𝙁𝙁 ⚙️\n» 🔕 এখন আর অটো\n» 🧚‍♀️ ভিডিও যাবে না 🚫\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      event.threadID,
      event.messageID
    );
  }
};
