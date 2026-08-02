module.exports = {
  config: {
    name: "groupname",
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    role: 1, // শুধু গ্রুপ অ্যাডমিন বা বট অ্যাডমিন (চাইলে 0 করো)
    shortDescription: "Change group name",
    longDescription: "তুমি যেই নাম দেবে সেটাই গ্রুপের নতুন নাম হবে।",
    category: "box",
    guide: "{pn} [new name]"
  },

  onStart: async function ({ api, event, args }) {
    const name = args.join(" ");

    if (!name) {
      const noNameMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ দয়া করে নতুন 
» ☠️ গ্রুপ নাম লিখো!
» 📝 উদাহরণঃ groupname
» 💀 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noNameMsg, event.threadID, event.messageID);
    }

    try {
      await api.setTitle(name, event.threadID);
      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅  নাম পরিবর্তন হয়েছে:
» ➡️ ${name}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(successMsg, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ নাম পরিবর্তন করা যায়নি!
» 🔒 আগে বট কে এডমিন দাও
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
