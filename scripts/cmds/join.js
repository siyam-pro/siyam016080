let designIndex = 0;
const VISIBLE_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";//নাম চেঞ্জ করলে ফাইল বন্ধ হয়ে যাবে

module.exports = {
  config: {
    name: "join",
    version: "1.2.0",
    author: VISIBLE_AUTHOR,
    countDown: 5,
    role: 2,
    shortDescription: "Get all group list and join by serial number",
    category: "System",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
      const allThreads = await api.getThreadList(20, null, ["INBOX"]) || [];
      const groupList = allThreads.filter(t => t.isGroup && t.isSubscribed);

      if (!groupList || groupList.length === 0) {
        const noGroupMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌  বটের কাছে কোনো সচল গ্রুপের তথ্য পাওয়া যায়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noGroupMsg, threadID, messageID);
      }

      const designs = [
        (groupList) => {
          let text = `📜 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 📜\n━━━━━━━━━━━━━━━━━\n`;
          groupList.forEach((group, index) => {
            text += `${index + 1}. ${group.name || "Unknown Group"}\n`;
          });
          text += `\n━━━━━━━━━━━━━━━━━\n👉 যে গ্রুপে জয়েন হতে চান, সেই সিরিয়াল নাম্বারটি লিখে রিপ্লাই দিন।`;
          return text;
        },

        (groupList) => {
          let text = `╭─❖ 𝐕𝐈𝐏 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 ❖─╮\n\n`;
          groupList.forEach((group, index) => {
            text += `┃ ${index + 1} ➤ ${group.name || "Unknown Group"}\n`;
          });
          text += `\n╰────────❖────────╯\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑\n👑 ${VISIBLE_AUTHOR} 👑\n\n🪬 যে গ্রুপে জয়েন হতে চান,\n🔢 সেই নাম্বারটি রিপ্লাই দিন।\n╰────────❖────────╯`;
          return text;
        },

        (groupList) => {
          let text = `┏❖💠 𝐆𝐑𝐎𝐔𝐏 𝐏𝐀𝐍𝐄𝐋 💠❖┓\n`;
          groupList.forEach((group, index) => {
            text += ` 〔 ${index + 1} 〕${group.name || "Unknown Group"}\n`;
          });
          text += `\n┗━━❖━━━━━━━━━❖━━┛\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑\n👑 ${VISIBLE_AUTHOR} 👑\n\n👉 যে গ্রুপে জয়েন হতে চান, সেই নাম্বারটি রিপ্লাই দিন।\n┗━━❖━━━ ━━━ ━━━❖━━┛`;
          return text;
        },

        (groupList) => {
          let text = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📜  𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓:\n\n`;
          groupList.forEach((group, index) => {
            text += `» ${index + 1}. ${group.name || "Unknown Group"}\n`;
          });
          text += `───────────────\n» 🔢  যে গ্রুপে জয়েন হতে চান, রিপ্লাই দিন!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return text;
        }
      ];

      const msg = designs[designIndex](groupList);

      designIndex++;
      if (designIndex >= designs.length) {
        designIndex = 0;
      }

      return api.sendMessage(msg, threadID, (err, info) => {
        if (err) return console.log(err);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          groupList
        });
      }, messageID);

    } catch (e) {
      console.error(e);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ গ্রুপের লিস্ট পাওয়া যাচ্ছে না। 
» 🥱 কিছুক্ষণ পর চেষ্টা করুন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body, senderID } = event;
    const { author, groupList } = Reply;

    if (author !== senderID) return;

    const index = parseInt(body) - 1;

    if (isNaN(body) || index < 0 || !groupList[index]) {
      const wrongMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল সিরিয়াল নাম্বার 
» ✅ সঠিক নাম্বার রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(wrongMsg, threadID, messageID);
    }

    const targetGroup = groupList[index];
    const targetThreadID = targetGroup.threadID;

    try {
      await api.addUserToGroup(senderID, targetThreadID);

      const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ আপনাকে 
» 🫡 "${targetGroup.name || "গ্রুপে"}" 
» ✅ অ্যাড করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(successMsg, threadID, messageID);

      const alertTargetMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝗕𝗢𝗦𝗦 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 
» 👑 এই গ্রুপে জয়েন করেছেন!
» 🫡 সবাই তাকে সম্মান জানাও 👑
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(alertTargetMsg, targetThreadID);

    } catch (err) {
      const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অ্যাড করা যাচ্ছে না! হয় আপনি 
» 🤧 অলরেডি আছেন বা বট এডমিন না।
» 🆔 𝐈𝐃: ${targetThreadID}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝐀𝗧𝗕𝗢𝗧`;

      api.sendMessage(failMsg, threadID, messageID);
    }
  }
};
