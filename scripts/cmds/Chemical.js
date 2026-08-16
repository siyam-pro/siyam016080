const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒َان"; // 🔒 locked author

module.exports = {
  config: {
    name: "Chemical",
    aliases: ["bounty", "কেমিনাল", "ধরো"],
    version: "3.0",
    author: AUTHOR,
    role: 0,
    category: "fun",
    guide: "wanted @mention / মেসেজে রিপ্লাই দিয়ে wanted লিখুন",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔒 AUTHOR LOCK SYSTEM
      if (module.exports.config.author !== AUTHOR) {
        return api.sendMessage(
          "⛔ This file is locked!\nAuthor change detected.",
          event.threadID
        );
      }

      const mentions = Object.keys(event.mentions);
      let targetID;

      // ১. ম্যানশন চেক, না থাকলে রিপ্লাই মেসেজ চেক, না থাকলে নিজের আইডি
      if (mentions.length > 0) {
        targetID = mentions[0];
      } else if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else {
        targetID = event.senderID;
      }

      // ২. ফেসবুক সার্ভার থেকে রিয়েল ডিসপ্লে নাম তুলে আনা
      let targetName = "অভিযুক্ত আসামি";
      try {
        const userInfo = await api.getUserInfo(targetID);
        if (userInfo && userInfo[targetID] && userInfo[targetID].name) {
          targetName = userInfo[targetID].name;
        }
      } catch (e) {
        if (mentions.length > 0) {
          targetName = event.mentions[targetID].replace("@", "");
        }
      }

      // ৩. র‍্যান্ডম অপরাধ ও বাউন্টি অ্যামাউন্ট জেনারেট
      const crimes = [
        "রাত ২টায় বিরিয়ানির ছবি দিয়ে বন্ধুদের লোভ দেখানো!",
        "সব মেসেজ দেখেও সিন (Seen) করে রিপ্লাই না দেওয়া!",
        "গ্রুপে এসে আজেবাজে স্টিকার দিয়ে চ্যাট ভাসিয়ে দেওয়া!",
        "অনলাইন প্রেমে মিথ্যা আশ্বাস দিয়ে মন ভাঙা!",
        "প্রচুর পড়াশোনা করে পরীক্ষার আগে 'কিছুই পড়িনি' বলা!"
      ];
      
      const randomCrime = crimes[Math.floor(Math.random() * crimes.length)];
      
      // ৫,০০০,০০০ থেকে ৫০,০০০,০০০ ডলারের বাউন্টি
      const bountyAmount = (Math.floor(Math.random() * 45) + 5) * 1000000;
      const formattedBounty = "$" + bountyAmount.toLocaleString();

      // ৪. প্রোফাইল পিকচার ইউআরএল
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // 🎨 5. CYBERPUNK WANTED POSTER CANVAS (800x1000 HD)
      const width = 800;
      const height = 1000;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // ব্যাকগ্রাউন্ড - ডার্ক সাইবার ব্যাকড্রপ
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);

      // ব্যাকগ্রাউন্ড টেক্সচার
      ctx.strokeStyle = "rgba(255, 0, 85, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // লাল নিওন বর্ডার
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 30;
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 8;
      ctx.strokeRect(25, 25, width - 50, height - 50);

      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#ffe600";
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, width - 70, height - 70);

      // হেডার: WANTED
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#ff0055";
      ctx.font = "bold 90px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("WANTED", width / 2, 130);

      // সাব-হেডার
      ctx.fillStyle = "#ffe600";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("DEAD OR ALIVE • CYBER CRIME DIVISION", width / 2, 170);

      // ডিভাইডার লাইন
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 190);
      ctx.lineTo(width - 70, 190);
      ctx.stroke();

      // ছবি লোড করা
      let userImg;
      try {
        const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        userImg = await loadImage(Buffer.from(res.data));
      } catch (e) {
        userImg = await loadImage("https://i.imgur.com/2dfL88M.png");
      }

      // ছবির বক্স ও গ্লো
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#151520";
      ctx.fillRect(width / 2 - 180, 220, 360, 360);
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 5;
      ctx.strokeRect(width / 2 - 180, 220, 360, 360);

      // ইমেজ আঁকা
      ctx.drawImage(userImg, width / 2 - 170, 230, 340, 340);

      // ছবির ওপর "CRIMINAL" স্ট্যাম্প
      ctx.save();
      ctx.translate(width / 2, 390);
      ctx.rotate(-15 * Math.PI / 180);
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgba(255, 0, 0, 0.85)";
      ctx.fillRect(-160, -35, 320, 70);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(-160, -35, 320, 70);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CRIMINAL", 0, 12);
      ctx.restore();

      // রিয়েল আইডি নাম ও অপরাধের বিবরণ
      ctx.textAlign = "center";

      // অরিজিনাল ফেসবুক নেম
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(targetName, width / 2, 630);

      // অপরাধ
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ff0055";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("CRIME / অপরাধ:", width / 2, 680);

      ctx.fillStyle = "#00f0ff";
      ctx.font = "22px sans-serif";
      ctx.fillText(`"${randomCrime}"`, width / 2, 720);

      // পুরষ্কার (BOUNTY REWARD)
      ctx.fillStyle = "#121520";
      ctx.fillRect(80, 760, width - 160, 120);
      ctx.strokeStyle = "#ffe600";
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 760, width - 160, 120);

      ctx.shadowColor = "#ffe600";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ffe600";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("💰 REWARD BOUNTY 💰", width / 2, 800);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(formattedBounty, width / 2, 855);

      // ফুটার
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ff0055";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("─── 👑 OWNER: SIYAM-HASAN  |  🧚‍♀️ NIJHUM CHATBOT ───", width / 2, 940);

      // ফাইল সেভ ও সেন্ড করা
      const imgPath = path.join(__dirname, "cache", `wanted_${targetID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      const msgText = `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
🚨 𝗪𝗔𝗡𝗧𝗘𝗗 𝗔𝗟𝗘𝗥𝗧 🚨
───────────────
👤 নাম: ${targetName}
📌 অপরাধ: ${randomCrime}
💰 জরিমানা: ${formattedBounty}

⚠️ একে দেখলে দ্রুত 
❎ সিয়াম ভাই কে খবর দিন!
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(
        {
          body: msgText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath)
      );

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ ওয়ান্টেড পোস্টার তৈরি করতে সমস্যা হয়েছে সিয়াম!", event.threadID);
    }
  }
};
