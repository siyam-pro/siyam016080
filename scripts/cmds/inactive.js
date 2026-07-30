const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "inactive",
    aliases: ["kickinactive", "msgcheck"],
    version: "3.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 1,
    shortDescription: "Inactve ID and message threshold manager",
    category: "group",
    guide: {
      en: "{pn} clean\n{pn} [message count]"
    }
  },

  onStart: async function ({ api, event, args, Threads }) {
    const { threadID, messageID, senderID } = event;

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(item => item.id);
    const botID = api.getCurrentUserID();

    if (!adminIDs.includes(botID)) {
      const noAdminMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️  𝗔𝗠𝗔𝗞𝗘 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 𝗞𝗔𝗥𝗢𝗡!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noAdminMsg, threadID, messageID);
    }

    const subCommand = args[0]?.toLowerCase();

    if (subCommand === "clean") {
      const loadingText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔍  𝗡𝗢𝗦𝗛𝗧𝗢 𝗜𝗗 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚...
» ⏳  𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      const waitMsg = await api.sendMessage(loadingText, threadID, messageID);
      let kickedCount = 0;

      for (const user of threadInfo.userInfo) {
        if (!user.name || user.type !== "user" || user.gender === undefined) {
          try {
            await api.removeUserFromGroup(user.id, threadID);
            kickedCount++;
          } catch (e) {
            console.error(e);
          }
        }
      }

      await api.unsendMessage(waitMsg.messageID).catch(() => {});

      const resultMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🧹  𝗖𝗟𝗘𝗔𝗡𝗜𝗡𝗚 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘!
» 🚫  𝗞𝗜𝗖𝗞𝗘𝗗 𝗜𝗗𝗦 : ${kickedCount}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(resultMsg, threadID, messageID);
    }

    const limit = parseInt(args[0]);
    if (isNaN(limit) || limit < 1) {
      const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💡  𝗨𝗦𝗔𝗚𝗘:
» 1️⃣ /inactive clean
» 2️⃣ /inactive 5
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(invalidMsg, threadID, messageID);
    }

    const threadData = (await Threads.getData(threadID)) || {};
    const memberStats = threadData.data?.userStats || {};

    let targetUsers = [];

    for (const user of threadInfo.userInfo) {
      if (adminIDs.includes(user.id) || user.id === botID) continue;

      const userMsgCount = memberStats[user.id] || 0;
      if (userMsgCount < limit) {
        targetUsers.push({
          id: user.id,
          name: user.name,
          count: userMsgCount
        });
      }
    }

    if (targetUsers.length === 0) {
      const noUserMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅  ${limit} 𝗧𝗔𝗥 𝗞𝗢𝗠 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗞𝗔𝗥𝗔 𝗞𝗢𝗡𝗢 𝗠𝗘𝗠𝗕𝗘𝗥 𝗡𝗘𝗜!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(noUserMsg, threadID, messageID);
    }

    let listText = "";
    targetUsers.forEach((u, index) => {
      listText += `» ${index + 1}. ${u.name} (Msg: ${u.count})\n   UID: ${u.id}\n`;
    });

    const msgList = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📊  𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗟𝗘𝗦𝗦 𝗧𝗛𝗔𝗡 ${limit}:
${listText}───────────────
» 📌  𝗥𝗘𝗣𝗟𝗬 𝗪𝗜𝗧𝗛 𝗡𝗨𝗠𝗕𝗘𝗥𝗦 𝗧𝗢 𝗞𝗜𝗖𝗞!
» 💡  Example: 1 2 5 or 1,3,4
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return api.sendMessage(msgList, threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: senderID,
          targetUsers: targetUsers
        });
      }
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) return;

    const selectedIndexes = body.split(/[\s,]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (selectedIndexes.length === 0) {
      const invalidInput = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️  𝗦𝗔𝗥𝗜𝗔𝗟 𝗡𝗨𝗠𝗕𝗘𝗥 𝗟𝗘𝗞𝗛𝗢𝗡! (Eg: 1 2 3)
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(invalidInput, threadID, messageID);
    }

    let kickedNames = [];
    let failedCount = 0;

    for (const index of selectedIndexes) {
      const target = Reply.targetUsers[index - 1];
      if (target) {
        try {
          await api.removeUserFromGroup(target.id, threadID);
          kickedNames.push(target.name);
        } catch (e) {
          failedCount++;
        }
      }
    }

    const successKickMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫  𝗞𝗜𝗖𝗞𝗘𝗗 𝗠𝗘𝗠𝗕𝗘𝗥𝗦:
${kickedNames.map(n => `» ✅ ${n}`).join("\n")}
${failedCount > 0 ? `» ❌ Failed: ${failedCount}` : ""}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    await api.sendMessage(successKickMsg, threadID, messageID);
    global.GoatBot.onReply.delete(Reply.messageID);
  }
};
