const fs = require("fs");

module.exports = {
  config: {
    name: "gcmanage",
    aliases: ["gc", "group", "গ্রুপ"],
    version: "7.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 2,
    category: "admin",
    shortDescription: "স্মার্ট গ্রুপ নোটিশ ও প্রফেশনাল লিভ সিস্টেম"
  },

  onStart: async function ({ message, args, api, event }) {
    const input = args.join(" ").toLowerCase().trim();
    global.GoatBot.onReply = global.GoatBot.onReply || new Map();

    if (input === "list" || input === "লিস্ট") {
      try {
        const inbox = await api.getThreadList(100, null, ["INBOX"]);
        const groups = inbox.filter(t => t.isGroup);
        if (groups.length === 0) {
          return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐍𝐨 𝐚𝐜𝐭𝐢𝐯𝐞 𝐠𝐫𝐨𝐮𝐩𝐬 𝐟𝐨𝐮𝐧𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
          );
        }

        let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🌐 𝐁𝐎𝐓 𝐀𝐂𝐓𝐈𝐕𝐄 𝐆𝐑𝐎𝐔𝐏𝐒 🌐\n───────────────\n`;
        let reps = [];

        groups.forEach((g, i) => {
          msg += `» [ ${i + 1} ] 👥 ${g.name || "Unnamed Group"}\n» 🆔 𝐈𝐃: ${g.threadID}\n───────────────\n`;
          reps.push({ num: i + 1, id: g.threadID, name: g.name || "Unnamed Group" });
        });

        msg += `» ⚡ 𝐆𝐔𝐈𝐃𝐄𝐋𝐈𝐍𝐄:\n» 📢 লিভ ও নোটিশ দিতে লিখুন: out নাম্বার\n» ➕ গ্রুপে জয়েন হতে লিখুন: add <নাম্বার>\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return message.reply(msg, (e, info) => {
          if (!e) {
            global.GoatBot.onReply.set(info.messageID, { 
              commandName: "gcmanage", 
              author: event.senderID, 
              data: reps,
              msgIds: [info.messageID, event.messageID]
            });
          }
        });
      } catch (e) {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ Error: ${e.message}\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }
    }

    return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 💡 ব্যবহার করতে লিখুন:
» 📌 gc list অথবা gc লিস্ট
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    );
  },

  onReply: async function ({ message, Reply, event, api }) {
    if (event.senderID !== Reply.author) return;
    const text = event.body.trim().toLowerCase();
    const cmdChannel = event.threadID;

    let trackedIds = Reply.msgIds || [];
    trackedIds.push(event.messageID);

    const cleanupMessages = async (idsArray) => {
      if (idsArray && idsArray.length > 0) {
        const uniqueIds = [...new Set(idsArray)];
        for (const id of uniqueIds) {
          try { await api.unsendMessage(id); } catch(e){}
        }
      }
    };

    // ================= [ ADD FEATURE ] =================
    if (text.startsWith("add")) {
      const num = parseInt(text.replace("add", "").trim());
      if (isNaN(num)) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে সঠিক 
» 📉 নাম্বার টাইপ করুন।
» 📝 উদাহরণ: add 1
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      const target = Reply.data.find(g => g.num === num);
      if (!target) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ এই নাম্বারের কোনো 
» 🙄 গ্রুপ খুঁজে পাওয়া যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      try {
        await api.addUserToGroup(event.senderID, target.id);
        message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ আপনাকে সফলভাবে
» 🦉"${target.name}" 
» 🦃 গ্রুপে যুক্ত করা হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
        await cleanupMessages(trackedIds);
      } catch (err) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ গ্রুপে অ্যাড করা যায়নি।
» ⚙️ গ্রুপের মেম্বার ফুল অথবা 
» 🤧 বটের পারমিশন নেই।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }
      return;
    }

    // ================= [ OUT FEATURE ] =================
    if (text.startsWith("out")) {
      const num = parseInt(text.replace("out", "").trim());
      if (isNaN(num)) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে সঠিক 
» 🫡 নাম্বার টাইপ করুন।
» 📝 উদাহরণ: out 1
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      const target = Reply.data.find(g => g.num === num);
      if (!target) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ এই নাম্বারের কোনো 
» 🤦 গ্রুপ খুঁজে পাওয়া যায়নি।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }

      try {
        const currentThread = await api.getThreadInfo(cmdChannel);
        const currentName = currentThread.threadName || "Админ Снαииєℓ";
        const targetName = target.name;
        const targetId = target.id;

        api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠...
» 📡 "${targetName}" 
» 🙆 গ্রুপে নোটিশ পাঠানো হচ্ছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, cmdChannel, async (err, procInfo) => {
          if (!err) trackedIds.push(procInfo.messageID);
        });

        const noticeMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👑 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐍𝐎𝐓𝐈𝐂𝐄 ⏳
» 🤲 আসসালামু আলাইকুম।
───────────────
» 📢 "${targetName}" গ্রুপটি
» ⏱️ আগামী ৩ মিনিটের 
» 🥱 মধ্যে ব্যান করা হবে।
───────────────
» 📌 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐒𝐨𝐮𝐫𝐜𝐞
» 💬 এই নোটিশটি 
» ✅"${currentName}"
» 👑 গ্রুপ থেকে owner দ্বারা 
» 🎰 পাঠানো হয়েছে।
───────────────
» 📞 বটটি পুনরায় ব্যবহার করতে
» 📲 নিচের নম্বরে যোগাযোগ করুন।
» ☎️ 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋: +8801789138157
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await api.sendMessage(noticeMsg, targetId);

        const askMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👑 𝐋𝐄𝐀𝐕𝐄 𝐂𝐎𝐍𝐅𝐈𝐑𝐌 
» 🔔 সিয়াম বস লিভ নিব?
───────────────
» 🎯 𝐓𝐚𝐫𝐠𝐞𝐭 𝐆𝐫𝐨𝐮𝐩: 
» ☠️"${targetName}"
» ✅ 𝐑𝐞𝐩𝐥𝐲: ass Confirm
» ❌ 𝐑𝐞𝐩𝐥𝐲: no Cancel
───────────────
» ⏳ 𝐓𝐢𝐦𝐞𝐨𝐮𝐭: সিদ্ধান্ত না 
» 🙂 দেওয়া পর্যন্ত লিভ নিবে না।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        global.GoatBot.onReply.delete(event.messageReply.messageID);

        api.sendMessage(askMsg, cmdChannel, (err, info) => {
          if (!err) {
            trackedIds.push(info.messageID);

            global.GoatBot.onReply.set(info.messageID, {
              commandName: "gcmanage",
              author: Reply.author,
              action: "confirm_leave",
              msgIds: trackedIds,
              targetName: targetName,
              targetId: targetId,
              currentName: currentName
            });
          }
        });

      } catch (e) {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অপারেশন ব্যর্থ!
» 🔒 টার্গেট গ্রুপে মেসেজ ব্লক 
» 🎶 অথবা বট মিউট আছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }
      return;
    }

    // ================= [ CONFIRMATION HANDLER ] =================
    if (Reply.action === "confirm_leave") {
      const targetName = Reply.targetName;
      const targetId = Reply.targetId;
      const currentName = Reply.currentName;

      if (text === "ass") {
        api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠... প্রসেস 
» 💋 নিশ্চিত করা হয়েছে।
» ⏱️ ঠিক ৩ মিনিট পর 
» ❎ বট লিভ নিবে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, cmdChannel, async (err, loadInfo) => {
          if (!err) trackedIds.push(loadInfo.messageID);
        });

        global.GoatBot.onReply.delete(event.messageReply.messageID);

        setTimeout(async () => {
          try {
            const leaveMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔰 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐄𝐀𝐕𝐈𝐍𝐆 
» 🚨 𝐋𝐞𝐚𝐯𝐢𝐧𝐠 𝐆𝐫𝐨𝐮𝐩...
───────────────
» 👋 এই গ্রুপ থেকে লিভ 
» 👑 নেওয়া হয়েছে।
» 👑 সিয়াম বস সরাসরি 
» 🪂"${targetName}" গ্রুপটিকে
» 🚫 ব্যান লিস্টে যুক্ত করেছেন।
───────────────
» 🎈 আমাকে ব্যবহার 
» 🤧 করার জন্য ধন্যবাদ।
» 🖐️ 𝐆𝐨𝐨𝐝𝐛𝐲𝐞!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

            await api.sendMessage(leaveMsg, targetId);
            await api.removeUserFromGroup(api.getCurrentUserID(), targetId);

            const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✨ 𝐓𝐀𝐒𝐊 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄𝐃 
» 🚀 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐄𝐱𝐞𝐜𝐮𝐭𝐞𝐝!
───────────────
» 🎯 𝐓𝐚𝐫𝐠𝐞𝐭 𝐆𝐫𝐨𝐮𝐩: 
» 🧑‍🚀"${targetName}"
» 📡 𝐒𝐞𝐧𝐝 𝐆𝐫𝐨𝐮𝐩: 
» 📉"${currentName}"
» 📊 স্ট্যাটাস: বট সফলভাবে 
» 🎀 লিভ নিয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

            await api.sendMessage(successMsg, cmdChannel);
            await cleanupMessages(trackedIds);

          } catch (err) {
            return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ "${targetName}" 
» 🎀 গ্রুপে লিভ নিতে সমস্যা 
» 🤧 হইছে সিয়াম বস।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, cmdChannel);
          }
        }, 180000);
      } 
      else if (text === "no") {
        global.GoatBot.onReply.delete(event.messageReply.messageID);

        try {
          await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ সিয়াম বস এই গ্রুপ 
» 🏟️ থেকে বটের লিভ 
» ⚔️ বাতিল করেছেন।
» 🔓 আপনাদের গ্রুপটি 
» ☑️ আনব্যান আছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, targetId);

          await api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ বস লিভ নিতে নিষেধ করছেন!
» ⏳ অপারেশন বাতিল করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, cmdChannel);

          await cleanupMessages(trackedIds);

        } catch (e) {
          return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ প্রসেস বাতিল করার 
» ⚔️ সময় সমস্যা হয়েছে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, cmdChannel);
        }
      } else {
        return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল অপশন!
» 📝 সঠিক গাইডলাইন মেনে 
» ✅ এপ্রুভ করতে ass 
» ❎ বাতিল করতে no 
» 🤦 লিখে রিপ্লাই দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
        );
      }
    }
  }
};
