module.exports = {
  config: {
    name: "fbinfo",
    aliases: ["fb", "userinfo"],
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: "Facebook user info",
    longDescription: "Get Facebook user info safely",
    category: "info",
    guide: "{p}fbinfo [@mention | uid | reply]"
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let uid = event.senderID;

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0] && !isNaN(args[0])) {
        uid = args[0];
      }

      const data = await api.getUserInfo(uid);
      const user = data[uid];

      if (!user) {
        const notFoundMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐔𝐬𝐞𝐫 𝐢𝐧𝐟𝐨 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(notFoundMsg);
      }

      const gender =
        user.gender == 1 ? "Female" :
        user.gender == 2 ? "Male" : "Unknown";

      const infoMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👤 𝐍𝐚𝐦𝐞: ${user.name || "Unknown"}
» 🆔 𝐔𝐈𝐃: ${uid}
» 👤 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${user.vanity || "Not set"}
» 🚻 𝐆𝐞𝐧𝐝𝐞𝐫: ${gender}
───────────────
» 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞: https://facebook.com/${uid}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(infoMsg);

    } catch (err) {
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐄𝐫𝐫𝐨𝐫: 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 
» ❌ 𝐟𝐞𝐭𝐜𝐡 𝐮𝐬𝐞𝐫 𝐢𝐧𝐟𝐨!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(errorMsg);
    }
  }
};
