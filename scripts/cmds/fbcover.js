const axios = require("axios");

module.exports = {
  config: {
    name: "fbcover",
    aliases: [],
    version: "6.9",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Facebook cover generate",
    longDescription: "Generate Facebook cover using API",
    category: "AI",
    guide: {
      en: "{pn} v1/v2/v3 - name - title - address - email - phone - color"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const baseApiUrl = async () => {
      const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
      );
      return base.data.api;
    };

    const input = args.join(" ");
    let uid;

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else {
      uid = Object.keys(event.mentions || {})[0] || event.senderID;
    }

    const userName = await usersData.getName(uid);

    if (!input) {
      const wrongFormat = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
❌ 𝐖𝐫𝐨𝐧𝐠 𝐅𝐨𝐫𝐦𝐚𝐭!
💡 𝐓𝐫𝐲: fbcover v1 - name - title - address - email - phone - color
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(
        wrongFormat,
        event.threadID,
        event.messageID
      );
    }

    const msg = input.split("-");
    const v = msg[0]?.trim() || "v1";
    const name = msg[1]?.trim() || " ";
    const subname = msg[2]?.trim() || " ";
    const address = msg[3]?.trim() || " ";
    const email = msg[4]?.trim() || " ";
    const phone = msg[5]?.trim() || " ";
    const color = msg[6]?.trim() || "white";

    const waitMsgText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛠️ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐜𝐨𝐯𝐞𝐫...
» ⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    api.sendMessage(
      waitMsgText,
      event.threadID,
      (err, info) => setTimeout(() => api.unsendMessage(info.messageID), 4000)
    );

    const img = `${await baseApiUrl()}/cover/${v}?name=${encodeURIComponent(
      name
    )}&subname=${encodeURIComponent(subname)}&number=${encodeURIComponent(
      phone
    )}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(
      email
    )}&colour=${encodeURIComponent(color)}&uid=${uid}`;

    try {
      const response = await axios.get(img, { responseType: "stream" });

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔵 𝐅𝐈𝐑𝐒𝐓 𝐍𝐀𝐌𝐄: ${name}
» ⚫ 𝐒𝐄𝐂𝐎𝐍𝐃 𝐍𝐀𝐌𝐄: ${subname}
» ⚪ 𝐀𝐃𝐃𝐑𝐄𝐒𝐒: ${address}
» 📫 𝐌𝐀𝐈𝐋: ${email}
» ☎️ 𝐏𝐇𝐎𝐍𝐄 𝐍𝐎: ${phone}
» 🎨 𝐂𝐎𝐋𝐎𝐑: ${color}
───────────────
» 👤 𝐔𝐒𝐄𝐑 𝐍𝐀𝐌𝐄: ${userName}
» 📌 𝐕𝐄𝐑𝐒𝐈𝐎𝐍: ${v}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(
        {
          body: successMsg,
          attachment: response.data
        },
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.error(error);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞
» ⚠️ 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐅𝐁 𝐜𝐨𝐯𝐞𝐫.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(
        errorMsg,
        event.threadID
      );
    }
  }
};
