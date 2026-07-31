module.exports = {
  config: {
    name: "kickall",
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 2,
    shortDescription: {
      en: "Kick non-admin members from group"
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();

      // ১. চেক করা বট এডমিন কিনা
      const groupAdminIDs = threadInfo.adminIDs.map(item => item.id);
      if (!groupAdminIDs.includes(botID)) {
        const noAdminMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗔𝗠𝗔𝗞𝗘 𝗚𝗥𝗢𝗨𝗣 
» 🧭 𝗔𝗗𝗠𝗜𝗡 𝗞𝗔𝗥𝗢𝗡!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noAdminMsg, threadID, messageID);
      }

      // ২. বট এডমিন লিস্ট ফেচ করা
      const botAdminIDs = global.GoatBot.config.adminBot || [];

      // ৩. গ্রুপ এডমিন ও বট এডমিনদের সুরক্ষিত রেখে সাধারণ মেম্বারদের ফিল্টার করা
      const membersToKick = threadInfo.participantIDs.filter(id => 
        !groupAdminIDs.includes(id) && !botAdminIDs.includes(id) && id !== botID
      );

      if (membersToKick.length === 0) {
        const noMemberMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗞𝗜𝗖𝗞 𝗞𝗔𝗥𝗔𝗥 𝗠𝗢𝗧𝗢 
» 🥶 𝗞𝗢𝗡𝗢 𝗠𝗘𝗠𝗕𝗘𝗥 𝗡𝗘𝗜!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noMemberMsg, threadID, messageID);
      }

      const startMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗞𝗜𝗖𝗞𝗜𝗡𝗚 ${membersToKick.length} 
» ⏳ 𝗠𝗘𝗠𝗕𝗘𝗥𝗦...
» 🛡️ 𝗔𝗗𝗠𝗜𝗡𝗦 𝗔𝗥𝗘 𝗦𝗔𝗙𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(startMsg, threadID, async () => {
        for (const userID of membersToKick) {
          try {
            await api.removeUserFromGroup(userID, threadID);
          } catch (e) {
            console.log(`❌ Failed to kick ${userID}: ${e.message}`);
          }
        }
      }, messageID);

    } catch (e) {
      console.error(e);
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗞𝗜𝗖𝗞 𝗞𝗔𝗥𝗧𝗘 
» 🎀 𝗦𝗢𝗠𝗢𝗦𝗬𝗔 𝗛𝗢𝗬𝗘𝗖𝗛𝗘!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};




          
