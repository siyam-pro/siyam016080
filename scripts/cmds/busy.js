const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "busy",
    version: "2.5.0",
    author: AUTHOR,
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Do not disturb system with custom status and auto-reply",
      bn: "ব্যস্ত স্ট্যাটাস এবং অটোমেটিক মেসেজ রিপ্লাই সিস্টেম"
    },
    longDescription: {
      en: "Turn on busy mode with custom reason, time tracker, and auto-notify users when you are tagged.",
      bn: "কাস্টম কারণ এবং সময় ট্র্যাকিং সহ ব্যস্ত মোড চালু করুন।"
    },
    category: "utility",
    guide: {
      en: "{pn} [reason] | {pn} off | {pn} status",
      bn: "{pn} [কারণ] | {pn} off | {pn} status"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;
    const type = args[0]?.toLowerCase();

    if (type === "off" || type === "remove") {
      const userData = await usersData.get(senderID);
      if (!userData.data?.busy) {
        return message.reply("⚠️ আপনার কোনো Busy স্ট্যাটাস চালু নেই!");
      }

      delete userData.data.busy;
      await usersData.set(senderID, userData.data, "data");
      return message.reply("✅ আপনার Busy মোড সফলভাবে বন্ধ করা হয়েছে। এখন সবাই আপনাকে ট্যাগ করতে পারবে।");
    }

    if (type === "status" || type === "check") {
      const userData = await usersData.get(senderID);
      const busyInfo = userData.data?.busy;
      
      if (!busyInfo) {
        return message.reply("ℹ️ আপনার বর্তমানে কোনো Busy স্ট্যাটাস সক্রিয় নেই।");
      }

      return message.reply(
        `📌 আপনার বর্তমান Busy স্ট্যাটাস:\n` +
        `📝 কারণ: ${busyInfo.reason}\n` +
        `⏰ চালু করা হয়েছে: ${busyInfo.time}`
      );
    }

    const reason = args.join(" ").trim() || "বর্তমানে ব্যস্ত আছি, পরে কথা হবে।";
    const currentTime = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });

    const busyData = {
      status: true,
      reason: reason,
      time: currentTime
    };

    const userData = await usersData.get(senderID);
    userData.data = userData.data || {};
    userData.data.busy = busyData;

    await usersData.set(senderID, userData.data, "data");

    return message.reply(
      `✅ Busy Mode Active!\n\n` +
      `📝 কারণ: ${reason}\n` +
      `⏰ সময়: ${currentTime}\n\n` +
      `💡 এখন থেকে কেউ আপনাকে ট্যাগ করলে বট স্বয়ংক্রিয়ভাবে আপনার এই কারণটি জানিয়ে দেবে।`
    );
  },

  onChat: async function ({ event, message, usersData }) {
    const { mentions, senderID } = event;

    if (!mentions || Object.keys(mentions).length === 0) return;

    const mentionedIDs = Object.keys(mentions);

    for (const targetID of mentionedIDs) {
      if (targetID === senderID) continue;

      try {
        const userData = await usersData.get(targetID);
        const busyInfo = userData?.data?.busy;

        if (busyInfo && busyInfo.status) {
          const userName = mentions[targetID].replace(/@/g, "");
          
          return message.reply(
            `🚫 ${userName} বর্তমানে ব্যস্ত আছেন!\n\n` +
            `📝 কারণ: ${busyInfo.reason}\n` +
            `⏰ যে সময় থেকে ব্যস্ত: ${busyInfo.time}\n\n` +
            `⚠️ অনুগ্রহ করে জরুরি প্রয়োজন ছাড়া বার বার ট্যাগ করবেন না।`
          );
        }
      } catch (err) {
        continue;
      }
    }
  }
};
