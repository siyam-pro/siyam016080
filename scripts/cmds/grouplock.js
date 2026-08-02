if (!global.__GroupLockSystem) global.__GroupLockSystem = new Map();
if (!global.__GroupLockWarn) global.__GroupLockWarn = new Map();
if (!global.__GroupLockSpam) global.__GroupLockSpam = new Map();

module.exports = {
  config: {
    name: "grouplock",
    aliases: ["lock", "lockbox"],
    version: "11.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: "Turn on/off message lock guard for specific groups.",
    longDescription: "Allows admins to lock a specific group. Automatically warns and kicks regular members who text while locked.",
    category: "box-protection",
    guide: { en: "{pn} on | off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const sID = String(senderID);

    try {
      const botAdmins = global.GoatBot?.config?.adminBot || [];
      const info = await api.getThreadInfo(threadID);
      const groupAdmins = info.adminIDs.map(i => String(i.id));

      const isBotAdmin = botAdmins.map(id => String(id)).includes(sID);
      const isGroupAdmin = groupAdmins.includes(sID);

      if (!isBotAdmin && !isGroupAdmin) {
        const noPermissionMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❎ এই কমান্ডটি শুধুমাত্র
» 🎀 আমার বস সিয়ামের জন্য
» 🥱 তুই গরিব তোর কথা
» 🙄 শুনবো না! 😁
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(noPermissionMsg);
      }

      const status = args[0]?.toLowerCase();

      if (status === "on") {
        global.__GroupLockSystem.set(threadID, true);
        const lockOnMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔒 গ্রুপের সিকিউরিটি
» 🛡️ গার্ড অন করা হয়েছে 
» 🤣 এখন থেকে মেসেজ
» 🦵 দেওয়ার সাথে সাথে
» 😂 সম্মানের সাথে কিক ফ্রি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(lockOnMsg);
      } 
      
      if (status === "off") {
        global.__GroupLockSystem.delete(threadID);
        global.__GroupLockWarn.forEach((val, key) => {
          if (key.startsWith(`${threadID}_`)) global.__GroupLockWarn.delete(key);
        });
        const lockOffMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔓 সিয়াম ভাই এই গ্রুপ 
» 🛸 আনলক করা হয়েছে 
» 🌝 এখন সবাই মেসেজ 
» 🥱 করতে পারবেন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(lockOffMsg);
      }

      const guideMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ সিয়াম ভাই এইভাবে
» 🙄 ব্যবহার করো:
» 🔒 লক করতে: lock on
» 🔓 লক খুলতে: lock off
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(guideMsg);

    } catch (err) {
      console.error(err);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, senderID, messageID } = event;
    if (!senderID || senderID == api.getCurrentUserID()) return;

    if (!global.__GroupLockSystem.get(threadID)) return;

    try {
      const sID = String(senderID);

      const botAdmins = global.GoatBot?.config?.adminBot || [];
      if (botAdmins.map(id => String(id)).includes(sID)) return;

      const info = await api.getThreadInfo(threadID);
      const groupAdmins = info.adminIDs.map(i => String(i.id));
      if (groupAdmins.includes(sID)) return;

      const spamKey = `${threadID}_${sID}`;
      const lastCheck = global.__GroupLockSpam.get(spamKey) || 0;
      if (Date.now() - lastCheck < 1500) return; 
      global.__GroupLockSpam.set(spamKey, Date.now());

      try {
        await api.unsendMessage(messageID);
      } catch (e) {}

      const userKey = `${threadID}_${sID}`;
      let warnCount = global.__GroupLockWarn.get(userKey) || 0;
      warnCount++;
      global.__GroupLockWarn.set(userKey, warnCount);

      let userData = await api.getUserInfo(sID);
      let userName = (userData[sID]?.name || "গ্রুপ মেম্বার").toUpperCase();

      if (warnCount >= 3) {
        global.__GroupLockWarn.delete(userKey);

        const kickMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗚𝗥𝗢𝗨𝗣 𝗟𝗢𝗖𝗞𝗘𝗗 
» 👤 @${userName}
» 🚫 ২ বার ওয়ার্নিং পাওয়ার
» 🤬 ব্যবহার মেসেজ দিয়েছেন!
» ⚙️ সিয়াম ভাইয়ের
» 🎀 আদেশ না মানার কারণে
» ❎ তোকে গ্রুপ থেকে 
» 🦵 কিক দেওয়া হলো 🥱
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        await api.sendMessage({
          body: kickMsg,
          mentions: [{ tag: `@${userName}`, id: sID }]
        }, threadID);

        return api.removeUserFromGroup(sID, threadID);

      } else {
        let remain = 3 - warnCount;
        
        const warnMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔒 𝗚𝗥𝗢𝗨𝗣 𝗟𝗢𝗖𝗞𝗘𝗗 
» 👤 @${userName}
» 📢 গ্রুপ লক থাকা অবস্থায়
» 🤦 মেসেজ দিলে কিক খাবেন!
» ⚠️ [ ${warnCount} / ২ ]
» 🏟️ আর মাত্র ${remain}
» 😹 বার সুযোগ আছে 🤧
» ☠️ এরপর কিক!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return api.sendMessage({
          body: warnMsg,
          mentions: [{ tag: `@${userName}`, id: sID }]
        }, threadID);
      }

    } catch (err) {
      console.error("Lock System Error:", err);
    }
  }
};
