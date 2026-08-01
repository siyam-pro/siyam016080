const REAL_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function checkAuthorLock(config, api, event) {
  if (config.author !== REAL_AUTHOR) {
    api.sendMessage(
      "⛔ You are not authorized to change the author name. Locked by 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍!",
      event.threadID,
      event.messageID
    );
    return false;
  }
  return true;
}

module.exports = {
  config: {
    name: "cnprefix",
    aliases: ["cnprefix", "setprefix", "prefix"],
    version: "2.5.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
      en: "Change prefix for current group"
    },
    longDescription: {
      en: "Allows only bot admins to change the prefix specifically for the current group"
    },
    guide: {
      en: "{pn} <new_prefix>"
    }
  },

  onStart: async function ({ api, event, args, message, threadsData }) {
    if (!checkAuthorLock(module.exports.config, api, event)) return;

    const { threadID, senderID } = event;

    const adminList = global.GoatBot?.config?.adminBot || global.GoatBot?.config?.ADMINBOT || [];
    const isBotAdmin = Array.isArray(adminList) && adminList.includes(senderID);

    if (!isBotAdmin) {
      const noPermissionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😏 আগে লেবেলে আয় 
» 👑 শুধুমাত্র বট এডমিন..
» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
» ✅ বেবহার করতে পারবেন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noPermissionMsg);
    }

    const newPrefix = args[0];

    if (!newPrefix) {
      const noPrefixMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে নতুন 
» 🤒 প্রিফিক্সটি দিন!
» 💡 উদাহরণ আগের prefix
» ✅ cnprefix !
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noPrefixMsg);
    }

    try {
      await threadsData.set(threadID, newPrefix, "data.prefix");

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ এই গ্রুপের প্রিফিক্স 
» 🎀 পরিবর্তন করা হয়েছে!
» 📌 𝗡𝗲𝘄 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${newPrefix} ]
» 👥 এখন থেকে বট এডমিন সহ 
» 😘 সবাই [ ${newPrefix} ] 
» ☠️ দিয়ে কমান্ড ব্যবহার 
» 😊 করতে পারবেন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(successMsg);
    } catch (err) {
      console.error("cnPrefix Error:", err);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ প্রিফিক্স আপডেট 
» ❎ করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};
