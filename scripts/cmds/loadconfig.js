const fs = require("fs-extra");

module.exports = {
  config: {
    name: "loadconfig",
    aliases: ["loadcf"],
    version: "1.4",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    shortDescription: "Load again config of bot",
    longDescription: "বটের কনফিগারেশন ফাইল রিস্টার্ট ছাড়া পুনরায় লোড করুন",
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      success: "Config đã được load lại thành công"
    },
    en: {
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ বটের কনফিগারেশন 
» 👑 সফলভাবে রিলোড 
» ⏳ করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    }
  },

  onStart: async function ({ message, getLang }) {
    global.GoatBot.config = fs.readJsonSync(global.client.dirConfig);
    global.GoatBot.configCommands = fs.readJsonSync(global.client.dirConfigCommands);
    message.reply(getLang("success"));
  }
};
