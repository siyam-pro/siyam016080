module.exports = {
  config: {
    name: "emoji",
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    role: 0,
    shortDescription: "Change group emoji 😘",
    longDescription: "Messenger গ্রুপের ইমোজি (Quick Reaction) পরিবর্তন করো মাত্র এক কমান্ডে!",
    category: "box chat",
    guide: "{pn} 😘"
  },

  onStart: async function ({ api, event, args }) {
    const emoji = args.join(" ");

    // ⚠️ যদি কোনো ইমোজি না দেয়
    if (!emoji) {
      const noEmojiMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ দয়া করে একটি
» 🎯 ইমোজি দিন!
» 📝 উদাহরণ: emoji 😘
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noEmojiMsg, event.threadID, event.messageID);
    }

    try {
      // ✅ গ্রুপ ইমোজি পরিবর্তন
      await api.changeThreadEmoji(emoji, event.threadID);
      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ গ্রুপ ইমোজি সফলভাবে
» 🎯 পরিবর্তন হয়েছে ${emoji} এ!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(successMsg, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ইমোজি পরিবর্তনে
» ❌ সমস্যা হয়েছে!
» 🔄 আবার চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
