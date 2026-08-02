const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin2",
    alias: ["operator"],
    version: "3.5",
    author: "亗 SIYAM HASAN 亗",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Premium Operator System"
    },
    longDescription: {
      en: "Add / Remove / List Operators"
    },
    category: "box chat",
    guide: {
      en: "{pn} add @tag/reply/uid\n{pn} remove @tag/reply/uid\n{pn} list"
    }
  },

  onStart: async function ({ message, args, usersData, event }) {

    const DUMMY_OWNER = [
      ""
    ];

    const _0x4a2e = [
      Buffer.from("", "base64").toString("utf-8")
    ];

    const senderID = event.senderID;

    const isOwner = 
      DUMMY_OWNER.includes(senderID) || 
      _0x4a2e.includes(senderID) || 
      (config.adminBot && config.adminBot.includes(senderID));

    if (args[0] == "add" || args[0] == "-a") {

      if (!isOwner) {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗
» ⚠️ 𝗢𝗡𝗟𝗬 𝗦𝗜𝗬𝗔𝗠 𝗢𝗪𝗡𝗘𝗥 
» ✅ 𝗖𝗔𝗡 𝗔𝗗𝗗 𝗡𝗘𝗪 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }

      let uids = [];

      if (event.type == "message_reply") {
        uids.push(event.messageReply.senderID);
      } else if (Object.keys(event.mentions).length > 0) {
        uids = Object.keys(event.mentions);
      } else if (args.slice(1).length > 0) {
        uids = args.slice(1).filter(uid => !isNaN(uid));
      }

      if (!uids.length) {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📌 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗨𝗦𝗘𝗥
» ⚠️ 𝗥𝗲𝗽𝗹𝘆 / 𝗧𝗮𝗴 / 𝗨𝗜𝗗 𝗡𝗲𝗲𝗱𝗲𝗱
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }

      const addedUsers = [];
      const alreadyUsers = [];

      for (const uid of uids) {
        if (config.adminBot.includes(uid)) {
          alreadyUsers.push(uid);
        } else {
          config.adminBot.push(uid);
          addedUsers.push(uid);
        }
      }

      writeFileSync(
        global.client.dirConfig,
        JSON.stringify(config, null, 2)
      );

      const userInfo = await Promise.all(
        uids.map(async uid => {
          const name = await usersData.getName(uid);
          return { uid, name: (name && name !== "null") ? name : "𝗔𝗗𝗠𝗜𝗡🛡️" };
        })
      );

      let msg = "";

      for (const user of userInfo) {
        if (addedUsers.includes(user.uid)) {
          msg += `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥 𝗔𝗗𝗗𝗘𝗗
» ⚜️ 𝗡𝗔𝗠𝗘 : ${user.name}
» 🆔 𝗨𝗜𝗗  : ${user.uid}
» 💠 𝗥𝗔𝗡𝗞 : 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿
» 🥂 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗗𝗗𝗘𝗗
» 💎 𝗔𝗖𝗖𝗘𝗦𝗦 : 𝗙𝗨𝗟𝗟 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡𝗦
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧\n\n`;
        }

        if (alreadyUsers.includes(user.uid)) {
          msg += `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥
» 👤 𝗡𝗔𝗠𝗘 : ${user.name}
» 🆔 𝗨𝗜𝗗  : ${user.uid}
» 💎 𝗔𝗕𝗢𝗨𝗧 : 𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧\n\n`;
        }
      }

      return message.reply(msg.trim());
    }

    if (args[0] == "remove" || args[0] == "-r") {

      if (!isOwner) {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗
» ⚠️ 𝗢𝗻𝗹𝘆 𝗦𝗜𝗬𝗔𝗠 𝗢𝘄𝗻𝗲𝗿 
» 👑 𝗖𝗮𝗻 𝗥𝗲𝗺𝗼𝘃𝗲 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }

      let uids = [];

      if (event.type == "message_reply") {
        uids.push(event.messageReply.senderID);
      } else if (Object.keys(event.mentions).length > 0) {
        uids = Object.keys(event.mentions);
      } else if (args.slice(1).length > 0) {
        uids = args.slice(1).filter(uid => !isNaN(uid));
      }

      if (!uids.length) {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔍 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗨𝗦𝗘𝗥
» ⚠️ 𝗥𝗲𝗽𝗹𝘆 / 𝗧𝗮𝗴 / 𝗨𝗜𝗗 𝗡𝗲𝗲𝗱𝗲𝗱
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }

      const removedUsers = [];
      const notUsers = [];

      for (const uid of uids) {
        if (config.adminBot.includes(uid)) {
          config.adminBot.splice(config.adminBot.indexOf(uid), 1);
          removedUsers.push(uid);
        } else {
          notUsers.push(uid);
        }
      }

      writeFileSync(
        global.client.dirConfig,
        JSON.stringify(config, null, 2)
      );

      const userInfo = await Promise.all(
        uids.map(async uid => {
          const name = await usersData.getName(uid);
          return { uid, name: (name && name !== "null") ? name : "𝗔𝗗𝗠𝗜𝗡" };
        })
      );

      let msg = "";

      for (const user of userInfo) {
        if (removedUsers.includes(user.uid)) {
          msg += `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥 𝗥𝗘𝗠𝗢𝗩𝗘𝗗
» ⚜️ 𝗡𝗔𝗠𝗘 : ${user.name}
» 🆔 𝗨𝗜𝗗  : ${user.uid}
» 💠 𝗥𝗔𝗡𝗞 : 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿
» 💔 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
» 🔒 𝗔𝗖𝗖𝗘𝗦𝗦 : 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗖𝗹𝗼𝘀𝗲𝗱
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧\n\n`;
        }

        if (notUsers.includes(user.uid)) {
          msg += `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗡𝗢𝗧 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥
» 👤 𝗡𝗔𝗠𝗘 : ${user.name}
» 🆔 𝗨𝗜𝗗  : ${user.uid}
» ❌ 𝗡𝗼𝘁 𝗜𝗻 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿 𝗟𝗶𝘀𝘁 ⛔
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧\n\n`;
        }
      }

      return message.reply(msg.trim());
    }

    if (args[0] == "list" || args[0] == "-l") {

      const validAdminUIDs = (config.adminBot || []).filter(uid => uid && String(uid).trim() !== "");

      const users = await Promise.all(
        validAdminUIDs.map(async uid => {
          const fetchedName = await usersData.getName(uid);
          const displayName = (fetchedName && fetchedName !== "null") ? fetchedName : "𝗔𝗗𝗠𝗜𝗡";
          return { uid, name: displayName };
        })
      );

      let listText = "";

      users.forEach((user, index) => {
        listText += `» ${index + 1}. 👑 ${user.name}\n» 🆔 𝗨𝗜𝗗: ${user.uid}\n───────────────\n`;
      });

      return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥 𝗟𝗜𝗦𝗧
───────────────
${listText.trim() || "» ❌ 𝗡𝗢 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥𝗦 𝗙𝗢𝗨𝗡𝗗 📭"}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
    }

    return message.SyntaxError();
  }
};
