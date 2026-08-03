function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
  config: {
    name: "filteruser",
    version: "2.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 1,
    description: {
      vi: "lọc thành viên nhóm",
      en: "Filter group members by message count or locked accounts"
    },
    category: "box chat",
    guide: {
      vi: "{pn} <số tin nhắn> | die",
      en: "{pn} <number of messages> | die"
    }
  },

  onStart: async function ({ api, args, threadsData, message, event, commandName }) {
    const threadData = await threadsData.get(event.threadID);
    const botID = api.getCurrentUserID();

    if (!threadData.adminIDs.includes(botID)) {
      const needAdmin = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐁𝐨𝐭 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐚𝐧 𝐚𝐝𝐦𝐢𝐧
» 📌 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(needAdmin);
    }

    if (!args[0]) {
      const guideMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📖 𝐔𝐬𝐚𝐠𝐞 𝐆𝐮𝐢𝐝𝐞:
» 🔹 filteruser 300
» 🔹 filteruser die
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(guideMsg);
    }

    if (!isNaN(args[0])) {
      const minimum = Number(args[0]);
      const membersCountLess = threadData.members.filter(member =>
        member.count < minimum
        && member.inGroup == true
        && member.userID != botID
        && !threadData.adminIDs.some(id => id == member.userID)
      );

      if (membersCountLess.length === 0) {
        const noUser = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ${minimum} 𝐭𝐚𝐫 𝐜𝐡𝐞𝐲𝐞 𝐤𝐨𝐦
» 📩 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐝𝐞𝐰𝐚 𝐤𝐨𝐧𝐨
» 👤 𝐦𝐞𝐦𝐛𝐞𝐫 𝐩𝐚𝐨𝐲𝐚 𝐣𝐚𝐲𝐧𝐢!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(noUser);
      }

      let msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📊 𝐅𝐨𝐮𝐧𝐝 ${membersCountLess.length} 𝐦𝐞𝐦𝐛𝐞𝐫𝐬
» 📩 𝐰𝐢𝐭𝐡 𝐥𝐞𝐬𝐬 𝐭𝐡𝐚𝐧 ${minimum} 𝐦𝐬𝐠:
───────────────\n`;

      membersCountLess.forEach((user, index) => {
        msg += `» [${index + 1}] ${user.name || "Facebook User"}\n`;
      });

      msg += 
`───────────────
» 📌 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐬𝐞𝐫𝐢𝐚𝐥 𝐧𝐮𝐦𝐛𝐞𝐫(𝐬)
» 💡 𝐄.𝐠:1,2,3 𝐨𝐫 1-5 𝐭𝐨 𝐤𝐢𝐜𝐤!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID,
          members: membersCountLess
        });
      });
    }

    else if (args[0].toLowerCase() === "die") {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const membersBlocked = threadInfo.userInfo.filter(user => user.type !== "User");
      
      const success = [];
      const errors = [];

      for (const user of membersBlocked) {
        if (!threadData.adminIDs.some(id => id == user.id)) {
          try {
            await api.removeUserFromGroup(user.id, event.threadID);
            success.push(user.id);
          } catch (e) {
            errors.push(user.name);
          }
          await sleep(700);
        }
      }

      let response = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n`;
      if (success.length > 0) response += `» ✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 ${success.length} 𝐝𝐢𝐞 𝐚𝐜𝐜𝐨𝐮𝐧𝐭𝐬!\n`;
      if (errors.length > 0) response += `» ❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐫𝐞𝐦𝐨𝐯𝐞 ${errors.length} 𝐚𝐜𝐜𝐨𝐮𝐧𝐭𝐬!\n`;
      if (success.length === 0 && errors.length === 0) response += `» ❌ 𝐊𝐨𝐧𝐨 𝐝𝐢𝐞 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐩𝐚𝐨𝐲𝐚 𝐣𝐚𝐲𝐧𝐢!\n`;
      response += `───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply(response);
    }

    else {
      const guideMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📖 𝐔𝐬𝐚𝐠𝐞 𝐆𝐮𝐢𝐝𝐞:
» 🔹 filteruser 200
» 🔹 filteruser die
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(guideMsg);
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { author, members } = Reply;
    
    // সাধারণ কোনো ইউজার রিপ্লাই দিলে বট একদম চুপ থাকবে
    if (event.senderID !== author) return;

    const input = event.body.trim();
    let selectedIndexes = [];

    if (input.includes("-")) {
      const [start, end] = input.split("-").map(num => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          selectedIndexes.push(i - 1);
        }
      }
    } else {
      const numbers = input.split(/[\s,]+/);
      selectedIndexes = numbers
        .map(num => parseInt(num.trim()) - 1)
        .filter(num => !isNaN(num));
    }

    const validTargets = selectedIndexes
      .filter(index => index >= 0 && index < members.length)
      .map(index => members[index]);

    if (validTargets.length === 0) {
      const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐫𝐢𝐚𝐥 𝐧𝐮𝐦𝐛𝐞𝐫!
» 📌 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 
» 👑 𝐰𝐢𝐭𝐡 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(invalidMsg);
    }

    const success = [];
    const errors = [];

    for (const target of validTargets) {
      try {
        await api.removeUserFromGroup(target.userID, event.threadID);
        success.push(target.name || target.userID);
      } catch (e) {
        errors.push(target.name || target.userID);
      }
      await sleep(700);
    }

    let finalMsg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n`;
    if (success.length > 0) finalMsg += `» ✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐤𝐢𝐜𝐤𝐞𝐝 ${success.length} 𝐦𝐞𝐦𝐛𝐞𝐫𝐬!\n`;
    if (errors.length > 0) finalMsg += `» ❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐤𝐢𝐜𝐤 ${errors.length} 𝐦𝐞𝐦𝐛𝐞𝐫𝐬!\n`;
    finalMsg += `───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply(finalMsg);
  }
};
