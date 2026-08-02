const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ['boxinfo'],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "See Box info",
    longDescription: "গ্রুপের যাবতীয় তথ্য দেখার জন্য",
    category: "box chat",
    guide: {
      en: "{p}groupinfo",
    }
  },

  onStart: async function ({ api, event }) {
    try {
      let threadInfo = await api.getThreadInfo(event.threadID);
      let threadMem = threadInfo.participantIDs.length;
      
      var gendernam = [];
      var gendernu = [];
      var nope = [];

      for (let z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender;
        var nName = threadInfo.userInfo[z].name;
        if (gioitinhone == "MALE") { gendernam.push(z); }
        else if (gioitinhone == "FEMALE") { gendernu.push(z); }
        else { nope.push(nName); }
      }

      var nam = gendernam.length;
      var nu = gendernu.length;
      var listad = '';
      var qtv2 = threadInfo.adminIDs;
      let qtv = qtv2.length;
      let sl = threadInfo.messageCount;
      let icon = threadInfo.emoji || "👍";
      let threadName = threadInfo.threadName || "No Name";
      let id = threadInfo.threadID;

      for (let i = 0; i < qtv2.length; i++) {
        const infu = await api.getUserInfo(qtv2[i].id);
        const name = infu[qtv2[i].id].name;
        listad += '» 👤 ' + name + '\n';
      }

      let sex = threadInfo.approvalMode;
      var pd = sex == false ? 'Turned off' : 'Turned on';

      const infoMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏷️ গ্রুপের নাম:
» 📛 ${threadName}
» 🆔 গ্রুপ আইডি:
» 🔢 ${id}
» 🔰 অনুমোদন মোড:
» ⚙️ ${pd}
» 🎭 গ্রুপ ইমোজি:
» 🎯 ${icon}
» 👥 মোট মেম্বার:
» 📊 ${threadMem} জন
» 👨  ছেলে মেম্বার:
» 👦 ${nam} জন
» 👩 মেয়ে মেম্বার:
» 👧 ${nu} জন
» 👑 মোট এডমিন:
» 🛡️ ${qtv} জন
───────────────
» 👑 এডমিনদের তালিকা:
${listad.trim()}
───────────────
» 💬 মোট মেসেজ:
» ✉️ ${sl} টি
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      var callback = () => api.sendMessage({
        body: infoMsg,
        attachment: fs.createReadStream(__dirname + '/cache/thread.png')
      }, event.threadID, () => {
        if (fs.existsSync(__dirname + '/cache/thread.png')) fs.unlinkSync(__dirname + '/cache/thread.png');
      }, event.messageID);

      // যদি গ্রুপের কোনো ছবি না থাকে তবে শুধু টেক্সট পাঠাবে
      if (!threadInfo.imageSrc) {
        return api.sendMessage(infoMsg, event.threadID, event.messageID);
      }

      return request(encodeURI(`${threadInfo.imageSrc}`))
        .pipe(fs.createWriteStream(__dirname + '/cache/thread.png'))
        .on('close', () => callback());

    } catch (error) {
      console.error(error);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ তথ্য সংগ্রহ করতে
» ❌ সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
