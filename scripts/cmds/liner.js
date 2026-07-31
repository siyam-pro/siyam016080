const axios = require('axios');

async function liner(api, event, args, message) {
  try {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      const noPromptMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💡 প্রম্পট বা প্রশ্ন তো লেখো ভাই!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(noPromptMsg);
    }

    const response = await getLinerResponse(prompt);

    if (response && response.answer) {
      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🤖  ${response.answer}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      message.reply(successMsg, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      const noResponseMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📵 লাইনার এআই থেকে 
» 🤔 কোনো উত্তর পাওয়া যায়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      message.reply(noResponseMsg);
    }
  } catch (error) {
    console.error("Error:", error);
    const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ উত্তর তৈরি করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
    message.reply(errorMsg);
  }
}

async function getLinerResponse(prompt) {
  try {
    const url = `https://liner-ai.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error from Liner API:", error.message);
    throw error;
  }
}

module.exports = {
  config: {
    name: "liner",
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    longDescription: "Liner AI assistant.",
    category: "ai",
    guide: {
      en: "{p}liner [prompt]"
    }
  },

  handleCommand: liner,
  onStart: function ({ api, message, event, args }) {
    return liner(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return liner(api, event, args, message);
  }
};
