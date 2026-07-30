module.exports = {
  config: {
    name: "out",
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    shortDescription: "বটকে গ্রুপ থেকে বের করে দেওয়া",
    longDescription: "এই কমান্ডের মাধ্যমে বটকে বর্তমান বা নির্দিষ্ট গ্রুপ থেকে বের করে দেওয়া হয়।",
    category: "owner",
    guide: {
      en: "{pn} [threadID (optional)]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const botID = api.getCurrentUserID();
    const targetThread = args[0] || event.threadID;

    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
      timeZone: "Asia/Dhaka"
    });

    const time = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const message = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤖  𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓  🤖
» 👋  𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 𝐌𝐄 😘
───────────────
আমি [,] 🤖 𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓 🤖👋 আমাকে ব্যবহার করার জন্য ধন্যবাদ 😘আলবিদা সবাই! আমি এখন গ্রুপ থেকে বের হচ্ছি...😞
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    try {
      await api.sendMessage(message, targetThread);
      await api.removeUserFromGroup(botID, targetThread);
    } catch (error) {
      console.error(error);
      
      const errorMsg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

───────────────
» ❌ বের হতে পারলাম না!
» 🛠️ কোনো সমস্যা হয়েছে।
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(errorMsg, event.threadID);
    }
  },
};
