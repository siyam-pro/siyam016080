module.exports = {
  config: {
    name: "inbox",
    aliases: ["in"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "hello goatbot inbox no prefix file enjoy the cmmand"
    },
    longDescription: {
      en: ""
    },
    category: "fun",
    guide: {
      en: ""
    }
  },
  langs: {
    en: {
      gg: ""
    },
    id: {
      gg: ""
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      const query = encodeURIComponent(args.join(' '));
      message.reply("✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐌𝐒𝐆\n\n🙃জানু তোমার ইনবক্স চেক করো , দেখো প্রপোজ করেছি,🐸🫣", event.threadID);
      api.sendMessage("✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐀𝐋𝐋𝐎𝐖\n😁 জানু  ইনবক্স এ আসতে বললে কেনো ,কি বলবে বলো 🙂", event.senderID);
    } catch (error) {
      console.error("Error bro: " + error);
    }
  }
};
